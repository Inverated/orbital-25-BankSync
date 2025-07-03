from io import BytesIO
from msoffcrypto import OfficeFile
from pypdf import PdfWriter

from backend.utils.pdfReader import convertToPypdf


def protectExcel(content: bytes, password: str):
    decrypted = BytesIO(content)
    encrypted = BytesIO()

    file = OfficeFile(decrypted)
    file.encrypt(password, encrypted)

    return encrypted.getvalue()


def protectPdf(content: bytes, password: str):
    pdfReader = convertToPypdf(content)
    pdfWriter = PdfWriter()
    encrypted = BytesIO()

    for page in pdfReader.pages:
        pdfWriter.add_page(page)

    pdfWriter.encrypt(user_password=password)
    pdfWriter.write(encrypted)

    return encrypted.getvalue()
