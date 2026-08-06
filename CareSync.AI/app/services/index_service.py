import os

from app.rag.loader import load_pdf
from app.rag.splitter import split_documents
from app.rag.vector_store import create_vector_store


def index_pdf(file_path,
              patient_id):

    docs = load_pdf(file_path)

    chunks = split_documents(docs)

    filename = os.path.basename(file_path)

    create_vector_store(
        chunks,
        patient_id,
        filename
    )