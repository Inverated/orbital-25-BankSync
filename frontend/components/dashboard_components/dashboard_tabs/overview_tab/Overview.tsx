import { Account, Transaction } from "@/utils/types"
import { useEffect, useState } from "react"
import MoneyInMoneyOut from "./MoneyInMoneyOut";
import { getAccountDetails, getTransactionDetails } from "@/lib/databaseQuery";
import { useDatabase } from "@/context/DatabaseContext";

export default function Overview() {
    const [totalBal, setTotalBal] = useState(0.0);
    const [income, setIncome] = useState(0.0);
    const [expenses, setExpenses] = useState(0.0);
    const [isLoaded, setLoadingStatus] = useState(false);

    const [accountArray, setAccount] = useState<Partial<Account>[]>([]);
    const [expandAccount, setExpandAccount] = useState<string | null>(null);

    const { accounts, transactions, loaded } = useDatabase()

    useEffect(() => {
        const accArray: Account[] = getAccountDetails({
            accounts: accounts
        })

        let totalBalance = 0
        const accountArr: Partial<Account>[] = []
        accArray.forEach(entry => {
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
        setLoadingStatus(loaded)

        const transArray: Transaction[] = getTransactionDetails({
            transactions: transactions,
        })

        setIncome(transArray.reduce((x, y) => {
            if (y.deposit_amount) {
                return x + y.deposit_amount
            } else return x
        }, 0))
        setExpenses(transArray.reduce((x, y) => {
            if (y.withdrawal_amount) {
                return x + y.withdrawal_amount
            } else return x
        }, 0))
    }, [expandAccount, loaded, accounts, transactions])

    const expandTotalBal = () => {
        const expanded_account = document.getElementById("expanded_account");
        if (expanded_account?.className.includes('hidden')) {
            expanded_account?.classList.remove('hidden');
        } else {
            expanded_account?.classList.add('hidden');
            setExpandAccount(null);
        }
    }

    return (
        isLoaded &&
        <div className="flex flex-col items-center justify-center">
            <div onClick={expandTotalBal}
                className="py-5 px-7 m-5 w-2/3 border border-black hover:cursor-pointer rounded-lg">
                <label className="text-2xl hover:cursor-pointer">
                    <b>Total balance:</b> ${totalBal.toFixed(2)}
                </label>

                <div id="expanded_account" className="hidden">
                    {accountArray.map((account, index) =>
                        <div key={account.id} className="rounded-lg">
                            <div className="m-2 flex justify-between hover:cursor-pointer"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setExpandAccount(expandAccount == account.account_no ? null : account.account_no!)
                                }}>
                                <div>
                                    <b>{account.account_name}:</b> {account.account_no}
                                </div>

                                <div>
                                    ${account.balance ? account.balance.toFixed(2) : '0.00'}
                                </div>
                            </div>

                            {expandAccount === account.account_no && (
                                <div>
                                    <MoneyInMoneyOut account_no={account.account_no} />
                                </div>
                            )}

                            {index < accountArray.length - 1 && <hr className="my-2" />}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col space-y-5 space-x-5 sm:flex-row justify-between w-2/3">
                <div className="justify-items-start w-1/1 h-full py-3 px-7 border border-black rounded-lg">
                    <label className="text-2xl">
                        <b>Income:</b> ${income.toFixed(2)}
                    </label>
                </div>
                <div className="justify-items-start w-1/1 h-full py-3 px-7 border border-black rounded-lg">
                    <label className="text-2xl">
                        <b>Expenses:</b> ${expenses.toFixed(2)}
                    </label>
                </div>
            </div>
        </div>
    )
}