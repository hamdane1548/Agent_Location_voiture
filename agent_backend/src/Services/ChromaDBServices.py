
import uuid

from loguru import logger
import numpy as np

from infrastructure.chromedb import chromaconnection

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
    def savetheVector(cls,collection_name :str , id_client : int , name_cleint : str , copmany_name : str,vector: np.ndarray):
        try:
            if cls._instances is None:
               raise ConnectionError(
                   "chroma db connection failed"
               )
            collection = cls._instances.get_collection(name=collection_name)
            if collection is None:
                raise ConnectionError(
                    "Failed to load the collection"
                )
            list_chunk = list(map(lambda i  : "chunk ${i}" ,vector))
            collection.add(
                  ids = list(map(lambda i  : "chunk ${i}" ,vector))
            )
        except Exception as error:
            logger.catch(f"the vector save in the chrom is fail because {error}")
            raise
