import { getExpenses, getIncome } from "@/lib/supabase_query";
import { useEffect, useState } from "react";
import { AiOutlineLineChart } from "react-icons/ai";

export default function IncomeExpenses() {
    const [income, setIncome] = useState(0.0)
    const [expenses, setExpenses] = useState(0.0)

    useEffect(() => {
        getIncome().then(data => {
            if (data != null) {
                setIncome(data.reduce((x, y) => x + y.deposit_amount, 0))
            }
        })
        getExpenses().then(data => {
            if (data != null) {
                setExpenses(data.reduce((x, y) => x + y.withdrawal_amount, 0))
            }
        })
    }, [])
    
    return (
        <div className="border order-black p-3 rounded-lg flex-1">
            <h1 className="font-bold">Income vs. Expenses</h1>

            <div className="flex flex-col h-[300px] justify-center items-center gap-2">
                <AiOutlineLineChart className="h-12 w-12"/>
                <p className="text-sm text-gray-400">Income vs. Expenses Chart</p>
            </div>

            <div>
                <div className="flex justify-between">
                    <p>Income</p>
                    <p>${income.toFixed(2)}</p>
                </div>

                <progress value={1} className="w-full rounded-lg"/>
                
                <div className="flex justify-between">
                    <p>Expenses</p>
                    <p>${expenses.toFixed(2)}</p>
                </div>
                
                <progress value={expenses} max={income} className="w-full rounded-lg"/>
            </div>
        </div>
    )
}