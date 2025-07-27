import dayjs from "dayjs";
import { useDatabase } from "@/context/DatabaseContext";
import { render, screen, waitFor } from "@testing-library/react";
import SpendingTrend from "../../components/dashboard_components/dashboard_tabs/analytics_tab/AnalyticsSpendingTrend";


// mock react-chartjs-2 Line component
jest.mock("react-chartjs-2", () => ({
    Line: (props: any) => {
        return <div data-testid="mock-line-chart">Mock Line Chart</div>
    },
}));

describe("SpendingTrend: Unit Testing", () => {
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