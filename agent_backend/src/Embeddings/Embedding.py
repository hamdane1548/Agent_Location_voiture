from math import log
from pathlib import Path
import re

import PyPDF2
from fastapi import UploadFile
from loguru import logger
from PyPDF2 import PdfReader
from PyPDF2 import PdfReader
from mistralai.client import Mistral
import numpy as np
from sentence_transformers import SentenceTransformer
from Services.ChromaDBServices import ChromaBbServices
class RAG_Embedding:
    model = SentenceTransformer("all-MiniLM-L6-v2")
    #Constructure that recieve the files pdf support client to chank the pdf
    def __new__(cls,file : UploadFile |None = None , file_path: str | Path | None = None)->PdfReader:
        if (file_path is None):
                  pdfFilesReaderfile = PdfReader(file)
                 
                  return pdfFilesReaderfile
        else:
             pdfFilesReaderfile = PdfReader(file_path)
             return pdfFilesReaderfile
    # chunking function
    @classmethod
    def chunkingDocuments(chunk_size  : int | None = None,chunk_overlap : int | None = None, fiels : PdfReader | None = None)->str:
        content:str = "" 
        value_extract = []
        for value in fiels.pages:
             value_extract.append(value.extract_text())

        for i in value_extract:
             content +=i

        nv_content = content.split(":")
        logger.info(f"the value of the content  is {nv_content}")

        # cleaning the text
        content =  content.lstrip()
        content = re.sub(r"\s+"," ",content)
        logger.info(f"the valu of the content {content}")
        content.replace('\n',' ').split('.')
        return content

    @staticmethod
    def spliting_content(content, chunking_size = 500):
         sentences = content
         chnuks = []
         current_chunk = []
         current_size = 0
         for sentence in sentences:
              sentence = sentence.strip()
              if not sentence:
                   continue
              if not sentence.endswith("."):
                   sentence+='.'
              sentence_size = len(sentence)
              if current_size  + sentence_size > chunking_size and current_chunk : 
                   chnuks.append(' '.join(current_chunk))
                   current_chunk = [sentence]
                   current_size = current_size
              else:
                   current_chunk.append(sentence)
                   current_size +=sentence_size
              if current_chunk:
                   chnuks.append(' '.join(current_chunk))

         return chnuks
    #embedding using Model Mistral
    @staticmethod
    def embedding_mistral(chunks,api_key : str):
         client = Mistral(api_key=api_key)
         embedding_batch_processing = client.embeddings.create(
              model="mistral-embed",
              inputs=chunks
         )
         logger.info(f"the embedding is ")
         return embedding_batch_processing
    @classmethod
    def embedding_using_transfromes_model_encoding(cls,chunks)->list[float]:
         embedding = cls.model.encode(chunks)
         logger.info(f"the type of the embedding is {type(embedding)}")
         logger.info(f"the content files is {embedding.shape}")
         return embedding.tolist()
    @staticmethod
    def SaveInVectorDb(vector,content,collection_name,id_client,copmany_name,name_cleint):
        ChromaBbServices.savetheVector(vector,content,collection_name,id_client,copmany_name,name_cleint)
        
         
