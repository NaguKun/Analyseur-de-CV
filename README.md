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