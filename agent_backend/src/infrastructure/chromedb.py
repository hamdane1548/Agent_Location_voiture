import chromadb
from loguru import logger
import asyncio
from agent_backend.src import Settings
settings = Settings()
#Singleton instance 
class Chroma:
    _instance = None
    async def __new__(cls,*args,**kwargs)->chromadb:
        if cls._instance is None:
            try:
                client = await chromadb.HttpClient(host=settings.HOST_CHROMA_DB,port=settings.PORT_CHROMA_DB)
                collection = await client.get_collection(name="rag-collection")
                if collection is None:
                    collection =  await client.create_collection(name="rag-collection")
                cls._instance = client
                return cls._instance  
            except RuntimeError as e:
                logger.info(f"erro when create the client of chroma db")
                raise
