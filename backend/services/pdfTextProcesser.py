from backend.models.account import Account, Statement
from backend.models.keywordDict import bankKeywords
from backend.models.transaction import Transaction
from backend.utils.textFormatter import rmSpaceFromList


def detectBank(textList: list) -> str:
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


def processDBS(textList: list) -> list[Statement]:
    accountTabIndex = []
    for index, line in enumerate(textList):
        # Account list in dbs split into multiple section
        if (line.find('Account') != -1) & (line.find('Account No.') != -1) & (line.rfind('Balance') != -1):
            accountTabIndex.append(index + 2)

    accountList = []
    
    for index in accountTabIndex:
        while len(textList[index]) > 3:
            stripped = rmSpaceFromList(textList[index].split('  '))
            print(stripped)
            try:
                float(stripped[-1].replace(',',''))
            except ValueError:
                # break if last item is not balance value
                break
            accountList.append(
                Account(
                    account_name=stripped[0],
                    bank_name="DBS",
                    account_no=stripped[1],
                    balance=stripped[-1].replace(',',''))
            )
            index += 1

    statements = [Statement(account=account) for account in accountList]

    for statement in statements:
        # find where in file is begining of transaction table for the account
        transactionStartIndex = []
        for index, line in enumerate(textList):
            if ('Account No. ' + statement.account.account_no) in line:
                transactionStartIndex.append(index)

        if len(transactionStartIndex) == 0:
            continue
        statement.hasData = True

        reachedTransStart = False
        initialBal = None
        date = description = ''
        change = balance = 0.0

        for index in transactionStartIndex:
            reachedTransStart = True

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
                    break

                if ('Balance Brought Forward' in row):
                    if (initialBal == None):
                        initialBal = float(rmSpaceFromList(
                            row.split('  '))[-1].split(' ')[-1].replace(',',''))
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

                split = row.split('  ')
                # pdfplumber single space btw data and description
                dateIndex = split[0].find(' ')

                dd, mm, yyyy = split[0][0:dateIndex].split('/')
                date = yyyy + '-' + mm + '-' + dd

                description = str(split[0][dateIndex:]).strip()

                amountBalList = rmSpaceFromList(split[1:])

                # stupid statement sometime have last row of just date and bal
                if len(amountBalList) < 2:
                    date = description = ''
                    change = balance = 0.0
                    index += 1
                    continue

                tempChange, tempBal = amountBalList
                change = float(tempChange.replace(',',''))
                balance = float(tempBal.replace(',',''))
                index += 1
        # compiled list of all transactions for this account

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

    return statements
