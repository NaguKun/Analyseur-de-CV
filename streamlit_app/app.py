import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import os
from pathlib import Path
import json
from typing import Dict, List, Optional
import requests
from io import BytesIO

# API Configuration
API_BASE_URL = "http://127.0.0.1:8000/api/v1"

# Set page config
st.set_page_config(
    page_title="CV Analysis Dashboard",
    page_icon="📄",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        padding: 2rem;
    }
    .stButton>button {
        width: 100%;
    }
    .upload-section {
        background-color: #f0f2f6;
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
    }
    </style>
""", unsafe_allow_html=True)

def upload_cv_to_api(file) -> Optional[Dict]:
    """Upload CV to FastAPI backend."""
    try:
        files = {"file": (file.name, file.getvalue(), "application/pdf")}
        response = requests.post(f"{API_BASE_URL}/cv/upload", files=files)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Error uploading CV: {str(e)}")
        return None

def get_candidates() -> List[Dict]:
    """Get all candidates from the API."""
    try:
        response = requests.get(f"{API_BASE_URL}/candidates")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching candidates: {str(e)}")
        return []

def search_candidates(query: str, min_experience: Optional[int] = None, 
                     required_skills: Optional[List[str]] = None,
                     location: Optional[str] = None,
                     education_level: Optional[str] = None) -> List[Dict]:
    """Search candidates using semantic search."""
    try:
        search_data = {
            "query": query,
            "min_experience_years": min_experience,
            "required_skills": required_skills or [],
            "location": location,
            "education_level": education_level
        }
        response = requests.post(f"{API_BASE_URL}/search/semantic", json=search_data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Error searching candidates: {str(e)}")
        return []

def main():
    st.title("📄 CV Analysis Dashboard")
    
    # Sidebar
    st.sidebar.title("Navigation")
    page = st.sidebar.radio("Go to", ["Upload CV", "Candidate Database", "Search", "Analytics"])
    
    if page == "Upload CV":
        show_upload_page()
    elif page == "Candidate Database":
        show_database_page()
    elif page == "Search":
        show_search_page()
    else:
        show_analytics_page()

def show_upload_page():
    st.header("Upload CV")
    
    with st.container():
        st.markdown('<div class="upload-section">', unsafe_allow_html=True)
        
        uploaded_file = st.file_uploader("Choose a PDF file", type=['pdf'])
        
        if uploaded_file is not None:
            # Show file details
            file_details = {
                "Filename": uploaded_file.name,
                "FileSize": f"{uploaded_file.size / 1024:.2f} KB"
            }
            st.json(file_details)
            
            # Process button
            if st.button("Process CV"):
                with st.spinner("Processing CV..."):
                    # Upload to API
                    result = upload_cv_to_api(uploaded_file)
                    
                    if result:
                        st.success("CV processed successfully!")
                        
                        # Show extracted information
                        st.subheader("Extracted Information")
                        st.json({
                            "Name": result["full_name"],
                            "Email": result["email"],
                            "Phone": result["phone"],
                            "Location": result["location"],
                            "Skills": result["skills"]
                        })
                    else:
                        st.error("Could not process the CV.")
        
        st.markdown('</div>', unsafe_allow_html=True)

def show_database_page():
    st.header("Candidate Database")
    
    # Fetch candidates from API
    candidates = get_candidates()
    
    if not candidates:
        st.info("No candidates in the database yet. Upload some CVs to get started!")
        return
    
    # Convert to DataFrame for easier display
    df = pd.DataFrame(candidates)
    
    # Search and filter
    col1, col2 = st.columns(2)
    with col1:
        search_term = st.text_input("Search by name or email")
    with col2:
        sort_by = st.selectbox("Sort by", ["Name", "Date Added"], index=1)
    
    # Filter and sort
    if search_term:
        df = df[df['full_name'].str.contains(search_term, case=False) | 
                df['email'].str.contains(search_term, case=False)]
    
    if sort_by == "Name":
        df = df.sort_values('full_name')
    else:
        df = df.sort_values('created_at', ascending=False)
    
    # Display candidates
    for _, candidate in df.iterrows():
        with st.expander(f"{candidate['full_name']} - {candidate['email']}"):
            col1, col2 = st.columns(2)
            with col1:
                st.write("**Contact Information**")
                st.write(f"Phone: {candidate['phone']}")
                st.write(f"Location: {candidate['location']}")
                
                st.write("**Education**")
                for edu in candidate['education']:
                    st.write(f"- {edu['degree']} in {edu['field']} at {edu['institution']}")
            with col2:
                st.write("**Skills**")
                if candidate['skills']:
                    st.write(", ".join(candidate['skills']))
                else:
                    st.write("No skills extracted")
                
                st.write("**Work Experience**")
                for exp in candidate['work_experience']:
                    st.write(f"- {exp['position']} at {exp['company']}")

def show_search_page():
    st.header("Advanced Candidate Search")
    
    # Search form
    with st.form("search_form"):
        query = st.text_input("Search Query", 
                            help="Enter keywords, skills, or job descriptions to search for")
        
        col1, col2 = st.columns(2)
        with col1:
            min_experience = st.number_input("Minimum Years of Experience", 
                                          min_value=0, max_value=50, value=0)
            location = st.text_input("Location")
        with col2:
            required_skills = st.text_input("Required Skills (comma-separated)")
            education_level = st.selectbox("Education Level", 
                                         ["Any", "Bachelor's", "Master's", "PhD"])
        
        submitted = st.form_submit_button("Search")
        
        if submitted and query:
            with st.spinner("Searching candidates..."):
                # Convert comma-separated skills to list
                skills_list = [s.strip() for s in required_skills.split(",")] if required_skills else None
                
                # Search candidates
                results = search_candidates(
                    query=query,
                    min_experience=min_experience if min_experience > 0 else None,
                    required_skills=skills_list,
                    location=location if location else None,
                    education_level=education_level if education_level != "Any" else None
                )
                
                if results:
                    st.success(f"Found {len(results)} matching candidates")
                    
                    # Display results
                    for candidate in results:
                        with st.expander(f"{candidate['full_name']} - {candidate['email']}"):
                            col1, col2 = st.columns(2)
                            with col1:
                                st.write("**Contact Information**")
                                st.write(f"Phone: {candidate['phone']}")
                                st.write(f"Location: {candidate['location']}")
                            with col2:
                                st.write("**Skills**")
                                st.write(", ".join(candidate['skills']))
                            
                            st.write("**Work Experience**")
                            for exp in candidate['work_experience']:
                                st.write(f"- {exp['position']} at {exp['company']}")
                else:
                    st.info("No matching candidates found")

def show_analytics_page():
    st.header("Analytics Dashboard")
    
    # Fetch candidates from API
    candidates = get_candidates()
    
    if not candidates:
        st.info("Upload some CVs to see analytics!")
        return
    
    # Convert to DataFrame
    df = pd.DataFrame(candidates)
    
    # Create tabs for different analytics
    tab1, tab2, tab3 = st.tabs(["Overview", "Skills Analysis", "Timeline"])
    
    with tab1:
        st.subheader("Candidate Overview")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric("Total Candidates", len(df))
        with col2:
            st.metric("Unique Locations", df['location'].nunique())
        with col3:
            st.metric("Total Skills", sum(len(skills) for skills in df['skills']))
        
        # Location distribution
        if not df['location'].empty:
            location_counts = df['location'].value_counts()
            fig = px.pie(
                values=location_counts.values,
                names=location_counts.index,
                title="Candidate Distribution by Location"
            )
            st.plotly_chart(fig, use_container_width=True)
    
    with tab2:
        st.subheader("Skills Analysis")
        
        # Flatten skills list and count occurrences
        all_skills = [skill for skills in df['skills'] for skill in skills]
        if all_skills:
            skill_counts = pd.Series(all_skills).value_counts()
            
            # Top skills bar chart
            fig = px.bar(
                x=skill_counts.index[:10],
                y=skill_counts.values[:10],
                title="Top 10 Skills",
                labels={'x': 'Skill', 'y': 'Count'}
            )
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No skills data available for analysis")
    
    with tab3:
        st.subheader("Candidate Timeline")
        
        # Convert created_at to datetime
        df['created_at'] = pd.to_datetime(df['created_at'])
        
        # Create timeline
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=df['created_at'],
            y=range(1, len(df) + 1),
            mode='lines+markers',
            name='Candidates Added'
        ))
        
        fig.update_layout(
            title="Candidate Addition Timeline",
            xaxis_title="Date",
            yaxis_title="Cumulative Candidates",
            showlegend=True
        )
        
        st.plotly_chart(fig, use_container_width=True)

if __name__ == "__main__":
    main() 