import AccountSecurity from '@/components/settings_components/AccountSecurity';
import { Account, Transaction } from '@/utils/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';

const testTransactions: Transaction[] = [
    {
        transaction_date: dayjs("2024-06-01").toISOString(),
        transaction_description: "salary",
        withdrawal_amount: 0,
        deposit_amount: 1000,
        account_no: "12345",
        category: "salary",
        ending_balance: 1000,
    },
    {
        transaction_date: dayjs("2024-06-10").toISOString(),
        transaction_description: "transfer",
        withdrawal_amount: 0,
        deposit_amount: 500,
        account_no: "12345",
        category: "transfer",
        ending_balance: 1500,
    },
    {
        transaction_date: dayjs("2024-06-11").toISOString(),
        transaction_description: "food",
        withdrawal_amount: 200,
        deposit_amount: 0,
        account_no: "12345",
        category: "food",
        ending_balance: 1300,
    },
    {
        transaction_date: dayjs("2024-06-30").toISOString(),
        transaction_description: "food",
        withdrawal_amount: 100,
        deposit_amount: 0,
        account_no: "12345",
        category: "food",
        ending_balance: 1200,
    },
]

const testAccounts: Account[] = [
    {
        account_name: "account 1",
        account_no: '12345',
        bank_name: 'bank 1',
        balance: 100,
        latest_recorded_date: dayjs("2024-06-30").toISOString(),
    }
]

jest.mock('@/context/DatabaseContext', () => ({
    useDatabase: () => ({
        refreshDatabase: jest.fn(),
        loaded: true,
        transactions: testTransactions,
        accounts: testAccounts
    }),
}));

test('deletion of transaction data', async () => {
    render(<AccountSecurity />)

    expect(screen.getByText(/delete data/i)).toBeInTheDocument()
    expect(screen.getAllByRole('textbox').length).toEqual(2)

    expect(screen.getAllByRole('button').length).toEqual(2)

    const delDataButton = screen.getAllByRole('button')[0]
    const delDataText = screen.getAllByRole('textbox')[0]
    
    expect(delDataButton.classList).toContain('disabled')
    
    const user = userEvent.setup()

    await user.type(delDataText, 'DELETE MY DATA')
    expect(delDataButton.classList).not.toContain('disabled')
})

test('deletion of user account', async () => {
    render(<AccountSecurity />)

    expect(screen.getByText(/delete account/i)).toBeInTheDocument()
    expect(screen.getAllByRole('textbox').length).toEqual(2)

    expect(screen.getAllByRole('button').length).toEqual(2)

    const delAccButton = screen.getAllByRole('button')[1]
    const delAccText = screen.getAllByRole('textbox')[1]
    
    expect(delAccButton.classList).toContain('disabled')
    
    const user = userEvent.setup()

    await user.type(delAccText, 'DELETE MY ACCOUNT')
    expect(delAccButton.classList).not.toContain('disabled')
})