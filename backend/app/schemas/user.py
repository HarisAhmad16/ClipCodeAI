from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True

class PasswordUpdate(BaseModel):
    currentPassword: str
    newPassword: str 