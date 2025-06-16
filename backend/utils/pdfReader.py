from io import BytesIO
from pypdf import PdfReader

def convertToPypdf(content: bytes):
    return PdfReader(BytesIO(content))

def isPasswordProtected(pdf: PdfReader):
    if pdf.is_encrypted:
        try:
            #Encrypted != password protect
            output = pdf.pages[0].extract_text()
            return True if output == '' else False
        except Exception as e:
            return True
    return False

def decryptPdf(pdf: PdfReader, password: str):
    success = pdf.decrypt(password)
    return pdf if success else None

def findTable(pdf: PdfReader):
    return