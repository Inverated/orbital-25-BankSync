from csv import reader

from backend.models import keywordDict
from backend.models.account import Statement
from backend.models.transaction import Transaction
from backend.utils.textFormatter import rmSpaceFromList

# I dont understand how dbs csv works
def processDBS(text: reader):
    statement = Statement()
    account = statement.account
    account.bank_name = 'DBS'
    account_no = ''
    prev_balance = 0.0
    
    for row in text:
        if row == []:
            continue
        if ("account details" in row[0].lower()):
            row = rmSpaceFromList(row)
            splitted = row[1].split(' ')
            account_no = splitted[-1]
            account.account_no = account_no
            account.account_name = ' '.join(splitted[:-1])
            continue
        
        if ('available balance' in row[0].lower()):
            prev_balance = float(row[1])
            continue
        
        if ('ledger balance' in row[0].lower()):
            account.balance = float(row[1])
            continue
        
        if row[0].split('-')[0].isdigit():
            splittedDate = row[0].split('-')
            dd = str(splittedDate[0]).rjust(2, '0')
            mm = keywordDict.monthLookup[splittedDate[1].lower()].rjust(2, '0')
            yyyy = '20' + splittedDate[2]
            transaction_date = yyyy + '-' + mm + '-' + dd
            
            withdrawal_amount = float(row[4]) if row[4].strip() != '' else 0.0
            deposit_amount = float(row[5]) if row[5].strip() != '' else 0.0
            ending_balance = prev_balance + deposit_amount - withdrawal_amount
            prev_balance = ending_balance
            
            transaction_description = ''
            for descriptions in row[6:]:
                if descriptions != '':
                    transaction_description += descriptions + '\n'
            transaction_description = transaction_description.rstrip('\n')
            
            statement.transactions.append(
                Transaction(
                    transaction_date=transaction_date,
                    transaction_description=transaction_description,
                    withdrawal_amount=withdrawal_amount,
                    deposit_amount=deposit_amount,
                    ending_balance=ending_balance,
                    account_no=account_no
                )
            )
            statement.hasData = True
    
    return (True, [statement])