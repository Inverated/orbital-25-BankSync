import { Account, Transaction } from "@/utils/types"
import TransactionRow from "../../components/dashboard_components/dashboard_tabs/transactions_tab/TransactionRow"
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const uniqueCat: string[] = ['cat1', 'cat2', 'cat3']

const details: Transaction & Partial<Account> = {
    account_no: 'Account no',
    account_name: 'Account name',
    bank_name: 'Bank name',

    id: 0,
    transaction_date: "Transaction Date",
    transaction_description: 'Transaction description',
    withdrawal_amount: 100,
    deposit_amount: 0,
    category: 'cat1',
    ending_balance: 10000
}

const testTransaction: Transaction = {
    transaction_description: "Transaction description",
    transaction_date: '2025-1-1',
    account_no: "Account No",
    category: "Cat1",
    withdrawal_amount: 1000,
    deposit_amount: 0,
    ending_balance: 100000
}

const testAccount: Account = {
    account_name: "Account Name",
    account_no: "Account No",
    bank_name: "Bank Name",
    balance: 10,
    latest_recorded_date: '2025-1-1',
}

jest.mock('@/context/DatabaseContext', () => ({
    useDatabase: () => ({
        refreshDatabase: jest.fn(),
        loaded: true,
        transactions: [testTransaction],
        accounts: [testAccount]
    }),
}));

beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

test('display individual transaction row', async () => {
    render(<TransactionRow details={details} uniqueCategory={uniqueCat} />)

    expect(screen.getByText(/transaction description/i)).toBeInTheDocument()
    expect(screen.getByText(/account name/i)).toBeInTheDocument()
    expect(screen.getByText(/cat1/i)).toBeInTheDocument()
    expect(screen.getByText(/transaction date/i)).toBeInTheDocument()

    expect(screen.queryByText(/account no/i)).not.toBeInTheDocument();

    const user = userEvent.setup()
    const row = screen.getByText(/transaction description/i)

    await user.click(row)

    expect(screen.queryByText(/account no/i)).toBeInTheDocument();
    expect(screen.queryByText(/bank name/i)).toBeInTheDocument();
    expect(screen.queryByText(/category/i)).toBeInTheDocument();
    expect(screen.queryByText(/10000/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()

    //simulate editing
    const editButt = screen.getByRole('button', { name: 'Edit' })
    await user.click(editButt)

    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()

    expect(screen.getByRole('combobox')).toBeInTheDocument()

    const selectExistingCat = screen.getByRole('combobox')
    const boxOptions = Array.from(selectExistingCat.querySelectorAll('option')).map(opt => opt.value)
    expect(uniqueCat).toEqual(boxOptions) 
})