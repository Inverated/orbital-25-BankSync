from io import BytesIO
from pypdf import PdfReader


def bytesToPdfPages(content: bytes):
    decryptedPdf = PdfReader(BytesIO(content))
    return decryptedPdf.pages