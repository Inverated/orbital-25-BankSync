import AccountSecurity from '@/components/settings_components/AccountSecurity';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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