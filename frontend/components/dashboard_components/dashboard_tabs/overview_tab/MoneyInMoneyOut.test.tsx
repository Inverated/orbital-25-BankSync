import MoneyInMoneyOut from "./MoneyInMoneyOut";
import { render, screen, waitFor } from "@testing-library/react";
import { MockDatabaseProvider } from "@/context/MockDatabaseProvider";

// mock supabase
jest.mock("@/lib/supabase", () => {
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn().mockResolvedValue({ data: [], error: null })
        }))
    }
})

// mock react-chartjs-2 Bar component
let chartProps: any = null;
jest.mock("react-chartjs-2", () => ({
    Bar: (props: any) => {
        chartProps = props;
        return <div data-testid="mock-bar-chart">Mock Bar Chart</div>
    },
}));

describe("MoneyInMoneyOut: Unit Testing", () => {
    const mockTransactions = [
        {
            transaction_date: "2025-04-08",
            transaction_description: "food",
            withdrawal_amount: 50,
            deposit_amount: 0,
            account_no: "12345abcde",
            category: "food",
            ending_balance: 88300,
        },
        {
            transaction_date: "2025-04-22",
            transaction_description: "shopping",
            withdrawal_amount: 100,
            deposit_amount: 0,
            account_no: "12345abcde",
            category: "shopping",
            ending_balance: 88200,
        },
        {
            transaction_date: "2025-04-30",
            transaction_description: "salary",
            withdrawal_amount: 0,
            deposit_amount: 6000,
            account_no: "12345abcde",
            category: "salary",
            ending_balance: 94200,
        },
        {
            transaction_date: "2025-06-10",
            transaction_description: "food",
            withdrawal_amount: 100,
            deposit_amount: 0,
            account_no: "12345abcde",
            category: "food",
            ending_balance: 94100,
        },
        {
            transaction_date: "2025-06-12",
            transaction_description: "shopping",
            withdrawal_amount: 100,
            deposit_amount: 0,
            account_no: "12345abcde",
            category: "shopping",
            ending_balance: 94000,
        },
        {
            transaction_date: "2025-06-30",
            transaction_description: "salary",
            withdrawal_amount: 0,
            deposit_amount: 6000,
            account_no: "12345abcde",
            category: "salary",
            ending_balance: 100000,
        },
        {
            transaction_date: "2025-04-01",
            transaction_description: "transfer",
            withdrawal_amount: 0,
            deposit_amount: 1000,
            account_no: "67890fghij",
            category: "transfer",
            ending_balance: 4700,
        },
        {
            transaction_date: "2025-04-01",
            transaction_description: "investment",
            withdrawal_amount: 1000,
            deposit_amount: 0,
            account_no: "67890fghij",
            category: "investment",
            ending_balance: 3700,
        },
        {
            transaction_date: "2025-04-30",
            transaction_description: "investment",
            withdrawal_amount: 0,
            deposit_amount: 2000,
            account_no: "67890fghij",
            category: "investment",
            ending_balance: 5700,
        },
        {
            transaction_date: "2025-06-01",
            transaction_description: "transfer",
            withdrawal_amount: 1000,
            deposit_amount: 0,
            account_no: "67890fghij",
            category: "transfer",
            ending_balance: 4700,
        },
        {
            transaction_date: "2025-06-01",
            transaction_description: "investment",
            withdrawal_amount: 200,
            deposit_amount: 0,
            account_no: "67890fghij",
            category: "investment",
            ending_balance: 4500,
        },
        {
            transaction_date: "2025-06-30",
            transaction_description: "investment",
            withdrawal_amount: 0,
            deposit_amount: 500,
            account_no: "67890fghij",
            category: "investment",
            ending_balance: 5000,
        }
    ]

    // rendering and checking output for savings account
    it("renders bar chart with correct data for savings account", async () => {
        // render component
        render (
            <MockDatabaseProvider transactions={mockTransactions}>
                <MoneyInMoneyOut account_no="12345abcde" />
            </MockDatabaseProvider>
        );

        // wait for loading to finish
        await waitFor(() => 
            expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument()
        );

        // check if chart is rendered
        expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();

        // check chart props
        expect(chartProps.data.labels).toEqual(["Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25"]);
        expect(chartProps.data.datasets[0].data).toEqual([0, 0, 6000, 0, 6000, 0]);
        expect(chartProps.data.datasets[1].data).toEqual([0, 0, 150, 0, 200, 0]);
    })

    // rendering and checcking output for investment account
    it("renders bar chart with correct data for investment account", async () => {
        // render component
        render (
            <MockDatabaseProvider transactions={mockTransactions}>
                <MoneyInMoneyOut account_no="67890fghij" />
            </MockDatabaseProvider>
        );

        // wait for loading to finish
        await waitFor(() => 
            expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument()
        );

        // check if chart is rendered
        expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();

        // check chart props
        expect(chartProps.data.labels).toEqual(["Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25"]);
        expect(chartProps.data.datasets[0].data).toEqual([0, 0, 3000, 0, 500, 0]);
        expect(chartProps.data.datasets[1].data).toEqual([0, 0, 1000, 0, 1200, 0]);
    })
})