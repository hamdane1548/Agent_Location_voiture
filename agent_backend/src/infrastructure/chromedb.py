import chromadb
from loguru import logger
from Settings import Settings

settings = Settings()


class ChromaConnection:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            try:
                client = chromadb.HttpClient(
                    host=settings.HOST_CHROMA_DB,
                    port=settings.PORT_CHROMA_DB
                )

                client.heartbeat()

                client.get_or_create_collection(
                    name="rag-location"
                )

                cls._instance = client

                logger.info("Successfully connected to ChromaDB")

            except Exception as e:
                logger.error(f"Error when creating ChromaDB client: {e}")
                raise

        return cls._instance


chromaconnection = ChromaConnection()