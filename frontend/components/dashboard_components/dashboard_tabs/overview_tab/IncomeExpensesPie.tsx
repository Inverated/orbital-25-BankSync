import { useDatabase } from "@/context/DatabaseContext";
import { getTransactionDetails } from "@/lib/databaseQuery";
import { Dayjs } from "dayjs";
import { PieChart } from "lucide-react";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

interface IncomeExpensesPieProps {
    date: Dayjs | null;
    category: string;
}

interface AccountCashFLow {
    account_no: string;
    account_name: string;
    cash: number;
}

export default function IncomeExpensesPie({ date, category }: IncomeExpensesPieProps) {
    const [loading, setLoading] = useState(true);

    const [dataPoints, setDataPoints] = useState<AccountCashFLow[]>([]);

    const emptyData = dataPoints.length === 0;

    const { transactions, accounts } = useDatabase();

    useEffect(() => {
        if (date) {
            const fetchData = async () => {
                setLoading(true);

                const map = new Map<string, number>();

                const transactionAccountList = getTransactionDetails({
                    transactions: transactions,
                    date: { startDate: date, endDate: date }
                });

                if (category === "income") {
                    transactionAccountList
                        .filter(entry => entry.deposit_amount != 0.0)
                        .forEach(entry => 
                            map.set(entry.account_no, (map.get(entry.account_no) || 0) + entry.deposit_amount)
                        );
                } else if (category === "expenses") {
                    transactionAccountList
                        .filter(entry => entry.withdrawal_amount != 0.0)
                        .forEach(entry => 
                            map.set(entry.account_no, (map.get(entry.account_no) || 0) + entry.withdrawal_amount)
                        );
                }

                const data: AccountCashFLow[] = Array.from(map.entries())
                    .map(([account_no, cash]) => { 
                        const account = accounts.find(acc => acc.account_no === account_no);
                        
                        return {
                            account_no,
                            account_name: account?.account_name || account_no,
                            cash
                        };
                    }
                );
                
                setDataPoints(data);

                setLoading(false);
            };

            fetchData();
        } else {
            setLoading(true);

            setDataPoints([]);

            setLoading(false);
        }
    }, [date, transactions])

    const generateSliceColors = (index: number, total: number) => {
        const hue = (category === "income") ? 210 : 0;
        const saturation = 50 + (index * (30 / (total - 1)));
        const lightness = 80 + (index * (50 / (total - 1)));

        if (total === 1) {
            return `hsl(${hue}, 70%, 65%)`
        } else {
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }
    }

    const chartData = {
        labels: dataPoints.map(d => d.account_name),
        datasets: [
            {
                label: "Income",
                data: dataPoints.map(d => d.cash),
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
        <div className="flex flex-col justify-center items-center gap-2 h-full w-full">
            {emptyData ? (
                <div className="flex flex-col justify-center items-center gap-2 p-8 aspect-square">
                    <PieChart className="h-12 w-12 text-green-500" />
                    <p className="text-sm text-gray-400">No transactions found for the selected date.</p>
                </div>
            ) : (
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
            )}
        </div>
    )
}