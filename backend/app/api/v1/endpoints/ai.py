from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from openai import OpenAI
import os
from app.db import prisma
from datetime import datetime

router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatMessage(BaseModel):
    role: str
    content: str
    user_id: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

def extract_code_blocks(content: str):
    lines = content.split('\n')
    title = None
    language = None
    notes = None
    time_complexity = "N/A"
    space_complexity = "N/A"
    content_lines = []
    
    collecting_notes = False
    notes_lines = []
    
    for line in lines:
        line = line.strip()
        if line.startswith('Title:'):
            title = line.replace('Title:', '').strip()
        elif line.startswith('Language:'):
            language = line.replace('Language:', '').strip()
        elif line.startswith('Time Complexity:'):
            time_complexity = line.replace('Time Complexity:', '').strip() or "N/A"
        elif line.startswith('Space Complexity:'):
            space_complexity = line.replace('Space Complexity:', '').strip() or "N/A"
        elif line.startswith('Notes:'):
            collecting_notes = True
            notes = line.replace('Notes:', '').strip()
            if notes:  
                notes_lines.append(notes)
        elif collecting_notes and line and not line.startswith('```'):
            notes_lines.append(line)
        elif line.startswith('```'):
            collecting_notes = False
        else:
            content_lines.append(line)
    
    notes = ' '.join(notes_lines).strip() if notes_lines else "No explanation provided."
    
    parts = content.split("```")
    if len(parts) < 3:
        return ' '.join(content_lines), None, title, language, notes, time_complexity, space_complexity
    
    full_code_block = parts[1].strip()
    
    if not language and '\n' in full_code_block:
        potential_lang = full_code_block.split('\n')[0].strip()
        if potential_lang and ':' not in potential_lang:
            language = potential_lang
            full_code_block = '\n'.join(full_code_block.split('\n')[1:])
    else:
        lines = full_code_block.split('\n')
        if lines[0].strip().lower() == language.lower():
            full_code_block = '\n'.join(lines[1:])
    
    content = parts[0] + parts[2]
    
    return (content.strip(), full_code_block.strip(), title, language, 
            notes, time_complexity, space_complexity)

SYSTEM_MESSAGES = {
    "CODE_INPUT": {
        "role": "system",
        "content": '''You are a programming assistant. For the given code:
1. Suggest a concise, descriptive title that reflects its purpose.
2. Format your response exactly like this:
   Title: [your suggested title]
   No other text please.'''
    },
    "DEFAULT": {
        "role": "system",
        "content": '''You are a programming assistant. For any programming solution you provide:
1. ALWAYS wrap your code in triple backticks (```).
2. ALWAYS include these sections before the code:
   Title: [name of the problem or solution]
   Language: [programming language]
   Time Complexity: [Big O notation if applicable]
   Space Complexity: [Big O notation if applicable]
   Notes: [Explain how the code works, its logic, and any important concepts or algorithms used]
3. If the user hasn't specified a language, ask them which programming language they prefer.
4. Format your response like this example:
   Title: Example Problem
   Language: Python
   Time Complexity: O(n) or N/A if not applicable
   Space Complexity: O(1) or N/A if not applicable
   Notes: This code implements a linear search algorithm. It iterates through each element once, comparing it with the target value. The algorithm uses a single loop and constant extra space, making it memory efficient but potentially slower for large datasets compared to other search algorithms.
   
   ```python
   def example():
       pass
   ```'''
    }
}

@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    try:
        if not client.api_key:
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured"
            )

        user_id = request.messages[0].user_id
        user = await prisma.user.find_unique(
            where={"id": user_id}
        )
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        is_code_input = request.messages[0].content.startswith("CODE_INPUT:")

        system_message = SYSTEM_MESSAGES["CODE_INPUT"] if is_code_input else SYSTEM_MESSAGES["DEFAULT"]

        formatted_messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        response = client.chat.completions.create(
            model="gpt-4o-mini", # Update the model to your choice
            messages=[system_message] + formatted_messages,
            temperature=0.7,
            max_tokens=2000
        )
        
        ai_message = response.choices[0].message
        
        if is_code_input:
            title = ai_message.content.replace("Title:", "").strip()
            return {
                "role": ai_message.role,
                "content": "",
                "code": "",
                "title": title,
                "language": "",
                "notes": "",
                "timeComplexity": "",
                "spaceComplexity": ""
            }

        content, code, title, language, notes, time_complexity, space_complexity = extract_code_blocks(ai_message.content)
        
        return {
            "role": ai_message.role,
            "content": content,
            "code": code,
            "title": title,
            "language": language,
            "notes": notes,
            "timeComplexity": time_complexity,
            "spaceComplexity": space_complexity
        }

    except Exception as e:
        print(f"Error in chat_with_ai: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
