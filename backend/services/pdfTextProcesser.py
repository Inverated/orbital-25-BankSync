import re
from backend.models.account import Account, Statement
from backend.models.keywordDict import bankKeywords, accountTableKeywords, monthLookup
from backend.models.transaction import Transaction
from backend.utils.rowBreakdown import standardRowBreakdown
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
        if (freq > highestFreq) and (freq != 0):
            bank = key
            highestFreq = freq
    return bank

def detectAccountTable(parameters: list[str], textList: list[str]) -> list[int]:
    accountTableIndex = []

    min_conf = int(0.7 * len(parameters)) if len(parameters) > 6 else len(parameters)
    for index, line in enumerate(textList):
        conf = 0
        for keyword in parameters:
            if keyword in line:
                conf += 1

        # use in future for unknown bank? nah, how they put in table different
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

def setLatestDate(transaction: Statement):
    if len(transaction.transactions) == 0:
        return 
    fst = transaction.transactions[0].transaction_date
    snd = transaction.transactions[-1].transaction_date
    if fst > snd: 
        transaction.account.latest_recorded_date = fst
    else:
        transaction.account.latest_recorded_date = snd

def processDBS(textList: list[str]) -> list[Statement]:
    # acc list starts from +2 index
    accountTableIndex = [
        index + 2 for index in detectAccountTable(accountTableKeywords['DBS'], textList)]
    accountList = []

    for index in accountTableIndex:
        while len(textList[index]) > 3:
            accountNo = ''
            accountName = ''
            accountBal = 0.0
            
            splitted = rmSpaceFromList(textList[index].split(' '))
            for itemIndex, item in enumerate(reversed(splitted)):
                # account no always contain numbers without . , before the balances with _.00
                if (not '.' in item) and (any(char.isdigit() for char in item)):
                    accountNo = item
                    accountName = ' '.join(splitted[: len(splitted) - itemIndex - 1])
                    break
            try:
                accountBal = float(splitted[-1].replace(',', ''))
            except ValueError:
                # break if last item is not balance value
                break
            
            if ('account summary' in textList[index].lower()):
                break
            
            accountList.append(
                Account(
                    account_name=accountName,
                    bank_name="DBS",
                    account_no=accountNo,
                    balance=accountBal
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
        
        initialBal = None

        for index in transactionStartIndex:
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

                rowBreakdown = standardRowBreakdown(row)

                if not rowBreakdown:
                    try:
                        # stupid statement sometime have last row of just date and bal
                        splitted = rmSpaceFromList(row.split(' '))
                        if len(splitted) == 2: 
                            float(splitted[1])
                            index += 1                        
                            continue
                    except:
                        None
                    description += '\n' + row
                    index += 1          
                    continue

                # reached new transaction row, add old to list
                else:
                    if (date != ''):
                        statement.transactions.append(Transaction(
                            transaction_date=date,
                            transaction_description=description,
                            amount_changed=change,
                            ending_balance=balance,
                            account_no=statement.account.account_no
                        ))
                    date = description = ''
                    change = balance = 0.0

                date, description, change, balance = rowBreakdown                 
                index += 1
                
        if len(statement.transactions) != 0:
            statement.hasData = True
            assignWithdrawDeposit(statement, initialBal)
            setLatestDate(statement) 

    return (True, statements)

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
    yyyy = 1900
    
    for row in textList:
        if ('Account Overview as at' in row) or ('Period: ' in row):
            match = re.search(r'\b\d{4}\b', row)
            if match:
                yyyy = match.group()
                break
            
    for statement in statements:
        transactionStartIndex = []
        for index, line in enumerate(textList):
            if (statement.account.account_name + ' ' + statement.account.account_no) in line:
                transactionStartIndex.append(index + 3)

        if len(transactionStartIndex) == 0:
            continue
        
        initialBal = None
        
        for index in transactionStartIndex:
            date = description = ''
            change = balance = 0.0
            
            while True:
                row = textList[index]
                if ('Pleasenotethatyouareboundbyaduty' in row) or ('End of Transaction' in row):
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
                
                if ('BALANCE B/F' in row):
                    if (initialBal == None):
                        initialBal = float(rmSpaceFromList(
                            row.split('  '))[-1].split(' ')[-1].replace(',', ''))
                    date = description = ''
                    change = balance = 0.0
                    index += 1
                    continue
                
                rowBreakdown = (standardRowBreakdown(row, yyyy))
                if not rowBreakdown:
                    if not 'Total' in rmSpaceFromList(row.split('  '))[0]:
                        # Skip UOB last line: Total    withdrawal deposit bal values. 
                        description += '\n' + textList[index]
                    index += 1
                    continue
                else:
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
                
                date, description, change, balance = rowBreakdown
                index += 1
                                
        if len(statement.transactions) != 0:
            statement.hasData = True
            assignWithdrawDeposit(statement, initialBal)
            setLatestDate(statement)  

    return (True, statements)

def processOCBC(textList: list[str]) -> list[Statement]:
    accountNumList = []
    accountList = []
    stupidIdRuinThings = ''
    yyyy = '1900'
    
    #no account table
    for index, line in enumerate(textList):
        row = rmSpaceFromList(line.split('  '))
        if ('OF ACCOUNT' in line) or ('TRANSACTION CODE DESCRIPTION' in line):
            stupidIdRuinThings = textList[index - 1].split('\\')[0]
        else:
            if len(stupidIdRuinThings) > 9 and stupidIdRuinThings[0] != 'R' and stupidIdRuinThings[-2] != '\\':
                stupidIdRuinThings = 'Deposit Insurance Scheme'
    
        if 'account no.' in line.lower():
            accNameRow = rmSpaceFromList(textList[index - 1].split(' '))
            newDateRow = rmSpaceFromList(textList[index - 2].split(' '))
            
            account_name = rmSpaceFromList(textList[index - 1].split('  '))[0]

            if monthLookup.get(accNameRow[-2].lower()) != None:
                yyyy = accNameRow[-1]
            elif monthLookup.get(newDateRow[-2].lower()) != None:
                yyyy = newDateRow[-1]
            else:
                continue
            
            account_no = textList[index].replace('Account No. ', '').strip()
            if account_no in accountNumList:
                continue
            
            accountNumList.append(account_no)
            accountList.append(
                Account(
                    account_name=account_name,
                    bank_name='OCBC',
                    account_no=account_no
                )
            )
        
    if accountList == []:
        return (False, 'Account data cannot be read')

    statements = [Statement(account=account) for account in accountList]
    
    for statement in statements:
        transactionStartIndex = []
        for index, line in enumerate(textList):
            if ('TRANSACTION CODE DESCRIPTION' in row):
                continue
            if ('Account No. ' + statement.account.account_no in line):
                transactionStartIndex.append(index + 3)

        if len(transactionStartIndex) == 0:
            continue
        
        initialBal = None
        
        for index in transactionStartIndex:
            date = description = ''
            change = balance = 0.0
            
            while True:
                row = textList[index]
                if ((stupidIdRuinThings != '') and (stupidIdRuinThings in row)) or ('Deposit Insurance Scheme' in row) or ('BALANCE C/F' in row) or ('TRANSACTION CODE DESCRIPTION' in row):
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
                
                if ('BALANCE B/F' in row):
                    if (initialBal == None):
                        initialBal = float(rmSpaceFromList(
                            row.split('  '))[-1].split(' ')[-1].replace(',', ''))
                    date = description = ''
                    change = balance = 0.0
                    index += 1
                    continue
                
                rowBreakdown = standardRowBreakdown(row, yyyy)
                
                if not rowBreakdown:
                    #Add entire row to description and move on
                    if len(row) != 1:
                        #some have letters, no idea if used to categorise
                        description += '\n' + row
                    index += 1
                    continue
                else:
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
    
                date, description, change, balance = rowBreakdown
                index += 1
                
        if len(statement.transactions) != 0:
            statement.hasData = True
            assignWithdrawDeposit(statement, initialBal)
            setLatestDate(statement)
            statement.account.balance = statement.transactions[-1].ending_balance
        
    return (True, statements)

def processSC(textList: list[str]) -> list[Statement]:
    accountList = []
    
    for line in textList:
        row = rmSpaceFromList(line.split('  '))
        if len(row) == 2:
            lastIndexed = row[-1].split(' ')
            if len(lastIndexed) == 2:
                account_no = lastIndexed[0]
                account_name = row[0]
                accountList.append(
                    Account(
                        account_no=account_no,
                        account_name=account_name,
                        bank_name='SC'
                    )
                )

    if accountList == []:
        return (False, 'Account data cannot be read')
                        
    statements = [Statement(account=account) for account in accountList]
    
    for statement in statements:
        transactionStartIndex = []  #sc just store 1 index since it is nicely seperated by page no.

        for index, line in enumerate(textList):
            if (statement.account.account_name in line) and (statement.account.account_no in line):
                for nextIndex in range(index + 1, index + 15):
                    if ("Date" in textList[nextIndex]) and ("Description" in textList[nextIndex]) and ("Balance" in textList[nextIndex]):
                        transactionStartIndex.append(nextIndex)
                        break
            if transactionStartIndex != []:
                break

        if len(transactionStartIndex) == 0:
            continue
        
        initialBal = None
        
        for index in transactionStartIndex:
            date = description = ''
            change = balance = 0.0
            
            while True:
                row = textList[index]
                
                if 'CLOSING BALANCE' in row:
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
                
                match = re.search(r"Page\s+\d+\s+of\s+\d+", row)
                if match and (date != ''):
                    # after hitting page 1 of 2, sets date to ''. Date wont be updated until next page of transaction start
                    statement.transactions.append(Transaction(
                        transaction_date=date,
                        transaction_description=description,
                        amount_changed=change,
                        ending_balance=balance,
                        account_no=statement.account.account_no))
                    date = description = ''
                    change = balance = 0.0
                    index += 1
                    continue
                
                if 'BALANCE FROM PREVIOUS STATEMENT' in row:
                    if (initialBal == None):
                        initialBal = float(rmSpaceFromList(
                            row.split('  '))[-1].split(' ')[-1].replace(',', ''))
                    date = description = ''
                    change = balance = 0.0
                    index += 1
                    continue
                
                rowBreakdown = standardRowBreakdown(row)
                
                if not rowBreakdown:
                    #Add entire row to description and move on
                    if len(row) != 1:
                        #some have -
                        description += '\n' + row
                    index += 1
                    continue
                else:
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
                
                date, description, change, balance = rowBreakdown
                index += 1
                
        if len(statement.transactions) != 0:
            statement.hasData = True
            assignWithdrawDeposit(statement, initialBal)
            setLatestDate(statement)  
            statement.account.balance = statement.transactions[-1].ending_balance
        
    return (True, statements)  