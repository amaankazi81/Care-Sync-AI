from langchain_chroma import Chroma

from app.rag.embeddings import embedding_model


def get_retriever(patient_id):

    db = Chroma(

        persist_directory=f"app/chroma_db/{patient_id}",

        embedding_function=embedding_model
    )

    return db.as_retriever(

        search_kwargs={

            "k":6

        }

    )