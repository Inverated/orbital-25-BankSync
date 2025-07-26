import { render, screen } from '@testing-library/react';
import ExportButton from "../components/dashboard_components/dashboard_tabs/transactions_tab/ExportButton";
import userEvent from "@testing-library/user-event";
import { testAccounts, testTransactions } from '@/jest.setup';

const uniqueCat: string[] = ['cat1', 'cat2', 'cat3']

jest.mock("@/utils/downloadFile", () => ({
    exportToXlsx: Promise<Blob>,
    exportToPdf: Promise<Blob>,
    downloadBlob: Promise<Blob>,
    passwordProtect: Promise<Blob>,
}));

test('export function with display of loaded data', async () => {
    render(<ExportButton filteredAccount={[]} filteredTransaction={[]} />)

    expect(screen.queryByRole('button', { name: 'Export' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()

    const user = userEvent.setup()
    const exportButton = screen.getByRole('button', { name: 'Export' })
    await user.click(exportButton)

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Accounts' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Transactions' })).toBeInTheDocument()

    const accountsTab = screen.getByRole('button', { name: 'Accounts' })
    const transactionTab = screen.getByRole('button', { name: 'Transactions' })
    const filterCheckbox = screen.getByRole('checkbox')

    //dummy data present
    testAccounts.forEach(acc => {
        expect(screen.getByText(acc.account_name)).toBeInTheDocument()
        expect(screen.getByText(acc.account_no)).toBeInTheDocument()
        expect(screen.getByText(acc.bank_name)).toBeInTheDocument()
        expect(screen.getByText(RegExp(acc.balance.toString() + '.00'))).toBeInTheDocument()
        expect(screen.getByText(acc.latest_recorded_date)).toBeInTheDocument()
    })

    await user.click(transactionTab)
    testTransactions.forEach(transaction => {
        expect(screen.getAllByText(transaction.category))
        expect(screen.getAllByText(transaction.transaction_description))
        expect(screen.getAllByText(RegExp(transaction.deposit_amount.toString() + '.00')))
        expect(screen.getAllByText(RegExp(transaction.withdrawal_amount.toString() + '.00')))
        expect(screen.getAllByText(RegExp(transaction.ending_balance.toString() + '.00')))
    })

    await user.click(accountsTab)
    await user.click(filterCheckbox)

    testAccounts.forEach(acc => {
        expect(screen.queryByText(acc.account_name)).not.toBeInTheDocument()
        expect(screen.queryByText(acc.account_no)).not.toBeInTheDocument()
        expect(screen.queryByText(acc.bank_name)).not.toBeInTheDocument()
        expect(screen.queryByText(RegExp(acc.balance.toString() + '.00'))).not.toBeInTheDocument()
        expect(screen.queryByText(acc.latest_recorded_date)).not.toBeInTheDocument()
    })

    await user.click(transactionTab)
    testTransactions.forEach(transaction => {
        expect(screen.queryAllByText(transaction.category).length).toEqual(0)
        expect(screen.queryAllByText(transaction.transaction_description).length).toEqual(0)
        expect(screen.queryAllByText(RegExp(transaction.deposit_amount.toString() + '.00')).length).toEqual(0)
        expect(screen.queryAllByText(RegExp(transaction.withdrawal_amount.toString() + '.00')).length).toEqual(0)
        expect(screen.queryAllByText(RegExp(transaction.ending_balance.toString() + '.00')).length).toEqual(0)
    })

    //close dialogue
    const close = screen.getByRole('button', { name: 'Close' })
    await user.click(close)

    expect(screen.queryByRole('button', { name: 'Export' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()
})