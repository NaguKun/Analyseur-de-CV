from supabase import create_client, Client
from fastapi import Depends
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

def get_supabase_client() -> Client:
    """
    Get a Supabase client instance.
    This function is used as a FastAPI dependency to inject the Supabase client.
    """
    try:
        client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
        return client
    except Exception as e:
        logger.error(f"Failed to create Supabase client: {str(e)}")
        raise

# Singleton instance for use outside of FastAPI endpoints
supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_KEY
)

def get_supabase():
    """Get Supabase client instance."""
    return supabase 