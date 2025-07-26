import dayjs from "dayjs";
import IncomeExpenses from "./AnalyticsIncomeVsExpenses";
import { render, screen, waitFor } from "@testing-library/react";
import { testTransactions } from "@/jest.setup";

// mock react-chartjs-2 Line component
jest.mock("react-chartjs-2", () => ({
    Line: (props: any) => {
        return <div data-testid="mock-line-chart">Mock Line Chart</div>
    },
}));

describe("IncomeExpenses", () => {
    // rendering and checking output if valid date range
    it("renders income, expenses, and net savings", async () => {        
        // render component with valid date range
        render (
            <IncomeExpenses
                startDate={dayjs("2024-06-01")}
                endDate={dayjs("2024-06-30")}
            />
        );
        // screen.debug();

        // wait for loading to finish
        await waitFor(() => 
            expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument()
        );
        console.log(testTransactions)
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
        render (
            <IncomeExpenses
                startDate={dayjs("2024-06-01")}
                endDate={dayjs("2024-05-01")}
            />
        );

        expect(screen.getByText("Income vs. Expenses Chart")).toBeInTheDocument();
    })
})