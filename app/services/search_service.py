from typing import List, Optional, Tuple
from supabase import Client
from app.schemas.candidate import CandidateResponse, CandidateDetail
from app.services.embedding_service import generate_query_embeddings
import logging

logger = logging.getLogger(__name__)

class SearchService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    def semantic_search(
        self,
        query: str,
        min_experience_years: Optional[int] = None,
        required_skills: Optional[List[str]] = None,
        location: Optional[str] = None,
        education_level: Optional[str] = None,
        limit: int = 10,
        offset: int = 0
    ) -> List[CandidateDetail]:
        """
        Perform semantic search using vector similarity on experience and skills embeddings,
        with filters compatible with Supabase schema.
        """
        try:
            # Generate embeddings for the search query
            experience_embedding, skills_embedding = generate_query_embeddings(query)

            # Start with base query
            base_query = self.supabase.table('candidates') \
                .select('id, experience_embedding, skills_embedding')

            # Filter: location
            if location:
                base_query = base_query.ilike('location', f'%{location}%')

            # Filter: education_level (by degree field)
            if education_level:
                # Get candidate_ids with matching degree
                edu_res = self.supabase.table('education') \
                    .select('candidate_id') \
                    .eq('degree', education_level) \
                    .execute()
                edu_ids = [row['candidate_id'] for row in edu_res.data or []]
                if edu_ids:
                    base_query = base_query.in_('id', edu_ids)
                else:
                    return []  # No candidates match

            # Filter: required_skills (must have ALL skills)
            if required_skills:
                # Get skill_ids for required_skills
                skill_res = self.supabase.table('skills') \
                    .select('id, name') \
                    .in_('name', required_skills) \
                    .execute()
                skill_ids = [row['id'] for row in skill_res.data or []]
                if not skill_ids or len(skill_ids) < len(required_skills):
                    return []  # Some skills not found
                # Get candidate_ids that have all required skills
                cand_skill_res = self.supabase.table('candidate_skills') \
                    .select('candidate_id, skill_id') \
                    .in_('skill_id', skill_ids) \
                    .execute()
                # Count skills per candidate
                from collections import Counter
                cand_skill_pairs = [(row['candidate_id'], row['skill_id']) for row in cand_skill_res.data or []]
                cand_skill_count = Counter([pair[0] for pair in cand_skill_pairs])
                # Only candidates with all required skills
                candidate_ids = [cand_id for cand_id, count in cand_skill_count.items() if count == len(skill_ids)]
                if not candidate_ids:
                    return []
                base_query = base_query.in_('id', candidate_ids)

            # Filter: min_experience_years (sum years in work_experience)
            if min_experience_years:
                # Get candidate_ids with enough experience
                work_exp_res = self.supabase.table('work_experience') \
                    .select('candidate_id, start_date, end_date') \
                    .execute()
                from datetime import datetime
                from collections import defaultdict
                exp_years = defaultdict(float)
                now = datetime.now()
                for row in work_exp_res.data or []:
                    start = row.get('start_date')
                    end = row.get('end_date') or now.isoformat()
                    try:
                        start_dt = datetime.fromisoformat(str(start))
                        end_dt = datetime.fromisoformat(str(end))
                        years = (end_dt - start_dt).days / 365.25
                        exp_years[row['candidate_id']] += max(0, years)
                    except Exception:
                        continue
                qualified_ids = [cand_id for cand_id, years in exp_years.items() if years >= min_experience_years]
                if not qualified_ids:
                    return []
                base_query = base_query.in_('id', qualified_ids)

            # Pagination
            base_query = base_query.range(offset, offset + limit - 1)

            # Execute the query
            result = base_query.execute()
            if not result.data:
                return []
            candidates_with_scores = []
            # Debug: print candidate count after filters
           # print("Candidates after filters:", len(result.data))
            import json
            for candidate in result.data:
                exp_emb = candidate['experience_embedding']
                skills_emb = candidate['skills_embedding']

                # Parse embeddings if they are JSON strings
                if isinstance(exp_emb, str):
                    try:
                        exp_emb = json.loads(exp_emb)
                    except Exception as e:
                        continue
                if isinstance(skills_emb, str):
                    try:
                        skills_emb = json.loads(skills_emb)
                    except Exception as e:
                        continue

                if exp_emb and skills_emb:
                    exp_similarity = self._cosine_similarity(
                        experience_embedding,
                        exp_emb
                    )
                    skills_similarity = self._cosine_similarity(
                        skills_embedding,
                        skills_emb
                    )
                    avg_similarity = (exp_similarity + skills_similarity) / 2
                    print(f"Candidate {candidate.get('id')} avg_similarity: {avg_similarity}")
                    candidates_with_scores.append((candidate['id'], avg_similarity))

            # Filter by similarity threshold and sort
            SIMILARITY_THRESHOLD = 0.8
            filtered_candidates = [
                (cid, score) for cid, score in candidates_with_scores if score >= SIMILARITY_THRESHOLD
            ]
            filtered_candidates.sort(key=lambda x: x[1], reverse=True)

            # Get full candidate details (top N)
            candidate_ids = [c[0] for c in filtered_candidates[:limit]]

            return self._get_candidates_by_ids(candidate_ids)
            
        except Exception as e:
            logger.error(f"Error in semantic search: {str(e)}")
            raise

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        try:
            import numpy as np
            vec1 = np.array(vec1)
            vec2 = np.array(vec2)

            return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))
        except Exception as e:
            logger.error(f"Error calculating cosine similarity: {str(e)}")
            return 0.0

    def filter_candidates(
        self,
        skills: Optional[List[str]] = None,
        location: Optional[str] = None,
        min_experience_years: Optional[int] = None,
        education_level: Optional[str] = None,
        limit: int = 10,
        offset: int = 0
    ) -> List[CandidateDetail]:
        """
        Filter candidates based on specific criteria using traditional database queries.
        Returns a list of CandidateDetail.
        """
        try:
            candidate_ids = None

            # Filter by location
            if location:
                loc_res = self.supabase.table('candidates')\
                    .select('id')\
                    .ilike('location', f'%{location}%')\
                    .execute()
                location_ids = {row['id'] for row in loc_res.data or []}
                print(f"[DEBUG] Location filter matched IDs: {location_ids}")
                candidate_ids = location_ids if candidate_ids is None else candidate_ids & location_ids

            # Filter by education level
            if education_level:
                edu_res = self.supabase.table('education')\
                    .select('candidate_id')\
                    .eq('degree', education_level)\
                    .execute()
                edu_ids = {row['candidate_id'] for row in edu_res.data or []}
                print(f"[DEBUG] Education filter matched IDs: {edu_ids}")
                candidate_ids = edu_ids if candidate_ids is None else candidate_ids & edu_ids

            # Filter by skills (must have all skills)
            if skills:
                skill_res = self.supabase.table('skills')\
                    .select('id, name')\
                    .in_('name', skills)\
                    .execute()
                skill_ids = [row['id'] for row in skill_res.data or []]
                print(f"[DEBUG] Skill names: {skills} → skill IDs found: {skill_ids}")

                if not skill_ids or len(skill_ids) < len(skills):
                    print("[DEBUG] Not all skills found → returning empty result")
                    return []

                cand_skill_res = self.supabase.table('candidate_skills')\
                    .select('candidate_id, skill_id')\
                    .in_('skill_id', skill_ids)\
                    .execute()
                from collections import Counter
                cand_skill_pairs = [(row['candidate_id'], row['skill_id']) for row in cand_skill_res.data or []]
                skill_count = Counter([pair[0] for pair in cand_skill_pairs])
                skill_match_ids = {cand_id for cand_id, count in skill_count.items() if count == len(skill_ids)}
                print(f"[DEBUG] Skills match candidate IDs: {skill_match_ids}")
                candidate_ids = skill_match_ids if candidate_ids is None else candidate_ids & skill_match_ids

            # Filter by experience
            if min_experience_years:
                work_exp_res = self.supabase.table('work_experience')\
                    .select('candidate_id, start_date, end_date')\
                    .execute()
                from collections import defaultdict
                from datetime import datetime
                now = datetime.now()
                exp_years = defaultdict(float)
                for row in work_exp_res.data or []:
                    start = row.get('start_date')
                    end = row.get('end_date') or now.isoformat()
                    try:
                        start_dt = datetime.fromisoformat(str(start))
                        end_dt = datetime.fromisoformat(str(end))
                        years = (end_dt - start_dt).days / 365.25
                        exp_years[row['candidate_id']] += max(0, years)
                    except Exception as ex:
                        print(f"[DEBUG] Error parsing dates: {ex} — row: {row}")
                        continue
                qualified_ids = {cand_id for cand_id, years in exp_years.items() if years >= min_experience_years}
                print(f"[DEBUG] Experience filter matched IDs: {qualified_ids}")
                candidate_ids = qualified_ids if candidate_ids is None else candidate_ids & qualified_ids

            # Handle pagination and fallback if no filters
            if candidate_ids is None:
                result = self.supabase.table('candidates')\
                    .select('id')\
                    .range(offset, offset + limit - 1)\
                    .execute()
                candidate_ids = [row['id'] for row in result.data or []]
                print(f"[DEBUG] No filters → return paginated candidates: {candidate_ids}")
            else:
                candidate_ids = list(candidate_ids)
                print(f"[DEBUG] Candidate IDs after filters (before pagination): {candidate_ids}")
                candidate_ids = candidate_ids[offset:offset + limit]
                print(f"[DEBUG] Candidate IDs after pagination: {candidate_ids}")

            if not candidate_ids:
                print("[DEBUG] No matching candidates after all filters")
                return []

            return self._get_candidates_by_ids(candidate_ids)

        except Exception as e:
            print(f"[ERROR] filter_candidates: {str(e)}")
            raise


    def _get_candidates_by_ids(self, candidate_ids: List[int]) -> List[CandidateDetail]:
        """Get full candidate details for a list of candidate IDs"""
        try:
            if not candidate_ids:
                return []
                
            result = self.supabase.table('candidates')\
                .select('*, skills(*), education(*), work_experience(*), certifications(*), projects(*)')\
                .in_('id', candidate_ids)\
                .execute()
            
            return [CandidateDetail(**candidate) for candidate in result.data]
        except Exception as e:
            logger.error(f"Error getting candidates by IDs: {str(e)}")
            raise

    def get_all_skills(self, limit: int = 100) -> List[str]:
        """Get a list of all unique skills"""
        try:
            result = self.supabase.table('skills')\
                .select('name')\
                .order('name')\
                .limit(limit)\
                .execute()
            
            return [skill['name'] for skill in result.data]
        except Exception as e:
            logger.error(f"Error getting skills: {str(e)}")
            raise

    def get_all_locations(self, limit: int = 100) -> List[str]:
        """Get a list of all unique locations"""
        try:
            result = self.supabase.table('candidates')\
                .select('location')\
                .not_.is_('location', 'null')\
                .order('location')\
                .limit(limit)\
                .execute()
            
            # Get unique locations
            locations = set()
            for candidate in result.data:
                if candidate['location']:
                    locations.add(candidate['location'])
            
            return sorted(list(locations))
        except Exception as e:
            logger.error(f"Error getting locations: {str(e)}")
            raise 