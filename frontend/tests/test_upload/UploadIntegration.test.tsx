import UploadButton from '@/components/dashboard_components/upload_util/UploadButton';
import { Account, StatementResponse, Transaction } from '@/utils/types';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

jest.mock("@/utils/setStatementCategory", () => ({
    // Disable setting category to test category set in mock transaction details
    __esModule: true,
    default: jest.fn()
}))

jest.mock("@/lib/supabaseUpload", () => ({
    addStatements: jest.fn()
}))


const mockReturnData: StatementResponse = {
    hasData: true,
    account: testAccounts[0],
    transactions: testTransactions
}

jest.mock("@/utils/uploadFile", () => ({
    uploadNewFile: jest.fn(async () => ({
        data: {
            data: [mockReturnData],
            filename: 'Name',
            content_type: 'Test',
            success: true,
            error: null
        },
        status: 200,
        error: null,

    }))
}))

test('uplading of new files and its preview', async () => {
    render(<UploadButton />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))

    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    expect(screen.getByTestId('dropFile')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument()

    const uploadArea = screen.getByTestId('dropFile')
    const browseFile = screen.getByRole('button', { name: /browse/i })

    await user.upload(uploadArea, file)
    await user.click(browseFile)

    expect(screen.getAllByRole('checkbox').length).toEqual(2)
    const checkDuplicate = screen.getAllByRole('checkbox')[0]   //default checked
    const showDuplicate = screen.getAllByRole('checkbox')[1]    //default checked

    expect(screen.getAllByText(testAccounts[0].account_name).length).toEqual(2) //Tab header and detail display
    expect(screen.getByText(testAccounts[0].bank_name))
    expect(screen.getByText(testAccounts[0].account_no))

    // Default test values already in file
    testTransactions.forEach(transaction => {
        // Check if flagged as duplicate
        expect(screen.getAllByText(transaction.category)[0].parentElement?.parentElement?.classList.toString()).toContain("bg-red")
        expect(screen.getAllByText(transaction.category))
        expect(screen.getAllByText(transaction.transaction_description))
        expect(screen.getAllByText(RegExp(transaction.deposit_amount.toString() + '.00')))
        expect(screen.getAllByText(RegExp(transaction.withdrawal_amount.toString() + '.00')))
        expect(screen.getAllByText(RegExp(transaction.ending_balance.toString() + '.00')))
    })

    await user.click(showDuplicate)
    testTransactions.forEach(transaction => {
        expect(screen.queryAllByText(transaction.category).length).toEqual(0)
        expect(screen.queryAllByText(transaction.transaction_description).length).toEqual(0)
    })

    await user.click(showDuplicate)
    await user.click(checkDuplicate)
    testTransactions.forEach(transaction => {
        expect(screen.getAllByText(transaction.category)[0].parentElement?.parentElement?.classList.toString()).not.toContain("bg-red")
        expect(screen.getAllByText(transaction.transaction_description))
    })

    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()

    const upload = screen.getByRole('button', { name: /upload/i })
    const close = screen.getByRole('button', { name: /close/i })

    await user.click(upload)
    await waitFor(() => {
        expect(screen.getByText(/file uploaded/i)).toBeInTheDocument()
    });

    await user.click(close)
    expect(browseFile).not.toBeInTheDocument()
})