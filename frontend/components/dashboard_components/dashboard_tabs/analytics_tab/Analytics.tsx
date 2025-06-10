import AnalyticsDatePicker from "./AnalyticsDatePicker";
import IncomeExpenses from "./AnalyticsIncomeVsExpenses";
import SpendingCategory from "./AnalyticsSpendingCategory";
import SpendingTrend from "./AnalyticsSpendingTrend";

export default function Analytics() {
    return(
        <div className="flex flex-col">
            <div className="border border-black p-3 m-5 rounded-lg">
                <p>Select a date range to analyse your financial data:</p>
                <div className="flex flex-row items-center p-2 gap-2">
                    <AnalyticsDatePicker label="Start Date" />
                    <p>to</p>
                    <AnalyticsDatePicker label="End Date" />
                </div>
            </div>

            <SpendingTrend />
            
            <div className="flex flex-row justify-center m-5 m-5 gap-5">
                <SpendingCategory />
                <IncomeExpenses />
            </div>
        </div>
    )
}