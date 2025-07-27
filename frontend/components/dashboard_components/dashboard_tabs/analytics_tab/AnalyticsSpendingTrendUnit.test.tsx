import dayjs from "dayjs";
import { useDatabase } from "@/context/DatabaseContext";
import * as databaseQuery from "@/lib/databaseQuery";
import { render, screen, waitFor } from "@testing-library/react";
import SpendingTrend from "./AnalyticsSpendingTrend";

// mock useDatabase context
jest.mock("@/context/DatabaseContext", () => ({
    useDatabase: jest.fn(),
}));

// mock getTransactionDetails
jest.spyOn(databaseQuery, "getTransactionDetails").mockImplementation(({ transactions, date}) => {
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

describe("SpendingTrend: Unit Testing", () => {
    beforeEach(() => {
        // provide mock transactions to the context
        (useDatabase as jest.Mock).mockReturnValue({
            transactions: [
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
                    withdrawal_amount: 1000,
                    deposit_amount: 0,
                    account_no: "12345",
                    category: "investment",
                    ending_balance: 200.4,
                }
            ]
        })
    });

    // rendering and checking output for valid date range
    it("renders income, expenses, and net savings", async () => {        
        // render component with valid date range
        render (
            <SpendingTrend
                startDate={dayjs("2024-05-01")}
                endDate={dayjs("2024-06-30")}
            />
        );

        // wait for loading to finish
        await waitFor(() => 
            expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument()
        );

        // check date range indication
        expect(screen.getByText((content) => content.includes("Spending pattern from May 2024 to June 2024"))).toBeInTheDocument();

        // check if chart is rendered
        expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
    });

    // rendering and checking output for invalid date range
    it("renders placeholder", async () => {
        // render component with invalid date range
        render (
            <SpendingTrend
                startDate={dayjs("2024-06-01")}
                endDate={dayjs("2024-05-01")}
            />
        );

        // check placeholder text
        expect(screen.getByText("Spending Chart")).toBeInTheDocument();

        // check date range indication
        expect(screen.getByText((content) => content.includes("Spending pattern from June 2024 to May 2024"))).toBeInTheDocument()
    })
})