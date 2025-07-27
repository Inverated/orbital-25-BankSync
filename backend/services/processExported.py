import io
from openpyxl import Workbook
import pdfplumber
from pypdf import PdfReader, PdfWriter
from backend.models.account import Account, Statement
from backend.models.transaction import Transaction
from backend.utils.postProcessessing import setLatestDate

def processExportedPdf(pypdf: PdfReader) -> tuple[bool, list[Statement]]:
    newStream = io.BytesIO()
    writer = PdfWriter()
    for page in pypdf.pages:
        writer.add_page(page)
    writer.write(newStream)
    
    tables = []
    with pdfplumber.open(newStream) as f:
        for page in f.pages:
            for table in page.extract_tables():
                tables.append(table)
    
    if len(tables) == 0:
        return (False, 'Please use exported pdf file only')
    
    statements: list[Statement] = []
    for index in range(1, len(tables[0])):
        statements.append(Statement(
            hasData=False,
            account=Account(
                bank_name=tables[0][index][0],
                account_no=tables[0][index][1],
                account_name=tables[0][index][2],
                balance=tables[0][index][3],
                latest_recorded_date=tables[0][index][4],
            )
        ))

    date = ''
    for table in tables[1:]:
        for index in range(1, len(table)):
            added = False
            if table[index][0] == '':
                description += '\n' + table[index][1]
                continue
            
            if date != '':
                for each in statements:
                    if each.account.account_no == accNo:
                        each.transactions.append(Transaction(
                            transaction_date=date,
                            transaction_description=description,
                            deposit_amount=deposit,
                            withdrawal_amount=withdrawal,
                            ending_balance=balance,
                            account_no=accNo,
                        ))
                        each.hasData = True
                        added = True
                if not added:
                    statements.append(Statement(
                        hasData=True,
                        account=Account(
                            account_no=accNo
                        ),
                        transactions=[Transaction(
                            transaction_date=date,
                            transaction_description=description,
                            deposit_amount=deposit,
                            withdrawal_amount=withdrawal,
                            ending_balance=balance,
                            account_no=accNo,
                        )]
                    ))
            date=table[index][0]
            description=table[index][1]
            deposit=table[index][2]
            withdrawal=table[index][3]
            balance=table[index][4]
            accNo=table[index][-1]
            
    if date != '':
        for each in statements:
            if each.account.account_no == accNo:
                each.transactions.append(Transaction(
                    transaction_date=date,
                    transaction_description=description,
                    deposit_amount=deposit,
                    withdrawal_amount=withdrawal,
                    ending_balance=balance,
                    account_no=accNo,
                ))
                each.hasData = True
                added = True
        if not added:
            statements.append(Statement(
                hasData=True,
                account=Account(
                    account_no=accNo
                ),
                transactions=[Transaction(
                    transaction_date=date,
                    transaction_description=description,
                    deposit_amount=deposit,
                    withdrawal_amount=withdrawal,
                    ending_balance=balance,
                    account_no=accNo,
                )]
            ))
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
            
        latestDate = row[4]
        if not isinstance(row[4], str):
            latestDate = row[4].strftime('%Y-%m-%d')
        statements.append(Statement(
            hasData=False,
            account=Account(
                bank_name=str(row[0]),
                account_no=str(row[1]),
                account_name=str(row[2]),
                balance=row[3],
                latest_recorded_date=str(latestDate)
            )
        ))

    transTab = workbook['Transactions']
    validTrans = False
    for index, row in enumerate(transTab.iter_rows(values_only=True)):
        if row[0] == None:
            break
        if index == 0:
            if row == ('Transaction Date', 'Description', 'Deposit', 'Withdrawal', 'Ending Balance', 'Category', 'Account No'):
                validTrans = True
            continue
        else:
            if not validTrans:
                return (False, 'Please use exported excel file only')

        date, description, deposit, withdrawal, endingBal, category, accNo = row
        date = date.date().isoformat()
        accNo = str(accNo)
        description = str(description)
        category = str(category)
        
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
