
import hashlib
import uuid

from loguru import logger
import numpy as np

from infrastructure.chromedb import chromaconnection,ChromaConnection

chromaconnectiondb = chromaconnection
class ChromaBbServices:
    _instances = None
    def __new__(cls,):
        try:
            # connection
            # test the connection
            if chromaconnection is not None:
                cls._instances =  chromaconnectiondb
                logger.info(f"the conection is {cls._instances.list_collections()}")
            else:
                raise ConnectionError(
                    "Chroma db connection fialed "
                )
        except Exception as error:
            logger.catch(f"error when make the connection between the vectore store {error}")
            raise
    @classmethod
    def savetheVector(cls,collection_name :str,content:str , id_client : int , name_cleint : str , copmany_name : str,vector: np.ndarray):
        try:
            client = ChromaConnection()
            cls._instances = client
            if cls._instances is None:
               raise ConnectionError(
                   "chroma db connection failed"
               )
            collection = cls._instances.get_collection(name=collection_name)
            if collection is None:
                raise ConnectionError(
                    "Failed to load the collection"
                )
            vector_id = hashlib.sha256(
            content.encode("utf-8")
            ).hexdigest()

            existing = collection.get(
            ids=[vector_id]
             )
            if existing["ids"]:
                print("This content already exists")
                return
            collection.add(
    ids=[hashlib.sha256(content.encode()).hexdigest()],
    embeddings=[vector],
    metadatas=[{
        "source": "pdf",
        "client": id_client,
        "name_client": name_cleint,
        "company_name": copmany_name
    }],
    documents=[content]
)
        except Exception as error:
            logger.catch(f"the vector save in the chrom is fail because {error}")
            raise
    @classmethod
    def check_data(cls,question:list):
        try:
            client = ChromaConnection()
            collection = client.get_collection("rag-location")
            data = collection.query(
                query_embeddings=[question],
                 n_results=3,
                 include=["documents", "distances", "metadatas"]
            )
            for i, document in enumerate(data["documents"][0]):
                print(f"\n--- Result {i + 1} ---")
                print(document)
    
        except RuntimeError as error:
            logger.catch(f"the erro is {error}")
            raise
