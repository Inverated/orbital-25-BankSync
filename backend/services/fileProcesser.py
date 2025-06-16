from typing import Optional
from backend.models.account import Account, Statement
from backend.models.transaction import Transaction
from backend.utils import pdfReader
from backend.utils.pdfReader import convertToPypdf, decryptPdf


def fileParser(content: bytes, extension: str, password: Optional[str]):
    # pdfPages = convertToPages(content)
    # for page in pdfPages:
    # print(page)
    if (extension == 'pdf'):
        return parsePdf(content, password)
    elif (extension == 'csv'):
        return (True, Statement())



def parsePdf(content: bytes, password: Optional[str]):
    pypdf = convertToPypdf(content)
    if (pdfReader.isPasswordProtected(pypdf)):
        if password == None:
            return (False, {'requirePassword': True})
        else:
            pypdf = decryptPdf(pypdf, password)
            if pypdf == None:
                return (False, {'requirePassword': True, 'invalidPassword': True})
    
    
    transactions = [Transaction(transaction_date='2025-05-01', transaction_description='test 1', withdrawal_amount=69, deposit_amount=0, account_no='360', category='fun'),
                    Transaction(transaction_date='2025-05-10', transaction_description='test 2', withdrawal_amount=420, deposit_amount=0, account_no='360', category='notfun')]
    account = Account(account_name='Savings 1', account_no='360120180',
                      bank_name='Standard Chartererered', balance=1111111.1)
    return (True, Statement(hasData=True, transactions=transactions, account=account))
    

