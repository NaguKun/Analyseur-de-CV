from dotenv import load_dotenv, find_dotenv
import os

# Tìm và load file .env
env_path = find_dotenv()
loaded = load_dotenv(dotenv_path=env_path)

print(f"[DEBUG] .env found at: {env_path}")
print(f"[DEBUG] .env loaded: {loaded}")

# Kiểm tra một vài biến môi trường chính
required_vars = [
    "DATABASE_URL",
    "SUPABASE_URL",
    "SUPABASE_KEY",
    "SUPABASE_SERVICE_KEY",
    "OPENAI_API_KEY",
    "GOOGLE_DRIVE_CREDENTIALS_FILE",
    "GOOGLE_DRIVE_FOLDER_ID",
    "SECRET_KEY"
]

for var in required_vars:
    value = os.getenv(var)
    if value is None:
        print(f"[MISSING] {var} is NOT set!")
    else:
        print(f"[OK] {var} = {value[:6]}... (length={len(value)})")  # Print preview
