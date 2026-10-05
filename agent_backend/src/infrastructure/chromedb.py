import chromadb
from loguru import logger
import asyncio
from Settings import Settings
settings = Settings()
#Singleton instance 
class ChromaConnection:
    _instance = None
    def __new__(cls,*args,**kwargs)->chromadb:
        if cls._instance is None:
            try:
                client =  chromadb.HttpClient(host=settings.HOST_CHROMA_DB,port=settings.PORT_CHROMA_DB)
                collection = client.get_or_create_collection("rag-location")
                cls._instance = client
                return cls._instance  
            except RuntimeError as e:
                logger.info(f"erro when create the client of chroma db")
                raise
chromaconnection = ChromaConnection()