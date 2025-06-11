
from io import BytesIO
from pypdf import PdfReader

def fileProcesser(content):
    pdf = PdfReader(BytesIO(content))
    for page in pdf.pages:
        print(page.extract_text())
