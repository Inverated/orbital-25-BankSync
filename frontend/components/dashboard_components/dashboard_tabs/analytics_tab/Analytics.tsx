import { useState } from "react";
import AnalyticsDatePicker from "./AnalyticsDatePicker";
import IncomeExpenses from "./AnalyticsIncomeVsExpenses";
import SpendingCategory from "./AnalyticsSpendingCategory";
import SpendingTrend from "./AnalyticsSpendingTrend";
import { Dayjs } from "dayjs";
import { Ban } from "lucide-react";

export default function Analytics() {
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

    const bothNull = !startDate && !endDate;
    const invalidDate = 
        (!startDate && endDate) || 
        (startDate && !endDate) || 
        (startDate && endDate && startDate.isAfter(endDate));

    return(
        <div className="flex flex-col">
            <div className="border border-black p-3 m-5 rounded-lg">
                {bothNull && (
                    <div className="text-gray-500 mt-1 ml-2 font-medium">
                        Select a date range:
                    </div>
                )}

                <div className="flex flex-row items-center p-2 gap-2">
                    <AnalyticsDatePicker 
                        label="Start Date"
                        value={startDate}
                        onChange={setStartDate} 
                    />

                    <p>to</p>

                    <AnalyticsDatePicker 
                        label="End Date" 
                        value={endDate}
                        onChange={setEndDate}
                    />
                </div>
                
                {invalidDate && (
                    <div className="flex flex-row items-center gap-2 text-red-400 mt-1 ml-2">
                        <Ban className="w-5 h-5"/>
                        <p className="font-medium">Invalid date</p>
                    </div>
                )}
            </div>

            <SpendingTrend />
            
            <div className="flex flex-row justify-center m-5 m-5 gap-5">
                <SpendingCategory />
                <IncomeExpenses />
            </div>
        </div>
    )
}