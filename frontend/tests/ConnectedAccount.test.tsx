import ConnectedAccount from '@/components/settings_components/ConnectedAccount';
import { render, screen, waitFor } from '@testing-library/react';

test('detection of connected accounts in user metadata provider', async () => {
    render(<ConnectedAccount />)

    await waitFor(() => {
        expect(screen.getByText(/is connected/i)).toBeInTheDocument();
    });

    // Default provider set "google"
    expect(screen.getByText(/google is connected/i)).toBeInTheDocument()
    expect(screen.getByText(/sign in with github/i)).toBeInTheDocument()

})