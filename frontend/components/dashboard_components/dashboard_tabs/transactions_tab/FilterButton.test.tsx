import { render, screen } from '@testing-library/react';
import FilterButton from './FilterButton';
import { Dayjs } from 'dayjs';
import userEvent from '@testing-library/user-event';
import { testAccounts, testTransactions } from '@/jest.setup';

const uniqueCat: string[] = ['cat1', 'cat2', 'cat3']

const handleFilterQuery = ((accountSelection: string[], categorySelection: string[], ascendingSelection: boolean,
    date: { startDate: Dayjs | null, endDate: Dayjs | null } | null) => { })

test('display individual transaction row', async () => {
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