from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.core.config import settings


embedding_model = GoogleGenerativeAIEmbeddings(

    model="models/gemini-embedding-001",

    google_api_key=settings.GEMINI_API_KEY
)