import ConnectedAccount from '@/components/settings_components/ConnectedAccount';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('display individual transaction row', async () => {
    render(<ConnectedAccount />)

    await waitFor(() => {
        expect(screen.getByText(/connected/i)).toBeInTheDocument();
    });

})