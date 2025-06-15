import { useState } from "react";
import AnalyticsDatePicker from "./AnalyticsDatePicker";
import IncomeExpenses from "./AnalyticsIncomeVsExpenses";
import SpendingCategory from "./AnalyticsSpendingCategory";
import SpendingTrend from "./AnalyticsSpendingTrend";
import { Dayjs } from "dayjs";
import { Ban, MousePointer2 } from "lucide-react";
import { Alert } from "@mui/material";

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

                {bothNull && (
                    <Alert
                        sx={{ 
                            position: "static",
                            alignItems: "center",
                            display: "flex",
                        }}
                        severity="info"
                        icon={<MousePointer2 />}
                        className="mt-2"
                    >
                        Please select a date range.
                    </Alert>
                )}
                
                {invalidDate && (
                    <Alert
                        sx={{ 
                            position: "static",
                            alignItems: "center",
                            display: "flex",
                        }}
                        severity="error"
                        icon={<Ban className="w-8 h-8"/>}
                        className="mt-2"
                    >
                        <div className="font-bold">Invalid date</div>
                        <div className="text-sm">Select a valid date range to see your anlaysis.</div>
                    </Alert>
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