from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.schemas.candidate import Candidate, CandidateSearch, CandidateFilter
from app.services.search.search_service import SearchService
from app.core.config import settings
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/semantic", response_model=List[Candidate])
async def semantic_search(
    search: CandidateSearch,
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """
    Search candidates using semantic search on work experience and skills.
    This endpoint uses vector similarity search to find candidates whose
    experience and skills best match the search query.
    """
    try:
        search_service = SearchService(db)
        results = await search_service.semantic_search(
            query=search.query,
            min_experience_years=search.min_experience_years,
            required_skills=search.required_skills,
            location=search.location,
            education_level=search.education_level,
            limit=limit,
            offset=offset
        )
        return results
    except Exception as e:
        logger.error(f"Error in semantic search: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Search failed: {str(e)}"
        )

@router.post("/filter", response_model=List[Candidate])
async def filter_candidates(
    filter_params: CandidateFilter,
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """
    Filter candidates based on specific criteria.
    This endpoint uses traditional database queries to filter candidates
    based on exact matches of skills, location, experience, etc.
    """
    try:
        search_service = SearchService(db)
        results = await search_service.filter_candidates(
            skills=filter_params.skills,
            location=filter_params.location,
            min_experience_years=filter_params.min_experience_years,
            education_level=filter_params.education_level,
            limit=limit,
            offset=offset
        )
        return results
    except Exception as e:
        logger.error(f"Error in filter search: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Filter search failed: {str(e)}"
        )

@router.get("/skills", response_model=List[str])
async def get_skills(
    db: Session = Depends(get_db),
    limit: int = Query(100, ge=1, le=1000)
):
    """
    Get a list of all unique skills in the database.
    This endpoint is useful for building skill filters in the UI.
    """
    try:
        search_service = SearchService(db)
        return await search_service.get_all_skills(limit=limit)
    except Exception as e:
        logger.error(f"Error getting skills: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get skills: {str(e)}"
        )

@router.get("/locations", response_model=List[str])
async def get_locations(
    db: Session = Depends(get_db),
    limit: int = Query(100, ge=1, le=1000)
):
    """
    Get a list of all unique locations in the database.
    This endpoint is useful for building location filters in the UI.
    """
    try:
        search_service = SearchService(db)
        return await search_service.get_all_locations(limit=limit)
    except Exception as e:
        logger.error(f"Error getting locations: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get locations: {str(e)}"
        ) 