import { getAccountDetails, getExpenses, getIncome } from "@/lib/supabase_query"
import { useEffect, useState } from "react"

export default function Overview() {
    const [totalBal, setTotalBal] = useState(0.0)
    const [income, setIncome] = useState(0.0)
    const [expenses, setExpenses] = useState(0.0)
    
    useEffect(() => {
        getAccountDetails().then(arr => {
            if (arr != null) {
                setTotalBal(arr.reduce((x, y) => x.balance + y.balance))
            }
        })
        getIncome().then(arr => {
            if (arr != null) {
                setIncome(arr.reduce((x, y) => x + y.deposit_amount, 0))
            }
        })
        getExpenses().then(arr => {
            if (arr != null) {
                setExpenses(arr.reduce((x, y) => x + y.withdrawal_amount, 0))
            }
        })
    }, [])

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="p-10 m-5 border border-black">
                Total balance: ${totalBal.toFixed(2)}
            </div>
            <div className="flex justify-between">
                <div className="p-20 m-5 border border-black">
                    Income: ${income.toFixed(2)}
                </div>
                <div className="p-20 m-5 border border-black">
                    Expense: ${expenses.toFixed(2)}
                </div>
            </div>
        </div>
    )
}