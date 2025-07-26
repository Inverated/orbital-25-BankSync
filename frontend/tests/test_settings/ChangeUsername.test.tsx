import UserName from '@/components/settings_components/Username';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('changing username', async () => {
    render(<UserName />)

    expect(screen.getByPlaceholderText(/enter new/i))
    expect(screen.getByRole('button')).toBeInTheDocument()

    const newName = screen.getByPlaceholderText(/enter new/i)
    const updateName = screen.getByRole('button')

    expect(screen.getByText(/current:/i)).toBeInTheDocument()
    const curr = screen.getByText(/current:/i).innerHTML

    const userName = curr.slice(curr.indexOf(':') + 2, curr.length)

    const user = userEvent.setup()

    user.clear(newName)

    await user.click(updateName)
    expect(screen.getByText(/empty/i)).toBeInTheDocument()

    await user.type(newName, userName)
    await user.click(updateName)
    expect(screen.getByText(/different/i)).toBeInTheDocument()

    await user.type(newName, '2')
    await user.click(updateName)
    expect(screen.getByText(/successful/i)).toBeInTheDocument()
})
