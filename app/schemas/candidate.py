from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional
from datetime import datetime

# Base models for nested structures
class EducationBase(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    start_date: datetime
    end_date: Optional[datetime] = None
    description: Optional[str] = None

class WorkExperienceBase(BaseModel):
    company: str
    position: str
    start_date: datetime
    end_date: Optional[datetime] = None
    description: str
    achievements: Optional[List[str]] = None
    location: Optional[str] = None

class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None

class ProjectBase(BaseModel):
    name: str
    description: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    technologies: Optional[List[str]] = None
    url: Optional[HttpUrl] = None

class CertificationBase(BaseModel):
    name: str
    issuer: str
    issue_date: datetime
    expiry_date: Optional[datetime] = None
    credential_id: Optional[str] = None
    credential_url: Optional[HttpUrl] = None

# Create models (for input)
class EducationCreate(EducationBase):
    pass

class WorkExperienceCreate(WorkExperienceBase):
    pass

class SkillCreate(SkillBase):
    pass

class ProjectCreate(ProjectBase):
    pass

class CertificationCreate(CertificationBase):
    pass

class CandidateCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    education: List[EducationCreate]
    work_experience: List[WorkExperienceCreate]
    skills: List[str]  # List of skill names
    projects: List[ProjectCreate]
    certifications: List[CertificationCreate]
    cv_file_id: Optional[str] = None  # Google Drive file ID

# Response models (for output)
class Education(EducationBase):
    id: int
    candidate_id: int

    class Config:
        from_attributes = True

class WorkExperience(WorkExperienceBase):
    id: int
    candidate_id: int

    class Config:
        from_attributes = True

class Skill(SkillBase):
    id: int

    class Config:
        from_attributes = True

class Project(ProjectBase):
    id: int
    candidate_id: int

    class Config:
        from_attributes = True

class Certification(CertificationBase):
    id: int
    candidate_id: int

    class Config:
        from_attributes = True

class Candidate(BaseModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    cv_file_id: str  # Google Drive file ID
    cv_text: str
    cv_vector_id: Optional[str] = None
    education: List[Education]
    work_experience: List[WorkExperience]
    skills: List[Skill]
    projects: List[Project]
    certifications: List[Certification]

    class Config:
        from_attributes = True

# Search and filter models
class CandidateSearch(BaseModel):
    query: str
    min_experience_years: Optional[int] = None
    required_skills: Optional[List[str]] = None
    location: Optional[str] = None
    education_level: Optional[str] = None
    limit: int = 10
    offset: int = 0

class CandidateFilter(BaseModel):
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    min_experience_years: Optional[int] = None
    education_level: Optional[str] = None
    limit: int = 10
    offset: int = 0 