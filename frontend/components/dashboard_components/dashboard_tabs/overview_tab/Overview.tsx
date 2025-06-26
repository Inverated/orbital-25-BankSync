import { Account } from "@/utils/types"
import { useEffect, useState } from "react"
import { useUserId } from "@/context/UserContext"
import { getAccountDetails, getTransactionDetails } from "@/lib/supabase_query"

export default function Overview() {
    const [totalBal, setTotalBal] = useState<number>(0.0)
    const [income, setIncome] = useState(0.0)
    const [expenses, setExpenses] = useState(0.0)
    const [isLoaded, setLoadingStatus] = useState(false)

    const [accountArray, setAccount] = useState<Partial<Account>[]>([])
    const userId = useUserId();

    //change to store query locally and retrieve instead of querying every time
    useEffect(() => {
        getAccountDetails(userId).then(arr => {
            let totalBalance = 0
            const accountArr: Partial<Account>[] = []
            arr?.forEach(entry => {
                if (entry.balance) totalBalance += entry.balance
                accountArr.push({
                    id: entry.id,
                    account_name: entry.account_name,
                    account_no: entry.account_no,
                    balance: entry.balance
                })
            })
            setTotalBal(totalBalance)
            setAccount(accountArr)
            setLoadingStatus(true)
        })

        getTransactionDetails(userId, ['deposit_amount', 'withdrawal_amount'])
            .then(data => {
                setIncome(data.reduce((x, y) => {
                    if (y.deposit_amount) {
                        return x + y.deposit_amount
                    } else return x
                }, 0))
                setExpenses(data.reduce((x, y) => {
                    if (y.withdrawal_amount) {
                        return x + y.withdrawal_amount
                    } else return x
                }, 0))

            })
    }, [userId])

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
                className="py-5 px-7 m-5 w-2/3 border border-black hover:cursor-pointer rounded-lg">
                <label className="text-2xl hover:cursor-pointer">
                    <b>Total balance:</b> ${totalBal.toFixed(2)}
                </label>
                <div id="expanded_account" className="hidden">
                    {accountArray.map((accounts, index) =>
                        <div key={accounts.id} className="rounded-lg">
                            <div className="m-2 flex justify-between">
                                <div>
                                    <b>{accounts.account_name}:</b> {accounts.account_no}
                                </div>
                                <div>
                                    ${accounts.balance ? accounts.balance.toFixed(2) : '0.00'}
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