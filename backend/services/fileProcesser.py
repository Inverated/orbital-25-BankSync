from backend.models.account import Account, Statement
from backend.models.transaction import Transaction
from backend.utils.pdfReader import convertToPages

def pdfParser(content: bytes):
    pdfPages = convertToPages(content)
    #for page in pdfPages:
        #print(page)
    
    transactions = [Transaction(transaction_date='2025-05-01', transaction_description='test 1', withdrawal_amount=69, deposit_amount=0,account_no='360',category='fun'),
                    Transaction(transaction_date='2025-05-10', transaction_description='test 2', withdrawal_amount=420, deposit_amount=0,account_no='360',category='notfun')]
    account = Account(account_name='Savings 1',account_no='360120180', bank_name='Standard Chartererered',balance=1111111.1)
    return (Statement(hasData=True, transactions=transactions, account=account))
