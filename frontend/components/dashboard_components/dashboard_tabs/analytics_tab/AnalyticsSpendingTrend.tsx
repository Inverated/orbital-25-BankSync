import { useDatabase } from "@/context/DatabaseContext";
import { useTransactionDetails } from "@/lib/databaseQuery";
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

    const { transactions } = useDatabase()

    useEffect(() => {
        if (startDate && endDate && !startDate.isAfter(endDate)) {
            const months = getMonths(startDate, endDate);

            const fetchData = async () => {
                setLoading(true);

                const map = new Map<string, number>(
                    months.map(key => [key.format('MMM YY'), 0.0])
                );

                const depositAndTransactions = useTransactionDetails({
                    transactions: transactions,
                    date: { startDate: startDate, endDate: endDate }
                });

                depositAndTransactions.forEach(entry => months.forEach(month => {
                    const start = month.startOf("month").toISOString();
                    const end = month.endOf("month").toISOString();
                    const curr = month.format("MMM YY");

                    if (entry.transaction_date >= start && entry.transaction_date <= end) {
                        map.set(curr, (map.get(curr) || 0) + entry.withdrawal_amount)
                        return
                    }
                }));

                const data: MonthlySpending[] = Array.from(map.entries())
                    .map(([date, spending]) => ({ date, spending }));

                setDataPoints(data);

                setLoading(false);
            };

            fetchData();
        } else {
            setLoading(true);

            setDataPoints([]);

            setLoading(false);
        }
    }, [startDate, endDate, transactions])

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

            <div className="flex flex-col h-[500px] justify-center items-center gap-2">
                {showChart ? (
                    loading ? (
                        <div className="text-gray-400 flex flex-col justify-center items-center">
                            Loading data...
                        </div>
                    ) : (
                        <Line data={chartData} options={chartOptions} />
                    )
                ) : (
                    <div className="flex flex-col justify-center items-center gap-2">
                        <LineChart className="h-12 w-12" />
                        <p className="text-sm text-gray-400">Spending Chart</p>
                    </div>
                )}
            </div>
        </div>
    )
}