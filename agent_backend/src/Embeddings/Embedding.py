from pathlib import Path

import PyPDF2
from fastapi import UploadFile
from loguru import logger

from PyPDF2 import PdfReader
class RAG_Embedding:
    #Constructure that recieve the files pdf support client to chank the pdf
    def __new__(cls,file : UploadFile |None = None , file_path: str | Path | None = None)->PyPDF2:
        if (file_path is None):
                  pdfFilesReaderfile = PdfReader(file)
                 
                  return pdfFilesReaderfile
        else:
             pdfFilesReaderfile = PdfReader(file_path)
             return pdfFilesReaderfile
    def chunkingDocuments(chunk_size  : int,chunk_overlap : int):
       raise
