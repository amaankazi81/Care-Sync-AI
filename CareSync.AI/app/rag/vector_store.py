from langchain_chroma import Chroma
from app.rag.embeddings import embedding_model


def create_vector_store(chunks,
                        patient_id: str,
                        filename: str):

    for chunk in chunks:

        chunk.metadata["patient_id"] = patient_id

        chunk.metadata["filename"] = filename

    db = Chroma(

        persist_directory=f"app/chroma_db/{patient_id}",

        embedding_function=embedding_model
    )

    db.add_documents(chunks)

    return db