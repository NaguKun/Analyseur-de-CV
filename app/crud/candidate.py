from typing import List, Optional, Dict, Any
from app.schemas.candidate import CandidateCreate
from app.core.supabase import get_supabase
from datetime import datetime
import json

def _serialize_datetimes(data: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively serialize datetime objects to ISO 8601 strings."""
    serialized_data = {}
    for key, value in data.items():
        if isinstance(value, datetime):
            # Convert datetime to ISO 8601 string, handle potential timezone issues if necessary
            serialized_data[key] = value.isoformat()
        elif isinstance(value, dict):
            serialized_data[key] = _serialize_datetimes(value)
        elif isinstance(value, list):
            serialized_data[key] = [_serialize_datetimes(item) if isinstance(item, (dict, list)) else item for item in value]
        else:
            serialized_data[key] = value
    return serialized_data

def create_candidate(candidate_data: CandidateCreate, embeddings: Optional[dict] = None) -> Dict[str, Any]:
    """Create a new candidate with all related data using Supabase."""
    supabase = get_supabase()
    
    try:
        # Start a transaction (Supabase client doesn't have explicit transactions, 
        # but we can structure inserts sequentially and handle errors)
        candidate_dict = candidate_data.model_dump()
        
        # Add embeddings if provided
        if embeddings:
            candidate_dict.update({
                "experience_embedding": embeddings.get('experience_embedding'),
                "skills_embedding": embeddings.get('skills_embedding')
            })
        
        # Remove all related table fields from main candidate dict since they are in separate tables
        fields_to_remove = ['education', 'work_experience', 'skills', 'projects', 'certifications']
        for field in fields_to_remove:
            candidate_dict.pop(field, None)
        
        # Serialize datetimes in the main candidate dictionary
        serialized_candidate_dict = _serialize_datetimes(candidate_dict)
        
        # Insert candidate
        # Note: Supabase client insert execute() returns a PostgrestResponse object
        # Use .model_dump_json() for more complex Pydantic models if needed, but simple dict should work
        candidate_response = supabase.table('candidates').insert(serialized_candidate_dict).execute()
        
        if not candidate_response.data:
            raise Exception("Failed to create candidate in main table")
        
        candidate = candidate_response.data[0]
        candidate_id = candidate['id']
        
        # Insert education entries
        education_data = []
        for edu in candidate_data.education:
            edu_dict = edu.model_dump()
            edu_dict['candidate_id'] = candidate_id
            education_data.append(_serialize_datetimes(edu_dict))
        if education_data:
             supabase.table('education').insert(education_data).execute()
        
        # Insert work experience entries
        work_experience_data = []
        for exp in candidate_data.work_experience:
            exp_dict = exp.model_dump()
            exp_dict['candidate_id'] = candidate_id
            work_experience_data.append(_serialize_datetimes(exp_dict))
        if work_experience_data:
            supabase.table('work_experience').insert(work_experience_data).execute()
        
        # Insert skills and create candidate_skills relationships
        for skill_name in candidate_data.skills:
            # First, get or create skill
            skill_response = supabase.table('skills').select('id').eq('name', skill_name).execute()
            skill_id = None
            if skill_response.data:
                skill_id = skill_response.data[0]['id']
            else:
                # Insert skill if it doesn't exist
                insert_skill_response = supabase.table('skills').insert({'name': skill_name}).execute()
                if insert_skill_response.data:
                     skill_id = insert_skill_response.data[0]['id']

            if skill_id:
                # Create relationship, check if it already exists to avoid errors
                relationship_response = supabase.table('candidate_skills').select('*').eq('candidate_id', candidate_id).eq('skill_id', skill_id).execute()
                if not relationship_response.data:
                     supabase.table('candidate_skills').insert({
                        'candidate_id': candidate_id,
                         'skill_id': skill_id
                     }).execute()

        
        # Insert projects
        projects_data = []
        for proj in candidate_data.projects:
            proj_dict = proj.model_dump()
            proj_dict['candidate_id'] = candidate_id
            projects_data.append(_serialize_datetimes(proj_dict))
        if projects_data:
            supabase.table('projects').insert(projects_data).execute()
        
        # Insert certifications
        certifications_data = []
        for cert in candidate_data.certifications:
            cert_dict = cert.model_dump()
            cert_dict['candidate_id'] = candidate_id
            certifications_data.append(_serialize_datetimes(cert_dict))
        if certifications_data:
            supabase.table('certifications').insert(certifications_data).execute()
        
        # Get the complete candidate data
        response = supabase.table('candidates').select('*').eq('id', candidate_id).execute()
        return response.data[0]
        
    except Exception as e:
        raise Exception(f"Error creating candidate: {str(e)}")

def get_candidate(candidate_id: int) -> Optional[Dict[str, Any]]:
    """Get a candidate by ID."""
    supabase = get_supabase()
    response = supabase.table('candidates').select('*').eq('id', candidate_id).execute()
    return response.data[0] if response.data else None

def get_candidates(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Get a list of candidates with optional search."""
    supabase = get_supabase()
    query = supabase.table('candidates').select('*')
    
    if search:
        query = query.or_(f"full_name.ilike.%{search}%,email.ilike.%{search}%,location.ilike.%{search}%")
    
    response = query.range(skip, skip + limit - 1).execute()
    return response.data

def update_candidate(
    candidate_id: int,
    candidate_data: CandidateCreate
) -> Optional[Dict[str, Any]]:
    """Update a candidate and all related data."""
    supabase = get_supabase()
    
    try:
        # Update basic info
        candidate_dict = candidate_data.model_dump()
        supabase.table('candidates').update(candidate_dict).eq('id', candidate_id).execute()
        
        # Delete existing related data
        supabase.table('education').delete().eq('candidate_id', candidate_id).execute()
        supabase.table('work_experience').delete().eq('candidate_id', candidate_id).execute()
        supabase.table('candidate_skills').delete().eq('candidate_id', candidate_id).execute()
        supabase.table('projects').delete().eq('candidate_id', candidate_id).execute()
        supabase.table('certifications').delete().eq('candidate_id', candidate_id).execute()
        
        # Recreate related data (similar to create_candidate)
        for edu in candidate_data.education:
            edu_dict = edu.model_dump()
            edu_dict['candidate_id'] = candidate_id
            supabase.table('education').insert(edu_dict).execute()
        
        for exp in candidate_data.work_experience:
            exp_dict = exp.model_dump()
            exp_dict['candidate_id'] = candidate_id
            supabase.table('work_experience').insert(exp_dict).execute()
        
        for skill_name in candidate_data.skills:
            skill_response = supabase.table('skills').select('id').eq('name', skill_name).execute()
            if not skill_response.data:
                skill_response = supabase.table('skills').insert({'name': skill_name}).execute()
            skill_id = skill_response.data[0]['id']
            
            supabase.table('candidate_skills').insert({
                'candidate_id': candidate_id,
                'skill_id': skill_id
            }).execute()
        
        for proj in candidate_data.projects:
            proj_dict = proj.model_dump()
            proj_dict['candidate_id'] = candidate_id
            supabase.table('projects').insert(proj_dict).execute()
        
        for cert in candidate_data.certifications:
            cert_dict = cert.model_dump()
            cert_dict['candidate_id'] = candidate_id
            supabase.table('certifications').insert(cert_dict).execute()
        
        # Get updated candidate data
        response = supabase.table('candidates').select('*').eq('id', candidate_id).execute()
        return response.data[0] if response.data else None
        
    except Exception as e:
        raise Exception(f"Error updating candidate: {str(e)}")

def delete_candidate(candidate_id: int) -> bool:
    """Delete a candidate and all related data."""
    supabase = get_supabase()
    try:
        # Delete candidate (cascade will handle related data)
        response = supabase.table('candidates').delete().eq('id', candidate_id).execute()
        return bool(response.data)
    except Exception as e:
        raise Exception(f"Error deleting candidate: {str(e)}") 