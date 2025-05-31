import Analytics_DatePicker from "./DatePicker";
import { AiOutlineLineChart, AiOutlinePieChart  } from "react-icons/ai";
import SpendingTrend from "./AnalyticsSpendingTrend";
import SpendingCategory from "./AnalyticsSpendingCategory";
import IncomeExpenses from "./AnalyticsIncomeVsExpenses";

export default function Analytics() {
    return(
        <div className="flex flex-col">
            <div className="flex flex-row items-center self-start border border-black p-5 m-5 rounded-lg gap-2">
                <p>Date: </p>
                <Analytics_DatePicker label="Start Date" />
                <p>to</p>
                <Analytics_DatePicker label="End Date" />
            </div>

            <SpendingTrend />
            
            <div className="flex flex-row justify-center mx-5 my-5 gap-5">
                <SpendingCategory />
                <IncomeExpenses />
            </div>
        </div>
    )
}