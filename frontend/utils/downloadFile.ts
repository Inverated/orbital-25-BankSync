import { Account, Transaction } from "./types";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default async function exportToXlsx(accountEntry: Account[], transactionEntry: Transaction[], accountHeader: string[], transactionHeader: string[]) {
    const workbook = new ExcelJS.Workbook()
    const accountSheet = workbook.addWorksheet("Accounts")
    accountSheet.columns = [
        {
            header: 'Bank Name',
            key: 'Bank Name',
            width: 'Bank Name'.length + 2
        },
        {
            header: 'Account No',
            key: 'Account No',
            width: 'Account No'.length * 2
        },
        {
            header: 'Account Name',
            key: 'Account Name',
            width: 'Account Name'.length + 2
        },
        {
            header: 'Balance',
            key: 'Balance',
            width: 'Balance'.length + 2
        },
        {
            header: 'Last Recorded Date',
            key: 'Last Recorded Date',
            width: 'Last Recorded Date'.length
        }
    ]

    accountSheet.getColumn('Balance').numFmt = '0.00'
    accountSheet.getRow(1).font = { bold: true }

    accountEntry.forEach(entry => {
        accountSheet.addRow([
            entry.bank_name, entry.account_no, entry.account_name, entry.balance, entry.latest_recorded_date
        ])
    })

    const transactionSheet = workbook.addWorksheet("Transaction")
    transactionSheet.columns = [
        {
            header: 'Transaction Date',
            key: 'Transaction Date',
            width: 'Transaction Date'.length
        },
        {
            header: 'Description',
            key: 'Description',
            width: 'Description'.length * 4
        },
        {
            header: 'Deposit',
            key: 'Deposit',
            width: 'Withdrawal'.length + 3
        },
        {
            header: 'Withdrawal',
            key: 'Withdrawal',
            width: 'Withdrawal'.length + 3
        },
        {
            header: 'Category',
            key: 'Category',
            width: 'Category'.length * 2
        },
        {
            header: 'Ending Balance',
            key: 'Ending Balance',
            width: 'Ending Balance'.length
        },
        {
            header: 'Account No',
            key: 'Account No',
            width: 'Account No'.length * 2
        }
    ]

    transactionSheet.getColumn('Transaction Date').numFmt = 'dd/mm/yyyy'
    transactionSheet.getColumn('Withdrawal').numFmt = '0.00'
    transactionSheet.getColumn('Deposit').numFmt = '0.00'
    transactionSheet.getColumn('Ending Balance').numFmt = '0.00'
    transactionSheet.getColumn('Description').alignment = { wrapText: true }
    accountSheet.getRow(1).font = { bold: true }

    transactionEntry.forEach(entry => {
        transactionSheet.addRow([
            new Date(entry.transaction_date), entry.transaction_description, entry.deposit_amount, entry.withdrawal_amount, entry.category, entry.ending_balance, entry.account_no
        ])
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Transaction History');
}