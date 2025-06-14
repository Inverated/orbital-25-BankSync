from io import BufferedReader, BytesIO
from pypdf import PdfReader

def convertToPages(content):
    return convertToPypdf(content).pages

def convertToPypdf(content: bytes):
    return PdfReader(BytesIO(content))

def convertToPypdf(content: BufferedReader):
    return PdfReader(BytesIO(content))
