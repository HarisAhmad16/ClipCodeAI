from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from ....schemas.user import UserCreate, UserResponse, PasswordUpdate
from ....core.security import get_password_hash, verify_password, create_access_token, decode_access_token
from app.db import prisma
from datetime import datetime, timedelta
import re
from ....schemas.auth import Token, LoginData 

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def validate_password(password: str) -> bool:
    """
    Validate password strength.
    Must be at least 8 characters long and contain:
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
    """
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True

# Create user
@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate):
    try:
        existing_user = await prisma.user.find_unique(
            where={"email": user.email}
        )
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        if not validate_password(user.password):
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters"
            )

        hashed_password = get_password_hash(user.password)

        db_user = await prisma.user.create(
            data={
                "email": user.email,
                "name": user.name,
                "password": hashed_password
            }
        )
        
        user_response = UserResponse(
            id=db_user.id,
            email=db_user.email,
            name=db_user.name,
            createdAt=db_user.createdAt,
            updatedAt=db_user.updatedAt
        )
        return user_response

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Get current user
@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        user_id = decode_access_token(token)
        
        user = await prisma.user.find_unique(
            where={"id": user_id}
        )
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        return user
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
        )

# Get user by id
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    user = await prisma.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Login
@router.post("/login", response_model=Token)
async def login(login_data: LoginData):
    try:
        user = await prisma.user.find_unique(
            where={"email": login_data.email}
        )
        
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Email not found"
            )

        if not verify_password(login_data.password, user.password):
            raise HTTPException(
                status_code=401,
                detail="Incorrect password"
            )

        access_token_expires = timedelta(minutes=30) # logging user out after 30 minutes
        access_token = create_access_token(
            data={"sub": user.id},  
            expires_delta=access_token_expires
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Update password
@router.patch("/{user_id}/password")
async def update_password(user_id: str, password_data: PasswordUpdate):
    try:
        user = await prisma.user.find_unique(where={"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if not verify_password(password_data.currentPassword, user.password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        if not validate_password(password_data.newPassword):
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters"
            )
        
        hashed_password = get_password_hash(password_data.newPassword)
        
        updated_user = await prisma.user.update(
            where={"id": user_id},
            data={"password": hashed_password}
        )
        
        return {"message": "Password updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 