from io import BytesIO
import pdfplumber
from pypdf import PdfReader, PdfWriter

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

def stripEncryption(pdf: PdfReader):
    if pdf.is_encrypted:
        try:
            pdf.decrypt('')
            return pdf
        except:
            return None
    else:
        return pdf
    
def decryptPdf(pdf: PdfReader, password: str):
    success = pdf.decrypt(password)
    return pdf if success else None

def extractText(pdf: PdfReader):
    writer = PdfWriter()
    for page in pdf.pages:
        writer.add_page(page)

    buffer = BytesIO()
    writer.write(buffer)

    #pdfplumber preserve line
    pages = pdfplumber.open(buffer).pages
    extracted = []
    for page in pages:
        text = page.extract_text(layout=True)
        lines = text.split('\n')
        for line in lines:
            if line.strip() != '':
                extracted.append(line.strip()) 
    return extracted