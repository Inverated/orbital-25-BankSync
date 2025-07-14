from openpyxl import Workbook
from backend.models.account import Account, Statement
from backend.models.transaction import Transaction
from backend.utils.postProcessessing import setLatestDate
from backend.utils.rowBreakdown import standardRowBreakdown
from backend.utils.textFormatter import rmSpaceFromList

def processExportedPdf(textList: list[str]) -> tuple[bool, list[Statement]]:
    transactionStart = False
    statements: list[Statement] = []

    for index in range(len(textList)):
        if transactionStart:
            break

        row = textList[index]
        transactionStartRow = -1

        if ('Last Recorded Date' in row) and ('Account Name' in row) and ('Account No' in row):
            accNo_index = row.index('Account No')
            accName_index = row.index('Account Name')
            bal_index = row.index('Balance')

            if (accNo_index == -1) or (accName_index == -1) or (bal_index == -1):
                continue

            lastDate = bankName = accName = accNo = ''
            accBalance = 0.0

            while textList[index + 1].strip() != 'Transactions':
                nextRow = textList[index + 1]

                splitted = rmSpaceFromList(nextRow.split(' '))

                if len(splitted) < 3:
                    if accNo == '':
                        continue

                    bankName += nextRow[0:accNo_index].strip()
                    accNo += nextRow[accNo_index: accName_index].strip()
                    accName += nextRow[accName_index: bal_index].strip()
                    index += 1
                    continue

                if accNo != '':
                    statements.append(Statement(account=Account(
                        account_no=accNo,
                        account_name=accName,
                        bank_name=bankName,
                        balance=accBalance,
                        latest_recorded_date=lastDate)))
                    lastDate = bankName = accName = accNo = ''
                    accBalance = 0.0

                lastDate = splitted[-1].strip()
                accBalance = float(splitted[-2])
                bankName = nextRow[0:accNo_index].strip()
                accNo = nextRow[accNo_index: accName_index].strip()
                accName = nextRow[accName_index: bal_index].strip()
                index += 1

            if accNo != '':
                statements.append(Statement(account=Account(
                    account_no=accNo,
                    account_name=accName,
                    bank_name=bankName,
                    balance=accBalance,
                    latest_recorded_date=lastDate)))

            if textList[index + 1].strip() == 'Transactions':
                transactionStartRow = index + 4

            transactionStart = True

    transHeader = transactionStartRow - 2
    category_index = textList[transHeader].index('Category')
    accNo_index = textList[transHeader].index('Account No')
    if (category_index == -1) or (accNo_index == -1):
        return (False, 'File cannot be parsed')

    date = description = category = transAccNo = ''
    deposit = withdrawal = endingBal = 0.0

    for index in range(transactionStartRow, len(textList)):
        row = textList[index]

        if ('Transaction' in row) and ('Description' in row) and ('Deposit' in row) and ('Withdrawal' in row) and ('Account No' in row):
            continue
        if ('Date' in row) and ('Balance' in row):
            continue

        rowBreakdown = standardRowBreakdown(row[:category_index])

        if not rowBreakdown:
            # Add entire row to description and move on
            description += '\n' + row.split('  ')[0]
            continue
        else:
            splitted = rmSpaceFromList(row.split(' '))
            transAccNo = splitted[-1].strip()
            category = row[category_index:].replace(transAccNo, '').strip()

            if date != '':
                added = False
                for each in statements:
                    if each.account.account_no == transAccNo:
                        each.transactions.append(Transaction(
                            transaction_date=date,
                            transaction_description=description,
                            withdrawal_amount=withdrawal,
                            deposit_amount=deposit,
                            category=category,
                            ending_balance=endingBal,
                            account_no=transAccNo
                        ))
                        each.hasData = True
                        added = True
                        break

                if not added:
                    statements.append(Statement(
                        hasData=True,
                        account=Account(account_no=transAccNo),
                        transactions=[Transaction(
                            transaction_date=date,
                            transaction_description=description,
                            withdrawal_amount=withdrawal,
                            deposit_amount=deposit,
                            category=category,
                            ending_balance=endingBal,
                            account_no=transAccNo
                        )]
                    ))
        date, description, change, endingBal = rowBreakdown

        splitted = rmSpaceFromList(row.split(' '))
        for i in range(0, len(splitted)):
            try:
                num = float(splitted[i])
                if num == change:
                    try:
                        deposit = float(splitted[i - 1])
                        withdrawal = num
                    except:
                        try:
                            withdrawal = float(splitted[i + 1])
                            deposit = num
                        except:
                            withdrawal = deposit = 0.0
                            continue
                    break
            except:
                continue

    for each in statements:
        if each.hasData:
            latestTrans = each.transactions[0]
            for trans in each.transactions:
                if trans.transaction_date > latestTrans.transaction_date:
                    latestTrans = trans
                    
            each.account.latest_recorded_date = latestTrans.transaction_date
            each.account.balance = latestTrans.ending_balance
            setLatestDate(each)

    return (True, statements)


def processExportedExcel(workbook: Workbook) -> tuple[bool, list[Statement]]:
    statements: list[Statement] = []

    accountTab = workbook['Accounts']
    validAcc = False
    for index, row in enumerate(accountTab.iter_rows(values_only=True)):
        if index == 0:
            if row == ('Bank Name', 'Account No', 'Account Name', 'Balance', 'Last Recorded Date'):
                validAcc = True
            continue
        else:
            if not validAcc:
                return (False, 'Please use exported excel file only')
        statements.append(Statement(
            hasData=False,
            account=Account(
                bank_name=row[0],
                account_no=row[1],
                account_name=row[2],
                balance=row[3],
                latest_recorded_date=row[4]
            )
        ))

    transTab = workbook['Transactions']
    validTrans = False
    for index, row in enumerate(transTab.iter_rows(values_only=True)):
        if index == 0:
            if row == ('Transaction Date', 'Description', 'Deposit', 'Withdrawal', 'Ending Balance', 'Category', 'Account No'):
                validTrans = True
            continue
        else:
            if not validTrans:
                return (False, 'Please use exported excel file only')

        date, description, deposit, withdrawal, endingBal, category, accNo = row
        date = date.date().isoformat()
        
        added = False
        for statement in statements:
            if statement.account.account_no == accNo:
                statement.hasData = True
                statement.transactions.append(Transaction(
                    transaction_date=date,
                    transaction_description=description,
                    withdrawal_amount=withdrawal,
                    deposit_amount=deposit,
                    category=category,
                    ending_balance=endingBal,
                    account_no=accNo
                ))
                added = True
                break
        
        if not added:
            statements.append(Statement(
                hasData=True,
                account=Account(
                    account_no=accNo
                ),
                transactions=[Transaction(
                    transaction_date=date,
                    transaction_description=description,
                    withdrawal_amount=withdrawal,
                    deposit_amount=deposit,
                    category=category,
                    ending_balance=endingBal,
                    account_no=accNo
                )]
            ))
            
    for each in statements:
        if each.hasData:
            latestTrans = each.transactions[0]
            for trans in each.transactions:
                if trans.transaction_date > latestTrans.transaction_date:
                    latestTrans = trans
                    
            each.account.latest_recorded_date = latestTrans.transaction_date
            each.account.balance = latestTrans.ending_balance
            setLatestDate(each)

    return (True, statements)
