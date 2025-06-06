# Intelligent CV Analysis and Candidate Database System

An advanced system for automated CV processing, information extraction, and intelligent candidate search using AI and modern database technologies.

## Features

- **Automated CV Processing**: Extract and process CVs from local folders or Google Drive
- **Intelligent Information Extraction**: Uses LLMs to parse CVs and extract structured information
- **Advanced Candidate Database**: Combines SQL and Vector databases for efficient storage and search
- **Smart Search API**: Powerful candidate search with semantic matching capabilities
- **Modern API Interface**: FastAPI-based REST API for easy integration

## Project Structure

```
cv_analysis_system/
├── app/
│   ├── api/                 # FastAPI routes and endpoints
│   ├── core/               # Core configuration and settings
│   ├── db/                 # Database models and connections
│   ├── services/           # Business logic and services
│   │   ├── cv_processor/   # CV processing and text extraction
│   │   ├── llm/           # LLM integration and information extraction
│   │   └── search/        # Search functionality
│   └── utils/             # Utility functions and helpers
├── tests/                 # Test suite
├── .env.example          # Example environment variables
├── requirements.txt      # Project dependencies
└── README.md            # Project documentation
```
## User Flow
![alt text](image.png)

## Setup and Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cv-analysis-system
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Initialize the database:
```bash
python -m app.db.init_db
```

6. Run the development server:
```bash
uvicorn app.main:app --reload
```

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Key API Endpoints

- `POST /api/v1/cv/upload`: Upload and process new CVs
- `GET /api/v1/candidates`: Search candidates with various filters
- `GET /api/v1/candidates/{id}`: Get detailed candidate information
- `POST /api/v1/candidates/search`: Advanced semantic search

## Technology Stack

- **Backend**: FastAPI, Python 3.9+
- **Database**: PostgreSQL + ChromaDB (Vector DB)
- **AI/ML**: LangChain, Google Gemini/OpenAI
- **PDF Processing**: PyMuPDF
- **NLP**: spaCy, NLTK

## Development

### Running Tests
```bash
pytest
```

### Code Style
The project follows PEP 8 guidelines. Use black for code formatting:
```bash
black .
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

# Technical Documentation
## Database Design
![alt text](image-2.png)
## Example: LLM Prompt for CV Extraction

The system uses a highly detailed system prompt for LLM-based extraction. Below is a sample system prompt and user message:

```python
# In app/services/llm/extractor.py
system_prompt = extractor._create_system_prompt()
user_message = f"Here is the CV text to analyze:\n\n{cv_text}\n\nPlease extract the information in the specified format. Remember to NEVER return null values for required fields. Make reasonable inferences if information is not explicitly stated."

messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": user_message}
]

response = extractor.client.chat.completions.create(
    model=settings.LLM_MODEL,
    messages=messages,
    temperature=0.1,
    max_tokens=2048,
)
```

**Sample System Prompt (excerpt):**
```
You are an expert-level CV parser with deep expertise in recruitment, HR standards, and structured data extraction. 
Your task is to convert unstructured CV/resume text into perfectly structured JSON that strictly complies with the following Pydantic schema.

🔒 STRICT COMPLIANCE REQUIRED:
1. NEVER omit required fields or return invalid formats
2. Use intelligent inference when data is implied but not explicit
...
```

**Sample User Message:**
```
Here is the CV text to analyze:

[CV CONTENT]

Please extract the information in the specified format. Remember to NEVER return null values for required fields. Make reasonable inferences if information is not explicitly stated.
```

**Sample LLM Output (JSON):**
```json
{
  "full_name": "Jane Doe",
  "email": "jane.doe@email.com",
  "phone": "+1234567890",
  "location": "Paris, France",
  "education": [
    {
      "institution": "Sorbonne University",
      "degree": "Master's in Data Science",
      "field_of_study": "Data Science",
      "start_date": "2018-09-01",
      "end_date": "2020-06-30",
      "description": "Thesis on NLP applications."
    }
  ],
  "work_experience": [
    {
      "company": "TechCorp",
      "position": "Data Scientist",
      "start_date": "2020-07-01",
      "end_date": null,
      "description": "Developed ML models for client analytics.",
      "achievements": ["Deployed scalable ML pipelines"],
      "location": "Remote"
    }
  ],
  "skills": ["Python", "Machine Learning", "NLP"],
  "projects": [
    {
      "name": "Resume Parser",
      "description": "Built an AI-powered resume parser.",
      "start_date": "2021-01-01",
      "end_date": "2021-06-01",
      "technologies": ["Python", "spaCy"],
      "url": null
    }
  ],
  "certifications": []
}
```

---

## Example API Usage

### Upload a CV (Single)
```bash
curl -X POST "http://localhost:8000/api/v1/cv/upload" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@/path/to/cv.pdf"
```

### Upload Multiple CVs (Batch)
```bash
curl -X POST "http://localhost:8000/api/v1/cv/upload/batch" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "files=@/path/to/cv1.pdf" \
     -F "files=@/path/to/cv2.pdf"
```

### Semantic Search Example
```bash
curl -G "http://localhost:8000/api/v1/candidates/search" \
     --data-urlencode "query=machine learning NLP" \
     --data-urlencode "required_skills=Python" \
     --data-urlencode "min_experience_years=2" \
     --data-urlencode "limit=5"
```

### Python Example: Search API
```python
import requests

params = {
    "query": "data scientist NLP",
    "required_skills": ["Python", "spaCy"],
    "min_experience_years": 2,
    "limit": 5,
}
resp = requests.get("http://localhost:8000/api/v1/candidates/search", params=params)
print(resp.json())
```

---

## Code Deep Dive: Extraction, Search, and Error Handling

### Extraction Pipeline (Key Steps)
1. **PDF Upload**: User uploads a PDF via `/api/v1/cv/upload` endpoint.
2. **Text Extraction**: `CVProcessor.extract_text()` uses PyMuPDF to extract and clean text.
3. **LLM Extraction**: `InformationExtractor.extract_information()` sends the cleaned text and system prompt to OpenAI (via LangChain), enforcing strict schema compliance.
4. **Validation & Cleaning**: The output is parsed, cleaned, and validated against Pydantic models. Dates, URLs, and required fields are sanitized.
5. **Embedding Generation**: `generate_embeddings()` computes vector embeddings for experience and skills using OpenAI models.
6. **Database Storage**: Candidate profile and embeddings are stored in PostgreSQL and ChromaDB (vector DB).

### Error Handling Highlights
- File type, size, and corruption checks with clear HTTP errors.
- LLM output is validated, cleaned, and fallback logic is used (e.g., default values for missing fields, placeholder dates).
- All exceptions are logged and returned as meaningful HTTP errors.

### Example: Error Handling in Upload Endpoint
```python
# In app/api/v1/endpoints/cv_upload.py
if not file.filename.endswith('.pdf'):
    raise HTTPException(status_code=400, detail="Only PDF files are supported")
if len(content) > settings.MAX_UPLOAD_SIZE:
    raise HTTPException(status_code=400, detail="File too large")
...
try:
    ... # Extraction and embedding
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error processing CV: {str(e)}")
```

---

## Advanced Usage Scenarios & Search Prompts

### Example: Semantic Search Prompt
- "Find data scientists with NLP and Python experience, at least 3 years, in Paris."
- "Show me candidates with Docker, Kubernetes, and cloud certifications."
- "List backend developers with PostgreSQL and FastAPI who graduated after 2020."

### Example: Candidate Search API (with filters)
```bash
curl -G "http://localhost:8000/api/v1/candidates/search" \
     --data-urlencode "query=backend developer" \
     --data-urlencode "required_skills=FastAPI" \
     --data-urlencode "education_level=Bachelor's" \
     --data-urlencode "location=Hanoi" \
     --data-urlencode "limit=10"
```

### Example: Get All Skills & Locations
```bash
curl http://localhost:8000/api/v1/candidates/skills
curl http://localhost:8000/api/v1/candidates/locations
```

---

## Key Classes and Files
- `app/services/cv_processor/processor.py`: PDF text extraction and cleaning
- `app/services/llm/extractor.py`: LLM prompt engineering, extraction logic, schema enforcement, embedding generation
- `app/services/search_service.py`: Hybrid semantic and filter-based search logic
- `app/schemas/candidate.py`: Pydantic models for candidate, education, experience, etc.
- `app/api/v1/endpoints/cv_upload.py`: Upload endpoints, error handling, batch processing
- `app/api/v1/endpoints/search.py`: Search and filter endpoints

---

*For any integration or extension, refer to the code examples and schema definitions above. The system is designed for modularity, extensibility, and robust error handling throughout the pipeline.*

---


## 1. Solution Architecture Overview

The Intelligent CV Analysis and Candidate Database System is designed as a modular, scalable backend solution for automated CV processing, information extraction, and intelligent candidate search. The system leverages modern AI (LLMs), robust PDF/text processing, and a hybrid database approach (relational + vector search) to deliver advanced candidate management and search capabilities.

### High-Level Architecture Diagram

![alt text](image-1.png)

**Component Descriptions:**
- **User/API Client**: Interacts with the system via REST API (e.g., uploading CVs, searching candidates).
- **FastAPI Backend**: Main application server, orchestrates all business logic and API endpoints.
- **CV Processor**: Handles PDF validation and text extraction using PyMuPDF.
- **LLM Information Extractor**: Uses LLMs (OpenAI, LangChain) to parse unstructured CV text into structured candidate profiles.
- **Database Layer**: Stores candidate data in PostgreSQL (relational) and vector embeddings in ChromaDB/pgvector for semantic search.
- **Search API**: Provides advanced candidate search (filtering, semantic matching).
- **Google Drive Integration**: Optionally stores original CV files in Google Drive for backup and compliance.


## 2. Module Architecture

### 2.1 CV Processing Module
- **Location**: `app/services/cv_processor/processor.py`
- **Responsibilities**:
  - Accepts PDF files (from upload or Google Drive).
  - Validates file format and integrity.
  - Extracts raw text from PDF using PyMuPDF.
  - Cleans and normalizes extracted text for downstream processing.
- **Key Class**: `CVProcessor`
- **Error Handling**: Detects and logs corrupt or unsupported files, provides clear error messages to API.

### 2.2 Information Extraction Module
- **Location**: `app/services/llm/extractor.py`
- **Responsibilities**:
  - Receives cleaned CV text.
  - Uses LLMs (OpenAI via LangChain) to extract structured candidate data (personal info, education, work experience, skills, projects, certifications).
  - Enforces strict schema compliance using Pydantic models and prompt engineering.
  - Handles missing/ambiguous data with intelligent inference or placeholders.
  - Generates vector embeddings for semantic search.
- **Key Class**: `InformationExtractor`
- **Prompt Engineering**: Custom system prompt ensures output is always schema-compliant and robust to real-world CV variations.

### 2.3 API Layer
- **Location**: `app/api/v1/endpoints/`, `app/main.py`
- **Responsibilities**:
  - Exposes RESTful endpoints for CV upload, candidate search, and retrieval.
  - Handles file uploads, batch processing, and error reporting.
  - Integrates with Google Drive for file storage.
  - Returns structured responses and validation errors.
- **Key Endpoints**:
  - `POST /api/v1/cv/upload`: Upload and process a new CV.
  - `POST /api/v1/cv/upload/batch`: Batch upload and process multiple CVs.
  - `GET /api/v1/candidates`: List/search candidates.
  - `POST /api/v1/candidates/search`: Semantic search.
  - `GET /api/v1/candidates/{id}`: Retrieve candidate details.

### 2.4 Database Layer
- **Location**: `app/db/models.py`, `app/db/session.py`
- **Responsibilities**:
  - Stores candidate profiles, education, work experience, skills, projects, and certifications in PostgreSQL.
  - Stores vector embeddings for experience and skills using pgvector/ChromaDB for fast semantic search.
  - Provides association tables for many-to-many relationships (e.g., candidates and skills).
  - Indexes vector columns for efficient similarity search.
- **Key Models**: `Candidate`, `Education`, `WorkExperience`, `Skill`, `Project`, `Certification`


## 3. Technologies Used

- **FastAPI**: High-performance Python web framework for building APIs.
- **Uvicorn**: ASGI server for running FastAPI applications.
- **SQLAlchemy**: ORM for PostgreSQL database access.
- **pgvector**: PostgreSQL extension for vector similarity search.
- **ChromaDB**: Vector database for storing and searching embeddings.
- **PyMuPDF**: PDF parsing and text extraction.
- **LangChain**: Framework for LLM orchestration and prompt management.
- **OpenAI API**: LLMs for information extraction and embedding generation.
- **Google Drive API**: For storing and retrieving original CV files.
- **Pydantic**: Data validation and schema enforcement.
- **pytest, black, isort, flake8, mypy**: Testing and code quality tools.


## 4. Project Execution Journal & Personal Contributions (Deep Dive)

### Technical Journey, Challenges, and Solutions

#### Architectural Vision & Design Rationale
From the outset, I aimed to build a system that not only automates CV processing but also leverages the latest advances in AI for information extraction and semantic search. The architecture was designed for modularity, scalability, and extensibility, allowing for easy integration of new AI models or storage backends in the future.

#### PDF Processing & Text Extraction
One of the first technical hurdles was ensuring robust extraction of text from a wide variety of real-world CV PDFs. I selected PyMuPDF for its speed and accuracy, and implemented rigorous validation and cleaning routines to handle corrupt files, non-standard encodings, and noisy layouts. This preprocessing was critical for downstream LLM performance.

#### LLM-Based Information Extraction
A core innovation was the use of LLMs (OpenAI via LangChain) to transform unstructured CV text into structured, schema-compliant candidate profiles. I engineered detailed system prompts and fallback strategies to ensure the LLM output always matched strict Pydantic schemas, even when CVs were incomplete or ambiguous. This required iterative prompt tuning, error analysis, and the development of intelligent inference rules (e.g., inferring missing dates, normalizing skills).

#### Hybrid Database & Semantic Search
To enable both traditional and semantic search, I designed a hybrid database layer: PostgreSQL for structured data and pgvector/ChromaDB for vector embeddings. I implemented vector indexing and similarity search for candidate experience and skills, allowing recruiters to find candidates not just by keywords but by true semantic relevance. This required careful schema design, embedding generation, and query optimization.

#### API Design & Integration
I developed a RESTful API using FastAPI, focusing on clear, versioned endpoints and robust error handling. Special attention was given to file upload endpoints (including batch processing), integration with Google Drive for CV storage, and the design of advanced search endpoints supporting both filter-based and semantic queries. I ensured all endpoints returned meaningful error messages and validation feedback.

#### Advanced Error Handling & Data Quality
Throughout the project, I prioritized data quality and resilience. I implemented comprehensive error handling at every stage (file validation, LLM extraction, database operations), with detailed logging for traceability. I also built routines to sanitize and validate all extracted data, ensuring the system could gracefully handle edge cases and malformed inputs.

#### Testing, Optimization, and Documentation
I wrote unit and integration tests for all major modules, using pytest and FastAPI's test client. Performance profiling led to optimizations in text extraction and LLM call batching. I also automated code formatting and linting to maintain code quality. Finally, I authored this technical documentation to ensure the system is maintainable and understandable for future developers.

### Personal Impact & Reflections
- Led the end-to-end design and implementation of the backend system, from architecture to deployment.
- Developed custom prompt engineering and fallback logic for robust, schema-compliant LLM extraction.
- Solved complex challenges in PDF parsing, data normalization, and semantic search.
- Integrated multiple advanced technologies (LLMs, vector DBs, cloud storage) into a cohesive, production-ready solution.
- Documented all key decisions, trade-offs, and lessons learned to support future development and onboarding.

---

