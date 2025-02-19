from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ClippedCodeBase(BaseModel):
    title: str
    codeContent: str
    language: str
    isAiGenerated: bool = False
    notes: Optional[str] = None
    timeComplexity: Optional[str] = None
    spaceComplexity: Optional[str] = None

class ClippedCodeCreate(ClippedCodeBase):
    userId: str

class ClippedCodeUpdate(BaseModel):
    title: Optional[str] = None
    codeContent: Optional[str] = None
    language: Optional[str] = None
    isAiGenerated: Optional[bool] = None
    notes: Optional[str] = None
    timeComplexity: Optional[str] = None
    spaceComplexity: Optional[str] = None

class ClippedCodeResponse(ClippedCodeBase):
    id: str
    userId: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True 