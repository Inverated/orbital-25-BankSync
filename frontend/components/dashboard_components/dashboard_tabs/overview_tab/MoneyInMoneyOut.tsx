import { useDatabase } from "@/context/DatabaseContext";
import { getTransactionDetails } from "@/lib/databaseQuery";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

interface MoneyInMoneyOutProps {
    account_no: string,
}

interface MonthlyMoneyInMoneyOut {
    date: string;
    moneyIn: number;
    moneyOut: number;
}

export default function MoneyInMoneyOut({ account_no }: MoneyInMoneyOutProps) {
    const [loading, setLoading] = useState(true);

    const [dataPoints, setDataPoints] = useState<MonthlyMoneyInMoneyOut[]>([]);

    const { transactions } = useDatabase()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const months = Array.from({ length: 6 },
                (_, i) => dayjs().subtract(i, "month").startOf("month"));

            const depositAndTransactions = getTransactionDetails({
                transactions: transactions,
                condition: [{ key: 'account_no', value: [account_no] }],
                date: { startDate: months[months.length - 1], endDate: months[0] }
            })

            const map = new Map<string, { moneyIn: number, moneyOut: number }>(
                months.map(key => [key.format('MMM YY'), ({ moneyIn: 0.0, moneyOut: 0.0 })])
            )
            depositAndTransactions.forEach(entry => months.forEach(month => {
                const start = month.startOf("month")
                const end = month.endOf("month")
                const curr = month.format('MMM YY');
                const entryDate = dayjs(entry.transaction_date);
                if (entryDate.valueOf() >= start.valueOf() && entryDate.valueOf() <= end.valueOf()) {
                    map.set(curr, {
                        moneyIn: (map.get(curr)?.moneyIn || 0) + entry.deposit_amount,
                        moneyOut: (map.get(curr)?.moneyOut || 0) + entry.withdrawal_amount
                    })
                }
            }))

            const data: MonthlyMoneyInMoneyOut[] = Array.from(map.entries())
                .map(([date, { moneyIn, moneyOut }]) => ({ date, moneyIn, moneyOut }));

            setDataPoints(data.reverse());

            setLoading(false);
        };

        fetchData();
    }, [account_no, transactions]);


    const chartData = {
        labels: dataPoints.map(d => d.date),
        datasets: [
            {
                label: "Money In",
                data: dataPoints.map(d => d.moneyIn),
                borderColor: "hsl(219, 87.70%, 61.80%)",
                backgroundColor: "hsl(219, 87.70%, 61.80%)",
                borderRadius: 5,
            },
            {
                label: "Money Out",
                data: dataPoints.map(d => d.moneyOut),
                borderColor: "hsl(0, 93.50%, 69.60%)",
                backgroundColor: "hsl(0, 93.50%, 69.60%)",
                borderRadius: 5,
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
        }
    }

    return (
        <div>
            {loading ? (
                <div className="text-gray-400 flex flex-col justify-center items-center">
                    Loading data...
                </div>
            ) : (
                <Bar data={chartData} options={chartOptions} />

            )}
        </div>
    )
}