from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "ClipCodeAI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    OPENAI_API_KEY: str  

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow" 

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()