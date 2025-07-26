import { useEffect, useState } from "react";
import { LineChart } from "lucide-react";
import { Dayjs } from "dayjs";
import { Line } from "react-chartjs-2";
import { getTransactionDetails } from "@/lib/databaseQuery";
import { useDatabase } from "@/context/DatabaseContext";

interface IncomeExpensesProps {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
}

interface MonthlyIncomeAndExpenses {
    date: string;
    income: number;
    expenses: number;
}

export default function IncomeExpenses({ startDate, endDate }: IncomeExpensesProps) {
    const [totalIncome, setTotalIncome] = useState(0.0);
    const [totalExpenses, setTotalExpenses] = useState(0.0);
    const savings = totalIncome - totalExpenses;
    const savingsSign = savings >= 0 ? "+" : "-";

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

    const [dataPoints, setDataPoints] = useState<MonthlyIncomeAndExpenses[]>([]);

    const { transactions } = useDatabase()

    useEffect(() => {
        if (startDate && endDate && !startDate.isAfter(endDate)) {
            const months = getMonths(startDate, endDate);

            const fetchData = async () => {
                setLoading(true);

                const map = new Map<string, { income: number, expenses: number }>(
                    months.map(key => [key.format('MMM YY'), ({ income: 0.0, expenses: 0.0 })])
                );

                const depositAndTransactions = getTransactionDetails({
                    transactions: transactions,
                    date: { startDate: startDate, endDate: endDate }
                });

                depositAndTransactions.forEach(entry => months.forEach(month => {
                    const start = month.startOf("month").toISOString();
                    const end = month.endOf("month").toISOString();
                    const curr = month.format('MMM YY');

                    if (entry.transaction_date >= start && entry.transaction_date <= end) {
                        map.set(curr, {
                            income: (map.get(curr)?.income || 0) + entry.deposit_amount,
                            expenses: (map.get(curr)?.expenses || 0) + entry.withdrawal_amount
                        })
                    }
                }));

                const data: MonthlyIncomeAndExpenses[] = Array.from(map.entries())
                    .map(([date, { income, expenses }]) => ({ date, income, expenses }));

                setDataPoints(data);
                const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
                setTotalIncome(totalIncome);

                const totalExpenses = data.reduce((sum, d) => sum + d.expenses, 0);
                setTotalExpenses(totalExpenses);

                setLoading(false);
            };

            fetchData();
        } else {
            setLoading(true);

            setDataPoints([]);
            setTotalIncome(0.0);
            setTotalExpenses(0.0);

            setLoading(false);
        }
    }, [startDate, endDate, transactions])

    const chartData = {
        labels: dataPoints.map(d => d.date),
        datasets: [
            {
                label: "Income",
                data: dataPoints.map(d => d.income),
                borderColor: "hsl(219, 87.70%, 61.80%)",
                backgroundColor: "hsl(219, 87.70%, 61.80%)",
                fill: false,
            },
            {
                label: "Expenses",
                data: dataPoints.map(d => d.expenses),
                borderColor: "hsl(0, 93.50%, 69.60%)",
                backgroundColor: "hsl(0, 93.50%, 69.60%)",
                fill: false,
            }
        ],
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
    }

    return (
        <div className="border border-gray-300 border-2 p-4 rounded-lg flex-1 flex flex-col gap-5">
            <h1 className="font-bold text-xl">Income vs. Expenses</h1>

            <div className="flex flex-col justify-center items-center gap-2">
                {showChart ? (
                    loading ? (
                        <div className="text-gray-400 h-[500px] flex flex-col justify-center items-center">
                            Loading data...
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center w-full">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    )
                ) : (
                    <div className="flex flex-col justify-center items-center gap-2 h-[500px]">
                        <LineChart className="h-12 w-12 text-green-500" />
                        <p className="text-sm text-gray-400">Income vs. Expenses Chart</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <p>Income</p>
                        <p>${totalIncome.toFixed(2)}</p>
                    </div>

                    <div className="w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="h-full rounded-lg transition-all duration-300 bg-blue-500"
                            style={{
                                width: `${totalExpenses === 0 ? 0 : Math.min((totalIncome / totalExpenses) * 100, 100)}%`
                            }}
                        />
                    </div>

                    <div className="flex justify-between">
                        <p>Expenses</p>
                        <p>${totalExpenses.toFixed(2)}</p>
                    </div>

                    <div className="w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="h-full rounded-lg transition-all duration-300 bg-red-500"
                            style={{
                                width: `${totalIncome === 0 ? 0 : Math.min((totalExpenses / totalIncome) * 100, 100)}%`
                            }}
                        />
                    </div>
                </div>

                <div className="flex justify-between">
                    <b>Net Savings</b>

                    <p className={savings >= 0 ? "text-green-500" : "text-red-500"}>
                        {savingsSign}${Math.abs(savings).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    )
}