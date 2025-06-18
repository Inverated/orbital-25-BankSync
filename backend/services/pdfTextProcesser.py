import re
from backend.models.account import Account, Statement
from backend.models.keywordDict import bankKeywords, accountTableKeywords, monthLookup
from backend.models.transaction import Transaction
from backend.utils.textFormatter import rmSpaceFromList


def detectBank(textList: list[str]) -> str:
    freqList = {keys: 0 for keys in list(bankKeywords.keys())}
    for line in textList:
        for key, values in bankKeywords.items():
            if any(keywords in line.lower() for keywords in values):
                freqList[key] += 1

    bank = None
    highestFreq = 0
    for key, freq in freqList.items():
        if (freq > highestFreq) & (freq != 0):
            bank = key
            highestFreq = freq

    return bank


def detectAccountTable(parameters: list[str], textList: list[str]) -> list[int]:
    accountTableIndex = []
    # for long list of possible of keywords of unknown bank type
    min_conf = 3 if len(parameters) > 6 else len(parameters)
    for index, line in enumerate(textList):
        conf = 0
        for keyword in parameters:
            if keyword in line:
                conf += 1

        # use in future for unknown bank?
        if conf >= min_conf:
            accountTableIndex.append(index)
    return accountTableIndex

def assignWithdrawDeposit(statement: Statement, initialBal: float):
    for index, transaction in enumerate(statement.transactions):
        if index == 0:
            if transaction.ending_balance > initialBal:
                transaction.deposit_amount = transaction.amount_changed
            else:
                transaction.withdrawal_amount = transaction.amount_changed
            continue

        if transaction.ending_balance > statement.transactions[index - 1].ending_balance:
            transaction.deposit_amount = transaction.amount_changed
        else:
            transaction.withdrawal_amount = transaction.amount_changed

def processDBS(textList: list[str]) -> list[Statement]:
    # acc list starts from +2 index
    accountTableIndex = [
        index + 2 for index in detectAccountTable(accountTableKeywords['DBS'], textList)]
    accountList = []

    for index in accountTableIndex:
        while len(textList[index]) > 3:
            accountDetail = rmSpaceFromList(textList[index].split('  '))
            try:
                float(accountDetail[-1].replace(',', ''))
            except ValueError:
                # break if last item is not balance value
                break
            accountList.append(
                Account(
                    account_name=accountDetail[0],
                    bank_name="DBS",
                    account_no=accountDetail[1],
                    balance=accountDetail[-1].replace(',', '')
                )
            )
            index += 1

    if accountList == []:
        return (False, 'Account data cannot be read')

    statements = [Statement(account=account) for account in accountList]
    for statement in statements:
        # find where is begining of all transaction table for current account
        transactionStartIndex = []
        for index, line in enumerate(textList):
            if ('Account No. ' + statement.account.account_no) in line:
                transactionStartIndex.append(index)

        if len(transactionStartIndex) == 0:
            continue
        statement.hasData = True

        reachedTransStart = False
        initialBal = None
        

        for index in transactionStartIndex:
            reachedTransStart = True
            date = description = ''
            change = balance = 0.0 
             
            while True:
                row = textList[index]
                # End of page/transaction
                if 'Balance Carried Forward' in row:
                    if date != '':
                        statement.transactions.append(Transaction(
                            transaction_date=date,
                            transaction_description=description,
                            amount_changed=change,
                            ending_balance=balance,
                            account_no=statement.account.account_no))
                        date = description = ''
                        change = balance = 0.0
                    break

                if ('Balance Brought Forward' in row):
                    if (initialBal == None):
                        initialBal = float(rmSpaceFromList(
                            row.split('  '))[-1].split(' ')[-1].replace(',', ''))
                    date = description = ''
                    change = balance = 0.0
                    index += 1
                    continue
                if (not reachedTransStart) & ("/" not in row[0:3]):
                    date = description = ''
                    change = balance = 0.0
                    index += 1
                    continue

                # does not start with date
                if "/" not in row[0:3]:
                    description += '\n' + textList[index]
                    index += 1          
                    continue
                elif (len(row) > 4) & (not bool(re.fullmatch(r"\d+/\d+", row[0:4]))):
                    description += '\n' + textList[index]
                    index += 1          
                    continue

                # reached new transaction row, add old to list
                if date != '':
                    statement.transactions.append(Transaction(
                        transaction_date=date,
                        transaction_description=description,
                        amount_changed=change,
                        ending_balance=balance,
                        account_no=statement.account.account_no
                    ))
                    date = description = ''
                    change = balance = 0.0

                splitted = row.split('  ')
                # pdfplumber single space btw data and description
                dateIndex = splitted[0].find(' ')

                dd, mm, yyyy = splitted[0][0:dateIndex].split('/')
                date = yyyy + '-' + mm + '-' + dd

                description = str(splitted[0][dateIndex:]).strip()

                amountBalList = rmSpaceFromList(splitted[1:])

                # stupid statement sometime have last row of just date and bal
                if len(amountBalList) < 2:
                    date = description = ''
                    change = balance = 0.0
                    index += 1
                    continue

                tempChange, tempBal = amountBalList
                change = float(tempChange.replace(',', ''))
                balance = float(tempBal.replace(',', ''))
                index += 1
        # compiled list of all transactions for this account

        assignWithdrawDeposit(statement, initialBal)

    return statements

def processUOB(textList: list[str]) -> list[Statement]:
    accountTableIndex = [(index + 1) for index in detectAccountTable(accountTableKeywords['UOB'], textList)]
    accountList = []

    for index in accountTableIndex:
        while not 'Total' in textList[index]:
            accountDetail = rmSpaceFromList(textList[index].split('  '))
            if len(accountDetail) >= 3: 
                account_no = textList[index + 1]
                accountList.append(
                    Account(
                        account_name=accountDetail[0],
                        bank_name='UOB',
                        account_no=account_no,
                        balance=accountDetail[-1].replace(',', '')
                    )
                )
            index += 1

    if accountList == []:
        return (False, 'Account data cannot be read')

    statements = [Statement(account=account) for account in accountList]
    
    yyyy = ''
    for row in textList:
        if ('Account Overview as at' in row) | ('Period: ' in row):
            yyyy = row.split(' ')[-1].strip()
            break
            
    for statement in statements:
        transactionStartIndex = []
        for index, line in enumerate(textList):
            if (statement.account.account_name + ' ' + statement.account.account_no) in line:
                transactionStartIndex.append(index + 3)

        if len(transactionStartIndex) == 0:
            continue
        statement.hasData = True
        
        reachedTransStart = False
        initialBal = None
        
        for index in transactionStartIndex:
            reachedTransStart = True
            date = description = ''
            change = balance = 0.0
            
            while True:
                row = textList[index]
                if ('Pleasenotethatyouareboundbyaduty' in row) | ('End of Transaction' in row):
                    if date != '':
                        statement.transactions.append(Transaction(
                            transaction_date=date,
                            transaction_description=description,
                            amount_changed=change,
                            ending_balance=balance,
                            account_no=statement.account.account_no))
                        date = description = ''
                        change = balance = 0.0
                    break
                
                #One time appearance for uob
                if ('BALANCE B/F' in row):
                    if (initialBal == None):
                        initialBal = float(rmSpaceFromList(
                            row.split('  '))[-1].split(' ')[-1].replace(',', ''))
                    date = description = ''
                    change = balance = 0.0
                    index += 1
                    continue
                if (not reachedTransStart) & (not row.split(' ')[0].isdigit()):
                    date = description = ''
                    change = balance = 0.0
                    index += 1
                    continue
                
                try:
                    #if can convert, means is new row of transaction
                    testSplit = rmSpaceFromList(row.split('  '))
                    testChange = testSplit[-2].replace(',', '')
                    testBalance = testSplit[-1].replace(',', '')
                    float(testChange)
                    float(testBalance)
                    if 'Total' in testSplit[0]:
                        index += 1
                        continue
                except:
                    #Add entire row to description and move on
                    description += '\n' + textList[index]
                    index += 1
                    continue
                
                if date != '':
                    statement.transactions.append(Transaction(
                        transaction_date=date,
                        transaction_description=description,
                        amount_changed=change,
                        ending_balance=balance,
                        account_no=statement.account.account_no
                    ))
                    date = description = ''
                    change = balance = 0.0
                
                splitted = rmSpaceFromList(row.split('  '))

                dayMonthList = splitted[0].strip().split(' ')
                dd = dayMonthList[0]
                mm = monthLookup[str(dayMonthList[1]).lower()]
                date = yyyy + '-' + mm + '-' + dd
                
                description = str(splitted[1]).strip()
                change = float(splitted[-2].replace(',', ''))
                balance = float(splitted[-1].replace(',', ''))
                index += 1
                                
        assignWithdrawDeposit(statement, initialBal)
    
    return statements

