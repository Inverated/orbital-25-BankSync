import { Account, Transaction } from "./types";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { uploadFileToEncrypt } from "./uploadFile";

export async function exportToXlsx(accountEntry: Account[], transactionEntry: Transaction[]): Promise<Blob> {
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

    // Manually add details based on header order
    accountEntry.forEach(entry => {
        accountSheet.addRow([
            entry.bank_name, entry.account_no, entry.account_name, entry.balance, entry.latest_recorded_date
        ])
    })

    const transactionSheet = workbook.addWorksheet("Transactions")
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
            header: 'Ending Balance',
            key: 'Ending Balance',
            width: 'Ending Balance'.length
        },
        {
            header: 'Category',
            key: 'Category',
            width: 'Category'.length * 2
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
    transactionSheet.getRow(1).font = { bold: true }

    transactionEntry.forEach(entry => {
        transactionSheet.addRow([
            new Date(entry.transaction_date),
            entry.transaction_description,
            entry.deposit_amount,
            entry.withdrawal_amount,
            entry.ending_balance,
            entry.category,
            entry.account_no
        ])
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob
}

export async function exportToPdf(accountEntry: Account[], transactionEntry: Transaction[], accountHeader: string[], transactionHeader: string[]): Promise<Blob> {
    //const EXPORTACCOUNTHEADER = ['Bank Name', 'Account No', 'Account Name', 'Balance', 'Last Recorded Date']
    //const EXPORTTRANSACTIONHEADER = ['Transaction Date', 'Description', 'Deposit', 'Withdrawal', 'Ending Balance', 'Category', 'Account No']

    const unit = 'pt'
    const size = 'A4'
    const orientation = 'landscape'

    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)
    doc.setFontSize(17)

    const accountTitle = 'Accounts'
    doc.text(accountTitle, marginLeft, 40)

    doc.setLineWidth(0.5)
    doc.line(30, 50, 810, 50)

    const setAccHeaders = [accountHeader]
    const accContent = {
        startY: 60,
        head: setAccHeaders,
        body: accountEntry.map(each => [
            each.bank_name,
            each.account_no,
            each.account_name,
            each.balance.toFixed(2),
            each.latest_recorded_date
        ])
    }
    autoTable(doc, accContent)

    doc.addPage()

    const transactionTitle = 'Transactions'
    doc.text(transactionTitle, marginLeft, 40)

    doc.setLineWidth(0.5)
    doc.line(30, 50, 810, 50)

    const setTransHeaders = [transactionHeader]
    const transContent = {
        startY: 60,
        head: setTransHeaders,
        body: transactionEntry.map(each => [
            each.transaction_date,
            each.transaction_description,
            each.deposit_amount.toFixed(2),
            each.withdrawal_amount.toFixed(2),
            each.ending_balance.toFixed(2),
            each.category,
            each.account_no
        ])
    }
    autoTable(doc, transContent)

    const blob = doc.output('blob')

    return blob
}

export async function downloadBlob(blob: Blob) {
    saveAs(await blob, 'Transaction History')
}

export function passwordProtect(blob: Blob, exportOption: 'EXCEL' | "PDF", password: string) {
    const fileName = 'Transaction History'
    let file: File
    if (exportOption == 'PDF') {
        file = new File([blob], fileName, { type: 'application/pdf' })
    } else if (exportOption == 'EXCEL') {
        file = new File([blob], fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    } else {
        return null
    }

    return uploadFileToEncrypt(file, password)
}