from openai import OpenAI
from supabase import create_client, Client
import numpy as np
from dotenv import load_dotenv
import os
load_dotenv()
# 1. Khởi tạo Supabase client
SUPABASE_URL=os.getenv("SUPABASE_URL")
SUPABASE_KEY=os.getenv("SUPABASE_KEY")

# 2. Tạo embedding vector từ truy vấn người dùng
import openai

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_embedding(text: str, model="text-embedding-ada-002") -> list[float]:
    response = client.embeddings.create(input=[text], model=model)
    return response.data[0].embedding

# Ví dụ
query = "Python backend development with FastAPI"
query_embedding = get_embedding(query)

# 3. Thực hiện truy vấn SQL để tìm nearest neighbors theo cosine distance
def semantic_search(embedding: list[float], field: str = "skills_embedding", top_k: int = 5):
    # PostgreSQL cosine distance: 1 - (dot_product / (norm1 * norm2))
    embedding_str = str(embedding).replace('[', '(').replace(']', ')')
    sql = f"""
        SELECT id, name, {field} <#> '{embedding_str}' AS distance
        FROM candidates
        ORDER BY {field} <#> '{embedding_str}'
        LIMIT {top_k};
    """
    result = supabase.rpc("sql", {"query": sql}).execute()
    return result.data

results = semantic_search(query_embedding, field="skills_embedding")
for r in results:
    print(f"{r['name']} - similarity: {1 - r['distance']:.4f}")
