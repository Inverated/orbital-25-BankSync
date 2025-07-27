import dayjs from "dayjs";
import { render, screen, waitFor } from "@testing-library/react";
import { MockDatabaseProvider } from "@/context/MockDatabaseProvider";
import IncomeExpenses from "@/components/dashboard_components/dashboard_tabs/analytics_tab/AnalyticsIncomeVsExpenses";

// mock supabase
jest.mock("@/lib/supabase", () => {
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn().mockResolvedValue({ data: [], error: null })
        }))
    }
})

// mock react-chartjs-2 Line component
let chartProps: any = null;
jest.mock("react-chartjs-2", () => ({
    Line: (props: any) => {
        chartProps = props;
        return <div data-testid="mock-line-chart">Mock Line Chart</div>
    },
}));

describe("IncomeExpenses: Integration Testing", () => {
    const mockTransactions = [
        {
            transaction_date: "2024-05-01",
            transaction_description: "interest",
            withdrawal_amount: 0,
            deposit_amount: 0.5,
            account_no: "12345",
            category: "interest",
            ending_balance: 0.5,
        },
        {
            transaction_date: "2024-05-31",
            transaction_description: "food",
            withdrawal_amount: 0.1,
            deposit_amount: 0,
            account_no: "12345",
            category: "food",
            ending_balance: 0.4,
        },
        {
            transaction_date: "2024-06-01",
            transaction_description: "salary",
            withdrawal_amount: 0,
            deposit_amount: 1000,
            account_no: "12345",
            category: "salary",
            ending_balance: 1000.4,
        },
        {
            transaction_date: "2024-06-10",
            transaction_description: "transfer",
            withdrawal_amount: 0,
            deposit_amount: 500,
            account_no: "12345",
            category: "transfer",
            ending_balance: 1500.4,
        },
        {
            transaction_date: "2024-06-11",
            transaction_description: "food",
            withdrawal_amount: 200,
            deposit_amount: 0,
            account_no: "12345",
            category: "food",
            ending_balance: 1300.4,
        },
        {
            transaction_date: "2024-06-30",
            transaction_description: "shopping",
            withdrawal_amount: 100,
            deposit_amount: 0,
            account_no: "12345",
            category: "shopping",
            ending_balance: 1200.4,
        },
        {
            transaction_date: "2024-07-08",
            transaction_description: "investment",
            withdrawal_amount: 10000,
            deposit_amount: 0,
            account_no: "12345",
            category: "investment",
            ending_balance: 200.4,
        }
    ]

    // rendering and checking output for valid date range
    it("renders income, expenses, and net savings", async () => {        
        // render component with valid date range
        render (
            <MockDatabaseProvider transactions={mockTransactions}>
                <IncomeExpenses
                    startDate={dayjs("2024-05-01")}
                    endDate={dayjs("2024-06-30")}
                />
            </MockDatabaseProvider>
        );

        // wait for loading to finish
        await waitFor(() => 
            expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument()
        );

        // check if chart is rendered
        expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();

        // check chart props
        expect(chartProps.data.labels).toEqual(["May 24", "Jun 24"]);
        await waitFor(() => {
            expect(chartProps.data.datasets[0].data).toEqual([0.5, 1500]);
        });
        expect(chartProps.data.datasets[1].data).toEqual([0.1, 300]);

        // check income
        const incomeSection = screen.getByText("Income").closest("div");
        expect(incomeSection).toHaveTextContent("Income");
        expect(incomeSection).toHaveTextContent("$1500.50");
        
        // check expenses
        const expensesSection = screen.getByText("Expenses").closest("div");
        expect(expensesSection).toHaveTextContent("Expenses");
        expect(expensesSection).toHaveTextContent("$300.10");
        
        // check net savings
        const netSavingsSection = screen.getByText("Net Savings").closest("div");
        expect(netSavingsSection).toHaveTextContent("Net Savings");
        expect(netSavingsSection).toHaveTextContent("+$1200.40");
    });

    // rendering and checking output for valid date range
    it("renders income, expenses, and net savings", async () => {        
        // render component with valid date range
        render (
            <MockDatabaseProvider transactions={mockTransactions}>
                <IncomeExpenses
                    startDate={dayjs("2024-05-01")}
                    endDate={dayjs("2024-07-31")}
                />
            </MockDatabaseProvider>
        );

        // wait for loading to finish
        await waitFor(() => 
            expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument()
        );

        // check if chart is rendered
        expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();

        // check chart props
        expect(chartProps.data.labels).toEqual(["May 24", "Jun 24", "Jul 24"]);
        await waitFor(() => {
            expect(chartProps.data.datasets[0].data).toEqual([0.5, 1500, 0]);
        });
        expect(chartProps.data.datasets[1].data).toEqual([0.1, 300, 10000]);

        // check income
        const incomeSection = screen.getByText("Income").closest("div");
        expect(incomeSection).toHaveTextContent("Income");
        expect(incomeSection).toHaveTextContent("$1500.50");
        
        // check expenses
        const expensesSection = screen.getByText("Expenses").closest("div");
        expect(expensesSection).toHaveTextContent("Expenses");
        expect(expensesSection).toHaveTextContent("$10300.10");
        
        // check net savings
        const netSavingsSection = screen.getByText("Net Savings").closest("div");
        expect(netSavingsSection).toHaveTextContent("Net Savings");
        expect(netSavingsSection).toHaveTextContent("-$8799.60");
    });

    // rendering and checking output for invalid date range
    it("renders placeholder", async () => {
        // render component with invalid date range
        render (
            <MockDatabaseProvider transactions={mockTransactions}>
                <IncomeExpenses
                    startDate={dayjs("2024-06-01")}
                    endDate={dayjs("2024-05-01")}
                />
            </MockDatabaseProvider>
        );
        
        // check placeholder text
        expect(screen.getByText("Income vs. Expenses Chart")).toBeInTheDocument();
    })
})