import { render, screen } from '@testing-library/react';
import ExportButton from "../components/dashboard_components/dashboard_tabs/transactions_tab/ExportButton";
import userEvent from "@testing-library/user-event";

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

    //dummy data present
    expect(screen.getByText(/account 1/i)).toBeInTheDocument()
    expect(screen.getByText(/account 2/i)).toBeInTheDocument()
    expect(screen.getByText(/12345/i)).toBeInTheDocument()

    const filterCheckbox = screen.getByRole('checkbox')
    await user.click(filterCheckbox)

    //filtered data empty
    expect(screen.queryByText(/account 1/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/account 2/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/12345/i)).not.toBeInTheDocument()

    //close dialogue
    const close = screen.getByRole('button', { name: 'Close' })
    await user.click(close)

    expect(screen.queryByRole('button', { name: 'Export' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()
})