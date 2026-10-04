import PyPDF2
from fastapi import UploadFile
from loguru import logger

from src.Settings import Settings
settings = Settings()

class RAG_Embedding:
    #Constructure that recieve the files pdf support client to chank the pdf
    def __new__(cls,file : UploadFile)->PyPDF2:
        pdfFilesReader = PyPDF2.PdfFileReader(file)
        logger.info(f'I m read the document file thank you {pdfFilesReader.numPages}')
        return pdfFilesReader
    def chunkingDocuments(chunk_size  : int,chunk_overlap : int):
       raise
