import { getSpendingByCategory, getTransactionCategories } from "@/lib/supabase_query";
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

    useEffect(() => {
        if (startDate && endDate && !startDate.isAfter(endDate)) {
            const fetchData = async () => {
                setLoading(true);

                const categories = await getTransactionCategories();

                const data = await Promise.all(
                    categories.map(async (category) => {
                        const transactions = await getSpendingByCategory(category);
                        const spending = transactions
                            .reduce((sum, transaction) => sum + (Number(transaction.withdrawal_amount) || 0), 0);
                        
                        return {
                            category: category,
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
                position: "bottom" as const,
            }
        }
    }

    return (
        <div className="border border-black p-3 rounded-lg flex-1 flex flex-col gap-2">
            <h1 className="font-bold">Spending by Category</h1>
        
            <div className="flex flex-col h-[300px] justify-center items-center gap-2">
                {showChart ? (
                    loading ? (
                        <p className="text-gray-400">Loading data...</p>
                    ) : (
                        <Pie data={chartData} options={chartOptions} />
                    )
                ) : (
                    <>
                        <PieChart className="h-12 w-12"/>
                        <p className="text-sm text-gray-400">Category Breakdown Chart</p>
                    </>
                )}
            </div>
        </div>
    )
}