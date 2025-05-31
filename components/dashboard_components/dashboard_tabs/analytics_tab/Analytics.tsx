import AnalyticsDatePicker from "./AnalyticsDatePicker";
import IncomeExpenses from "./AnalyticsIncomeVsExpenses";
import SpendingCategory from "./AnalyticsSpendingCategory";
import SpendingTrend from "./AnalyticsSpendingTrend";


export default function Analytics() {
    return(
        <div className="flex flex-col">
            <div className="flex flex-row items-center self-start border border-black p-5 m-5 rounded-lg gap-2">
                <p>Date: </p>
                <AnalyticsDatePicker label="Start Date" />
                <p>to</p>
                <AnalyticsDatePicker label="End Date" />
            </div>

            <SpendingTrend />
            
            <div className="flex flex-row justify-center mx-5 my-5 gap-5">
                <SpendingCategory />
                <IncomeExpenses />
            </div>
        </div>
    )
}