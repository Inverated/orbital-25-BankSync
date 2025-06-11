from backend.models.account import Account, Statement
from backend.models.transaction import Transaction
from backend.utils.pdfReader import bytesToPdfPages

def pdfParser(content: bytes):
    pdfPages = bytesToPdfPages(content)
    #for page in pdfPages:
        #print(page)
        
    return (Statement(hasData=True, transactions=[Transaction()], account=Account()))
