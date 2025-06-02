from fastapi import FastAPI
from sqlalchemy import create_engine, text
import os

app = FastAPI()

# Cấu hình DATABASE_URL từ environment variable hoặc gán trực tiếp
DATABASE_URL = "postgresql://postgres:Tumaithenhan2107$@qkdlkptrqoyrovuxmsve.supabase.co:5432/postgres"

# Tạo engine SQLAlchemy
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

@app.get("/ping")
def ping_db():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1")).scalar()
            return {"status": "ok", "result": result}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
