import logging
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.base_class import Base
from app.db.session import engine
from app.db.models import *  # noqa

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db() -> None:
    try:
        # Enable pgvector extension
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            conn.commit()
            logger.info("pgvector extension enabled")
        
        # Create tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        
        # Create vector indexes
        create_vector_indexes()
        logger.info("Vector indexes created successfully")
        
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise

if __name__ == "__main__":
    logger.info("Creating initial database tables")
    init_db()
    logger.info("Database initialization completed") 