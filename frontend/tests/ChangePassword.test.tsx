import Password from '@/components/settings_components/Password';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('changing password', async () => {
    render(<Password />)

    expect(screen.getByPlaceholderText(/enter new/i))
    expect(screen.getByPlaceholderText(/confirm new/i))
    expect(screen.getByRole('button')).toBeInTheDocument()

    const newPassword = screen.getByPlaceholderText(/enter new/i)
    const confirmPassword = screen.getByPlaceholderText(/confirm new/i)
    const updatePassword = screen.getByRole('button')

    const user = userEvent.setup()

    const clearInputs = () => {
        user.clear(confirmPassword)
        user.clear(newPassword)
    }

    await user.click(updatePassword)
    expect(screen.getByText(/at least 6/i))

    await user.type(newPassword, '123')
    await user.type(confirmPassword, '1')
    expect(screen.getByText(/not match/i))
    clearInputs()

    await user.type(newPassword, '123456')
    await user.type(confirmPassword, '123456')
    await user.click(updatePassword)
    expect(screen.getByText(/1 lowercase/i))
    clearInputs()

    await user.type(newPassword, 'asdasd')
    await user.type(confirmPassword, 'asdasd')
    await user.click(updatePassword)
    expect(screen.getByText(/1 upper/i))
    clearInputs()

    await user.type(newPassword, 'Asdasd')
    await user.type(confirmPassword, 'Asdasd')
    await user.click(updatePassword)
    expect(screen.getByText(/1 digit/i))
    clearInputs()

    await user.type(newPassword, 'Password123')
    await user.type(confirmPassword, 'Password123')
    await user.click(updatePassword)
    expect(screen.getByText(/1 special/i))
    clearInputs()

    await user.type(newPassword, 'P@ssword123')
    await user.type(confirmPassword, 'P@ssword123')
    await user.click(updatePassword)
    expect(screen.getByText(/success/i))
})
