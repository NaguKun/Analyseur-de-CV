from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os
from dotenv import load_dotenv

# Load .env file manually (optional if using SettingsConfigDict)
load_dotenv()

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Candidate Management API"
    
    # Supabase Settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # OpenAI Settings (for embeddings)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    
    # Vector Search Settings
    VECTOR_DIMENSION: int = 1536  # OpenAI ada-002 embedding dimension
    SIMILARITY_THRESHOLD: float = 0.7
    
    # File Upload Settings
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {"pdf", "doc", "docx"}
    
    # Application Settings
    APP_NAME: str = "CV Analysis System"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # Database Settings (Supabase)
    DATABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    VECTOR_DB_TABLE: str = "candidate_embeddings"
    
    # LLM Settings
    LLM_PROVIDER: str = "openai"
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    EMBEDDING_MODEL: str = "text-embedding-ada-002"  # Updated to newer, faster model
    
    # Legacy Mistral settings (will be removed in future)
    MISTRAL_API_KEY: Optional[str] = None
    MISTRAL_MODEL: Optional[str] = None
    
    # Google Drive Settings
    GOOGLE_DRIVE_CREDENTIALS_FILE: str
    GOOGLE_DRIVE_FOLDER_ID: str
    GOOGLE_DRIVE_APPLICATION_NAME: str = "CV Analysis System"
    
    # File Upload Settings
    UPLOAD_FOLDER: str = "./data/uploads"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Supabase settings
    SUPABASE_DB_HOST: str
    SUPABASE_DB_PORT: str = "5432"
    SUPABASE_DB_NAME: str
    SUPABASE_DB_USER: str
    SUPABASE_DB_PASSWORD: str

    # ✅ Fix cho Pydantic v2
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"  # Allow extra fields in .env file
    )

# Create settings instance
settings = Settings()

# Ensure required directories exist
os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
