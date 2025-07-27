import { render, screen, waitFor } from "@testing-library/react";
import { MockDatabaseProvider } from "@/context/MockDatabaseProvider";
import dayjs from "dayjs";
import IncomeExpensesPie from "./IncomeExpensesPie";

// mock supabase
jest.mock("@/lib/supabase", () => {
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn().mockResolvedValue({ data: [], error: null })
        }))
    }
})

// mock react-chartjs-2 Pie component
let chartProps: any = null;
jest.mock("react-chartjs-2", () => ({
    Pie: (props: any) => {
        chartProps = props;
        return <div data-testid="mock-bar-chart">Mock Pie Chart</div>
    },
}));

describe("MoneyInMoneyOut: Unit Testing", () => {
    const mockAccounts = [
        {
            account_no: "12345abcde",
            account_name: "Savings Account",
            bank_name: "DBS",
            balance: 100000,
            latest_recorded_date: "2025-05-30",
        },
        {
            account_no: "67890fghij",
            account_name: "Investment Account",
            bank_name: "SC",
            balance: 5000,
            latest_recorded_date: "2025-05-30",
        }
    ];

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
    ];

    // rendering and checking output for income in April
    it("renders bar chart with correct data for income in April", async () => {
        // render component
        render (
            <MockDatabaseProvider 
                accounts={mockAccounts}
                transactions={mockTransactions}
            >
                <IncomeExpensesPie 
                    date={dayjs("2025-04-01")}
                    category="income" 
                />
            </MockDatabaseProvider>
        );

        // wait for loading to finish
        await waitFor(() => 
            expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument()
        );

        // check if chart is rendered
        expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();

        // check chart props
        expect(chartProps.data.labels).toEqual(["Savings Account", "Investment Account"]);
        expect(chartProps.data.datasets[0].data).toEqual([6000, 3000]);

        // check chart legend
        const savingsSlice = screen.getByText("Savings Account").closest("div.flex.items-center.justify-between.text-sm");
        expect(savingsSlice).toHaveTextContent("Savings Account");
        expect(savingsSlice).toHaveTextContent("66.7 %");

        // check chart legend
        const investmentSlice = screen.getByText("Investment Account").closest("div.flex.items-center.justify-between.text-sm");
        expect(investmentSlice).toHaveTextContent("Investment Account");
        expect(investmentSlice).toHaveTextContent("33.3 %");
    });

    // rendering and checking output for expenses in June
    it("renders bar chart with correct data for expenses in June", async () => {
        // render component
        render (
            <MockDatabaseProvider 
                accounts={mockAccounts}
                transactions={mockTransactions}
            >
                <IncomeExpensesPie 
                    date={dayjs("2025-06-01")}
                    category="expenses" 
                />
            </MockDatabaseProvider>
        );

        // wait for loading to finish
        await waitFor(() => 
            expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument()
        );

        // check if chart is rendered
        expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();

        // check chart props
        expect(chartProps.data.labels).toEqual(["Savings Account", "Investment Account"]);
        expect(chartProps.data.datasets[0].data).toEqual([200, 1200]);

        // check chart legend
        const savingsSlice = screen.getByText("Savings Account").closest("div.flex.items-center.justify-between.text-sm");
        expect(savingsSlice).toHaveTextContent("Savings Account");
        expect(savingsSlice).toHaveTextContent("14.3 %");

        // check chart legend
        const investmentSlice = screen.getByText("Investment Account").closest("div.flex.items-center.justify-between.text-sm");
        expect(investmentSlice).toHaveTextContent("Investment Account");
        expect(investmentSlice).toHaveTextContent("85.7 %");
    });

    // rendering and checking output for income if no transactions
    it("renders bar chart with correct data for income if no transactions", async () => {
        // render component
        render (
            <MockDatabaseProvider 
                accounts={mockAccounts}
                transactions={mockTransactions}
            >
                <IncomeExpensesPie 
                    date={dayjs("2025-05-01")}
                    category="income" 
                />
            </MockDatabaseProvider>
        );

        // check placeholder text
        expect(screen.getByText("No transactions found for the selected date.")).toBeInTheDocument();
    });

    // rendering and checking output for expenses if no transactions
    it("renders bar chart with correct data for expenses if no transactions", async () => {
        // render component
        render (
            <MockDatabaseProvider 
                accounts={mockAccounts}
                transactions={mockTransactions}
            >
                <IncomeExpensesPie 
                    date={dayjs("2025-03-01")}
                    category="income" 
                />
            </MockDatabaseProvider>
        );

        // check placeholder text
        expect(screen.getByText("No transactions found for the selected date.")).toBeInTheDocument();
    });
})