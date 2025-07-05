import { useDatabase } from "@/context/DatabaseContext";
import { getTransactionDetails } from "@/lib/databaseQuery";
import { Dayjs } from "dayjs";
import { PieChart } from "lucide-react";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

interface SpendingCategoryProps {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
}

interface CategorySpending {
    category: string;
    spending: number;
}

export default function SpendingCategory({ startDate, endDate }: SpendingCategoryProps) {
    const showChart = startDate && endDate && !startDate.isAfter(endDate);

    const [loading, setLoading] = useState(true);

    const [dataPoints, setDataPoints] = useState<CategorySpending[]>([]);

    const { transactions } = useDatabase()

    useEffect(() => {
        if (startDate && endDate && !startDate.isAfter(endDate)) {
            const fetchData = async () => {
                setLoading(true);

                const map = new Map<string, number>();

                const transactionCatergoryList = getTransactionDetails({
                    transactions: transactions,
                    date: { startDate: startDate, endDate: endDate }
                });

                transactionCatergoryList
                    .filter(entry => entry.withdrawal_amount != 0.0)
                    .forEach(entry =>
                        map.set(entry.category, (map.get(entry.category) || 0) + entry.withdrawal_amount)
                    );

                const data: CategorySpending[] = Array.from(map.entries())
                    .map(([category, spending]) => ({ category, spending }));

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

    const generateSliceColors = (index: number, total: number) => {
        const hue = (index * (360 / total)) % 360;
        return `hsl(${hue}, 70%, 80%)`;
    }

    const chartData = {
        labels: dataPoints.map(d => d.category),
        datasets: [
            {
                label: "Spending",
                data: dataPoints.map(d => d.spending),
                borderColor: "rgb(255, 255, 255)",
                backgroundColor: dataPoints.map((_, index) => generateSliceColors(index, dataPoints.length)),
                hoverOffset: 4,
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
    }

    const generateChartLegend = () => {
        const dataset = chartData.datasets[0];
        const values = dataset.data as number[];
        const total = values.reduce((sum, value) => sum + value, 0);

        return chartData.labels!.map((label, index) => {
            const value = values[index];
            const percentage = total ? ((value / total) * 100).toFixed(1) : "0.0";
            const color = (dataset.backgroundColor as string[])[index];

            return (
                <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }} />

                        <span className="text-md">{label}</span>
                    </div>

                    <span>{percentage} %</span>
                </div>
            );
        });
    }

    return (
        <div className="border border-black p-3 rounded-lg flex-1 flex flex-col gap-3">
            <h1 className="font-bold text-xl">Spending by Category</h1>

            <div className="flex flex-col justify-center items-center gap-2 h-full w-full">
                {showChart ? (
                    loading ? (
                        <div className="text-gray-400 h-[500px] flex flex-col justify-center items-center">
                            Loading data...
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-4 h-full w-full">
                            <div className="flex flex-col justify-center items-center h-3/4 max-h-md w-5/8">
                                <Pie data={chartData} options={chartOptions} />
                            </div>

                            <div className="flex flex-col gap-1 w-full max-w-lg">
                                {generateChartLegend()}
                            </div>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col justify-center items-center gap-2 h-[500px]">
                        <PieChart className="h-12 w-12" />
                        <p className="text-sm text-gray-400">Category Breakdown Chart</p>
                    </div>
                )}
            </div>
        </div>
    )
}