import UploadButton from '@/components/dashboard_components/upload_util/UploadButton';
import { testAccounts, testTransactions } from '@/jest.setup';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock("@/utils/setStatementCategory", () => ({
    // Disable setting category to test category set in mock transaction details
    __esModule: true,
    default: jest.fn()
}))

jest.mock("@/lib/supabaseUpload", () => ({
    addStatements: jest.fn()
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