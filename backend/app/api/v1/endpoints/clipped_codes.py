from fastapi import APIRouter, HTTPException
from typing import List
from ....schemas.clipped_code import ClippedCodeCreate, ClippedCodeUpdate, ClippedCodeResponse
from app.db import prisma
from datetime import datetime

router = APIRouter()

# Create clipped code
@router.post("/", response_model=ClippedCodeResponse)
async def create_clipped_code(clipped_code: ClippedCodeCreate):
    try:
        user = await prisma.user.find_unique(where={"id": clipped_code.userId})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        db_clipped_code = await prisma.clippedcode.create(
            data={
                "userId": clipped_code.userId,
                "title": clipped_code.title,
                "codeContent": clipped_code.codeContent,
                "language": clipped_code.language,
                "isAiGenerated": clipped_code.isAiGenerated,
                "notes": clipped_code.notes,
                "timeComplexity": clipped_code.timeComplexity,
                "spaceComplexity": clipped_code.spaceComplexity
            }
        )
        return db_clipped_code
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Get clipped code by id
@router.get("/{clipped_code_id}", response_model=ClippedCodeResponse)
async def get_clipped_code(clipped_code_id: str):
    clipped_code = await prisma.clippedcode.find_unique(
        where={"id": clipped_code_id}
    )
    if not clipped_code:
        raise HTTPException(status_code=404, detail="Clipped code not found")
    return clipped_code

# Get all clipped codes for a user
@router.get("/user/{user_id}", response_model=List[ClippedCodeResponse])
async def get_user_clipped_codes(user_id: str):
    clipped_codes = await prisma.clippedcode.find_many(
        where={"userId": user_id},
        order={"createdAt": "desc"}
    )
    return clipped_codes

# Update clipped code
@router.patch("/{clipped_code_id}", response_model=ClippedCodeResponse)
async def update_clipped_code(clipped_code_id: str, update_data: ClippedCodeUpdate):
    try:
        current_code = await prisma.clippedcode.find_unique(
            where={"id": clipped_code_id}
        )
        if not current_code:
            raise HTTPException(status_code=404, detail="Clipped code not found")
            
        update_fields = {}
        for field in ["title", "codeContent", "language", "isAiGenerated", 
                      "notes", "timeComplexity", "spaceComplexity"]:
            if getattr(update_data, field) is not None:
                update_fields[field] = getattr(update_data, field)

        clipped_code = await prisma.clippedcode.update(
            where={"id": clipped_code_id},
            data=update_fields
        )
        return clipped_code
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Delete clipped code
@router.delete("/{clipped_code_id}")
async def delete_clipped_code(clipped_code_id: str):
    try:
        current_code = await prisma.clippedcode.find_unique(
            where={"id": clipped_code_id}
        )
        if not current_code:
            raise HTTPException(status_code=404, detail="Clipped code not found")
            
        await prisma.clippedcode.delete(
            where={"id": clipped_code_id}
        )
        return {"message": "Clipped code deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 