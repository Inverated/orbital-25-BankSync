import { useUserId } from "@/context/UserContext";
import { getTransactionDetails } from "@/lib/supabase_query";
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

export default function MoneyInMoneyOut({ account_no } : MoneyInMoneyOutProps) {
    const [loading, setLoading] = useState(true);

    const [dataPoints, setDataPoints] = useState<MonthlyMoneyInMoneyOut[]>([]);

    const userId = useUserId()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const months = Array.from({ length: 6 }, 
                (_, i) => dayjs().subtract(i, "month").startOf("month"));

            const data = await Promise.all(
                months.map(async (month) => {
                    const transactions = await getTransactionDetails(userId, ['account_no'], [], false, month);
                    
                    const moneyIn = transactions
                        .reduce((sum, transaction) => sum + (Number(transaction.deposit_amount) || 0), 0);
                    const moneyOut = transactions
                        .reduce((sum, transaction) => sum + (Number(transaction.withdrawal_amount) || 0), 0);
                    
                    return {
                        date: month.format("MMM YY"),
                        moneyIn,
                        moneyOut
                    }
                })
            );

            setDataPoints(data.reverse());

            setLoading(false);
        };

        fetchData();
    }, [account_no]);

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