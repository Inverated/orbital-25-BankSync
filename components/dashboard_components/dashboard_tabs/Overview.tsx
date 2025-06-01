import { getAccountDetails, getExpenses, getIncome } from "@/lib/supabase_query"
import { useEffect, useState } from "react"

export default function Overview() {
    const [totalBal, setTotalBal] = useState(0.0)
    const [income, setIncome] = useState(0.0)
    const [expenses, setExpenses] = useState(0.0)
    const [isLoaded, setLoadingStatus] = useState(false)

    type Account = { id: string, name: string, no: string, bal: number }
    const [accountArray, setAccount] = useState<Account[]>([])

    //change to store query locally and retrieve instead of querying every time
    useEffect(() => {
        getAccountDetails().then(arr => {
            let totalBalance = 0
            const accountArr: Account[] = []
            arr?.forEach(entry => {
                totalBalance += entry.balance
                accountArr.push({
                    id: entry.id,
                    name: entry.account_name,
                    no: entry.account_no,
                    bal: entry.balance
                })
            })
            setTotalBal(totalBalance)
            setAccount(accountArr)
            setLoadingStatus(true)
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

    const expandTotalBal = () => {
        const expanded_account = document.getElementById("expanded_account")
        if (expanded_account?.className.includes('hidden')) {
            expanded_account?.classList.remove('hidden')
        } else {
            expanded_account?.classList.add('hidden')
        }
    }

    return (
        isLoaded && <div className="flex flex-col items-center justify-center">
            <div onClick={expandTotalBal}
                className="py-3 px-7 m-5 w-2/3 border border-black hover:cursor-pointer rounded-lg">
                <label className="text-2xl hover:cursor-pointer">
                    <b>Total balance:</b> ${totalBal.toFixed(2)}
                </label>
                <div id="expanded_account" className="">
                    {accountArray.map((accounts, index) =>
                        <div key={accounts.id} className=" p-3 rounded-lg">
                            <div className="flex justify-between">
                                <div>
                                    <b>{accounts.name}:</b> {accounts.no}
                                </div>
                                <div>
                                    ${accounts.bal.toFixed(2)}
                                </div>
                            </div>
                            {index < accountArray.length - 1 && <hr />}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-between w-2/3">
                <div className="justify-items-start w-1/1 py-3 px-7 mr-3 border border-black rounded-lg">
                    <label className="text-2xl">
                        <b>Income:</b> ${income.toFixed(2)}
                    </label>
                </div>
                <div className="justify-items-start w-1/1 py-3 px-7 ml-3 border border-black rounded-lg">
                    <label className="text-2xl">
                        <b>Expenses:</b> ${expenses.toFixed(2)}
                    </label>
                </div>
            </div>
        </div>
    )
}