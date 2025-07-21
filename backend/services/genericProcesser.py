from backend.models.account import Account, Statement
from backend.models.transaction import Transaction
from backend.utils.postProcessessing import assignWithdrawDeposit, setLatestDate
from backend.utils.rowBreakdown import standardRowBreakdown
from backend.utils.textFormatter import rmSpaceFromList


def processGenericPdf(textList: list[str]) -> tuple[bool, list[Statement]]:
    # date, description, in, out, deposit, withdrawal, balance
    statements: list[Statement] = []
    firstTrans = []
    firstIndex = -1
    longer = 0
    shorter = 1000
    for row in textList:
        lower = row.lower()
        header = []
        if ('date' in lower) and \
            ('description' in lower or 'transaction' in lower) and \
            ('deposit' in lower or 'in' in lower) and \
            ('withdrawal' in lower or 'out' in lower) and \
            ('balance' in lower):
                header = ['date', 'description']
                if ('deposit' in lower):
                    header.append('deposit')
                else:
                    header.append('out')
                if ('withdrawal' in lower):
                    header.append('withdrawal')
                else:
                    header.append('out')
                header.append('balance')
                
                if row.find(header[2]) < row.find(header[3]):
                    firstIndex = row.find(header[2])
                else:
                    firstIndex = row.find(header[3])
                    temp = header[2]
                    header[2] = header[3]
                    header[3] = temp                    
                break
    if header == []:
        return (False, 'Invalid bank type. Unable to process this file.')
    
    date = description = ''
    change = balance = 0.0
    accNo = 'Unknown Acc No'
    transactionStart = False
    for row in textList:
        checkHeader = 0
        for each in header:
            if each in row.lower():
                checkHeader += 1
        if checkHeader == len(header):
            transactionStart = True
            continue
        
        if not transactionStart:
            continue
        
        rowBreakdown = standardRowBreakdown(row)
        
        if not rowBreakdown:
            if date != '':
                nextDescriptionLine = row.split('  ')[0]
                if len(nextDescriptionLine) < 60:
                    description += '\n' + nextDescriptionLine
            continue
        
        if statements == []:
            statements.append(Statement(account=Account(account_no=accNo)))
            
        if firstTrans == []:
            firstTrans = [row, rowBreakdown]

        if firstTrans != [] and (firstTrans[1][0] > rowBreakdown[0]):
            firstTrans = [row, rowBreakdown]
        
        
        check = row[firstIndex:].strip().replace('0', ' ').replace('.', ' ')
        if len(check) > longer:
            longer = len(check)
        if len(check) < shorter:
            shorter = len(check)
        
        if date != '':
            statements[0].transactions.append(Transaction(
                transaction_date=date,
                transaction_description=description,
                amount_changed=change,
                ending_balance=balance,
                account_no=accNo
            ))
            date = description = ''
            change = balance = 0.0
            
        date, description, change, balance = rowBreakdown
        
    statements[0].transactions = sorted(statements[0].transactions, key=lambda x: x.transaction_date)
    
    if len(statements[0].transactions) != 0:
        statements[0].hasData = True
        
        changeBal = firstTrans[0][firstIndex:].strip()
        if abs(len(changeBal) - longer) < abs(len(changeBal) - shorter):
            changeType = header[2]
        else: 
            changeType = header[3]

        if changeType == 'in' or changeType == 'deposit':
            initialBal = firstTrans[1][-1] - firstTrans[1][-2]
        else:
            initialBal = firstTrans[1][-1] + firstTrans[1][-2]
        
        assignWithdrawDeposit(statements[0], initialBal)
        setLatestDate(statements[0])
        statements[0].account.balance = statements[0].transactions[-1].ending_balance

    return (True, statements)
