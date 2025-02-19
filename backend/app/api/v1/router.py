from fastapi import APIRouter
from .endpoints import users, clipped_codes, ai

router = APIRouter()

router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(clipped_codes.router, prefix="/clipped-codes", tags=["clipped-codes"])
router.include_router(ai.router, prefix="/ai", tags=["ai"])