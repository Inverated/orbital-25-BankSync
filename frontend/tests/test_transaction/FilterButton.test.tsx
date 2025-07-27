import { render, screen } from '@testing-library/react';
import FilterButton from '../../components/dashboard_components/dashboard_tabs/transactions_tab/FilterButton';
import { Dayjs } from 'dayjs';
import userEvent from '@testing-library/user-event';
import { Account, Transaction } from '@/utils/types';

const testTransactions: Transaction[] = [
    {
        transaction_date: "2024-06-01",
        transaction_description: "salary",
        withdrawal_amount: 0,
        deposit_amount: 1000,
        account_no: "12345",
        category: "salary",
        ending_balance: 1000,
    },
    {
        transaction_date: "2024-06-10",
        transaction_description: "transfer",
        withdrawal_amount: 0,
        deposit_amount: 500,
        account_no: "12345",
        category: "transfer",
        ending_balance: 1500,
    },
    {
        transaction_date: "2024-06-11",
        transaction_description: "food",
        withdrawal_amount: 200,
        deposit_amount: 0,
        account_no: "12345",
        category: "food",
        ending_balance: 1300,
    },
    {
        transaction_date: "2024-06-30",
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
        latest_recorded_date: "2024-06-30",
    },
    {
        account_name: "account 2",
        account_no: '54321',
        bank_name: 'bank 2',
        balance: 1000,
        latest_recorded_date: "2024-05-30",
    },
]

jest.mock('@/context/DatabaseContext', () => ({
    useDatabase: () => ({
        refreshDatabase: jest.fn(),
        loaded: true,
        transactions: testTransactions,
        accounts: testAccounts
    }),
}));

const handleFilterQuery = ((accountSelection: string[], categorySelection: string[], ascendingSelection: boolean,
    date: { startDate: Dayjs | null, endDate: Dayjs | null } | null) => { })

test('avaliable filter options from mock data', async () => {
    render(<FilterButton setFilter={handleFilterQuery} />)

    expect(screen.getByText('Filter')).toBeInTheDocument()

    const user = userEvent.setup()
    const filterButton = screen.getByText('Filter')
    await user.click(filterButton)

    expect(screen.getByRole('button', { name: /account name/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /category/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /date range/i })).toBeInTheDocument()

    const names = screen.getByRole('button', { name: /account name/i })
    await user.click(names)

    const nameList = [...new Set(testAccounts.map(entry => entry.bank_name + ": " + entry.account_name)
        .filter(item => item != undefined))]

    nameList.forEach(name => {
        expect(screen.getByText(name)).toBeInTheDocument()
    })


    const category = screen.getByRole('button', { name: /category/i })
    await user.click(category)

    const catList = [...new Set(testTransactions.map(entry => entry.category)
        .filter(item => item != undefined))]

    catList.forEach(cat => {
        expect(screen.getByText(cat)).toBeInTheDocument()
    })

})