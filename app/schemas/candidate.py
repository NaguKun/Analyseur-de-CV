from pydantic import BaseModel, EmailStr, HttpUrl, Field, validator
from typing import List, Optional
from datetime import datetime
import re

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

class CandidateBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None

    @validator('phone')
    def validate_phone(cls, v):
        if v is not None:
            # Relaxed phone number validation: allow +, digits, spaces, dashes
            if not re.match(r'^\+?\d[\d\s\-]{8,19}$', v):
                raise ValueError('Invalid phone number format')
        return v

class CandidateCreate(CandidateBase):
    skills: Optional[List[str]] = None
    education: Optional[List[EducationCreate]] = None
    work_experience: Optional[List[WorkExperienceCreate]] = None
    certifications: Optional[List[CertificationCreate]] = None
    projects: Optional[List[ProjectCreate]] = None

class CandidateUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    cv_file_id: Optional[str] = None
    cv_text: Optional[str] = None

    @validator('phone')
    def validate_phone(cls, v):
        if v is not None:
            if not re.match(r'^\+?1?\d{9,15}$', v):
                raise ValueError('Invalid phone number format')
        return v

class CandidateResponse(CandidateBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    skills: List[SkillBase] = []
    cv_file_id: Optional[str] = None

    class Config:
        from_attributes = True

class CandidateDetail(CandidateResponse):
    education: List[EducationBase] = []
    work_experience: List[WorkExperienceBase] = []
    certifications: List[CertificationBase] = []
    projects: List[ProjectBase] = []
    cv_text: Optional[str] = None

    class Config:
        from_attributes = True

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