import dayjs from "dayjs";
import IncomeExpenses from "./AnalyticsIncomeVsExpenses";
import { useDatabase } from "@/context/DatabaseContext";
import * as databaseQuery from "@/lib/databaseQuery";
import { render, screen, waitFor } from "@testing-library/react";

// mock useDatabase context
jest.mock("@/context/DatabaseContext", () => ({
    useDatabase: jest.fn(),
}));

// mock getTransactionDetails
jest.spyOn(databaseQuery, "getTransactionDetails").mockImplementation(({ transactions, date }) => {
    return transactions.filter(transaction => {
        const transactionDate = dayjs(transaction.transaction_date);

        if (date && date.startDate && date.endDate) {
            return (transactionDate >= date.startDate && transactionDate <= date.endDate);
        } else {
            return true;
        }
    })
})

// mock react-chartjs-2 Line component
jest.mock("react-chartjs-2", () => ({
    Line: (props: any) => {
        return <div data-testid="mock-line-chart">Mock Line Chart</div>
    },
}));

describe("IncomeExpenses", () => {
    beforeEach(() => {
        // provide mock transactions to the context
        (useDatabase as jest.Mock).mockReturnValue({
            transactions: [
                {
                    transaction_date: "2024-06-01",
                    transaction_description: "salary",
                    withdrawal_amount: 0,
                    deposit_amount: 1000,
                    account_no: "12345",
                    category: "salary",
                    ending_balance: 1000,
                },
                {
                    transaction_date: "2024-06-10",
                    transaction_description: "transfer",
                    withdrawal_amount: 0,
                    deposit_amount: 500,
                    account_no: "12345",
                    category: "transfer",
                    ending_balance: 1500,
                },
                {
                    transaction_date: "2024-06-11",
                    transaction_description: "food",
                    withdrawal_amount: 200,
                    deposit_amount: 0,
                    account_no: "12345",
                    category: "food",
                    ending_balance: 1300,
                },
                {
                    transaction_date: "2024-06-30",
                    transaction_description: "food",
                    withdrawal_amount: 100,
                    deposit_amount: 0,
                    account_no: "12345",
                    category: "food",
                    ending_balance: 1200,
                },
            ]
        })
    });

    // rendering and checking output if valid date range
    it("renders income, expenses, and net savings", async () => {
        // render component with valid date range
        render(
            <IncomeExpenses
                startDate={dayjs("2024-06-01")}
                endDate={dayjs("2024-06-30")}
            />
        );

        const mockTransactions = (useDatabase as jest.Mock).mock.results[0].value.transactions;

        const result = databaseQuery.getTransactionDetails({
            transactions: mockTransactions,
            date: {
                startDate: dayjs("2024-06-01"),
                endDate: dayjs("2024-06-30")
            }
        })

        // screen.debug();

        // wait for loading to finish
        await waitFor(() =>
            expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument()
        );

        // check if chart is rendered
        expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();

        // check income
        expect(screen.getByText((content) => content.includes("$1500.00"))).toBeInTheDocument();

        // check expenses
        expect(screen.getByText((content) => content.includes("$300.00"))).toBeInTheDocument();

        // check net savings
        expect(screen.getByText((content) => content.includes("$1200.00"))).toBeInTheDocument();
    });

    // rendering and checking output if invalid date range
    it("renders placeholder", async () => {
        // render component with invalid date range
        render(
            <IncomeExpenses
                startDate={dayjs("2024-06-01")}
                endDate={dayjs("2024-05-01")}
            />
        );

        expect(screen.getByText("Income vs. Expenses Chart")).toBeInTheDocument();
    })
})