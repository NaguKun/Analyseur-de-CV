from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY
from pgvector.sqlalchemy import Vector
from app.db.base_class import Base

# Association table for candidate skills
candidate_skills = Table(
    'candidate_skills',
    Base.metadata,
    Column('candidate_id', Integer, ForeignKey('candidates.id')),
    Column('skill_id', Integer, ForeignKey('skills.id'))
)

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Personal Information
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    
    # CV Information
    cv_file_id = Column(String, index=True)  # Google Drive file ID
    cv_text = Column(Text)  # Raw extracted text
    
    # Vector embeddings for semantic search
    # Using pgvector extension in Supabase
    experience_embedding = Column(Vector(1536), nullable=True)  # OpenAI embedding dimension
    skills_embedding = Column(Vector(1536), nullable=True)
    
    # Relationships
    education = relationship("Education", back_populates="candidate", cascade="all, delete-orphan")
    work_experience = relationship("WorkExperience", back_populates="candidate", cascade="all, delete-orphan")
    skills = relationship("Skill", secondary=candidate_skills, back_populates="candidates")
    projects = relationship("Project", back_populates="candidate", cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="candidate", cascade="all, delete-orphan")

class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    institution = Column(String)
    degree = Column(String)
    field_of_study = Column(String)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True), nullable=True)
    description = Column(Text, nullable=True)
    
    candidate = relationship("Candidate", back_populates="education")

class WorkExperience(Base):
    __tablename__ = "work_experience"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    company = Column(String, index=True)
    position = Column(String, index=True)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True), nullable=True)
    description = Column(Text)
    achievements = Column(ARRAY(String), nullable=True)
    location = Column(String, nullable=True)
    
    candidate = relationship("Candidate", back_populates="work_experience")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String, nullable=True)  # e.g., "Programming", "Soft Skills"
    embedding = Column(Vector(1536), nullable=True)  # For semantic skill matching
    
    candidates = relationship("Candidate", secondary=candidate_skills, back_populates="skills")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    name = Column(String)
    description = Column(Text)
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    technologies = Column(ARRAY(String), nullable=True)
    url = Column(String, nullable=True)
    
    candidate = relationship("Candidate", back_populates="projects")

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    name = Column(String)
    issuer = Column(String)
    issue_date = Column(DateTime(timezone=True))
    expiry_date = Column(DateTime(timezone=True), nullable=True)
    credential_id = Column(String, nullable=True)
    credential_url = Column(String, nullable=True)
    
    candidate = relationship("Candidate", back_populates="certifications")

# Create indexes for vector similarity search
def create_vector_indexes():
    """Create indexes for vector similarity search."""
    from sqlalchemy import text
    from db.session import engine
    
    with engine.connect() as conn:
        # Create indexes for vector similarity search
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_candidate_experience_embedding 
            ON candidates 
            USING ivfflat (experience_embedding vector_cosine_ops)
            WITH (lists = 100);
        """))
        
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_candidate_skills_embedding 
            ON candidates 
            USING ivfflat (skills_embedding vector_cosine_ops)
            WITH (lists = 100);
        """))
        
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_skill_embedding 
            ON skills 
            USING ivfflat (embedding vector_cosine_ops)
            WITH (lists = 100);
        """))
        
        conn.commit() 