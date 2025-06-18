import { getSpendingByDate } from "@/lib/supabase_query";
import { Dayjs } from "dayjs";
import { LineChart } from "lucide-react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

interface SpendingTrendProps {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
}

interface MonthlySpending {
    date: string;
    spending: number;
}

export default function SpendingTrend({ startDate, endDate }: SpendingTrendProps) {
    const formatDate = (date: Dayjs | null) => date ? date.format("MMMM YYYY") : "___";

    const getMonths = (start: Dayjs | null, end: Dayjs | null) => {
        if (!start || !end || start.isAfter(end)) {
            return [];
        }

        const months = [];

        let current = start.startOf("month");
        const last = end.startOf("month");

        while (!current.isAfter(last)) {
            months.push(current);
            current = current.add(1, "month");
        }

        return months;
    }
    
    const showChart = startDate && endDate && !startDate.isAfter(endDate);

    const [loading, setLoading] = useState(true);

    const [dataPoints, setDataPoints] = useState<MonthlySpending[]>([]);

    useEffect(() => {
        if (startDate && endDate && !startDate.isAfter(endDate)) {
            const months = getMonths(startDate, endDate);

            const fetchData = async () => {
                setLoading(true);

                const data = await Promise.all(
                    months.map(async (month) => {
                        const transactions = await getSpendingByDate(month);
                        const spending = transactions
                            .reduce((sum, transaction) => sum + (Number(transaction.withdrawal_amount) || 0), 0);
                        
                        return {
                            date: month.format("MMM YY"),
                            spending
                        };
                    })
                );

                setDataPoints(data);
                setLoading(false);
            };

            fetchData();
        }
    }, [startDate, endDate])

    const chartData = {
        labels: dataPoints.map(d => d.date),
        datasets: [
            {
                label: "Total Spending",
                data: dataPoints.map(d => d.spending),
                borderColor: "rgb(76, 214, 191)",
                backgroundColor: "rgb(76, 214, 191)",
                fill: false,
            }
        ],
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "right" as const,
            },
        },
    }

    return (
        <div className="flex flex-col border border-black p-3 mx-5 rounded-lg gap-2">
            <h1 className="font-bold text-xl">Spending Trends</h1>
            
            <h2>Spending pattern from {formatDate(startDate)} to {formatDate(endDate)}</h2>
            
            <div className="flex flex-col h-[300px] justify-center items-center gap-2">
                {showChart ? (
                    loading ? (
                        <p className="text-gray-400">Loading data...</p>
                    ) : (
                        <Line data={chartData} options={chartOptions} />
                    )  
                ) : (
                    <>
                        <LineChart className="h-12 w-12" />
                        <p className="text-sm text-gray-400">Spending Chart</p>
                    </>
                )}
            </div>
        </div>
    )
}