import { Account, Transaction } from "@/utils/types"
import { useEffect, useState } from "react"
import MoneyInMoneyOut from "./MoneyInMoneyOut";
import { getAccountDetails, getTransactionDetails } from "@/lib/databaseQuery";
import { useDatabase } from "@/context/DatabaseContext";
import AnalyticsDatePicker from "@/utils/DatePicker";
import { Dayjs } from "dayjs";
import IncomeExpensesPie from "./IncomeExpensesPie";
import { CircleArrowDown, CircleArrowUp, CircleDollarSign } from "lucide-react";

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
                bank_name: entry.bank_name,
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

    const [showIncomeDatePicker, setShowIncomeDatePicker] = useState(false);
    const [incomeDate, setIncomeDate] = useState<Dayjs | null>(null);

    const [showExpensesDatePicker, setShowExpensesDatePicker] = useState(false);
    const [expensesDate, setExpensesDate] = useState<Dayjs | null>(null);

    return (
        isLoaded &&
        <div className="flex flex-col items-center justify-center">
            <div 
                className="py-5 px-7 m-5 w-2/3 border border-gray-300 border-2 hover:cursor-pointer rounded-lg"
            >
                <button onClick={expandTotalBal} className="flex flex-row items-center gap-3 hover:cursor-pointer">
                    <CircleDollarSign className="h-9 w-9 text-green-500" />
                    
                    <div className="text-2xl w-full text-start">
                        <b>Total balance:</b> ${totalBal.toFixed(2)}
                    </div>
                </button>

                <div id="expanded_account" className="hidden">
                    {accountArray.map((account, index) =>
                        <div key={account.id} className="rounded-lg">
                            <button className="m-2 flex text-lg justify-between hover:cursor-pointer w-full"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setExpandAccount(expandAccount == account.account_no ? null : account.account_no!)
                                }}>
                                <div>
                                    <b>{account.account_name ? account.account_name : 'Account No'} ({account.account_no}) &middot; {account.bank_name} </b>
                                </div>

                                <div>
                                    ${account.balance ? account.balance.toFixed(2) : '0.00'}
                                </div>
                            </button>

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
                <div className="justify-items-start w-1/1 h-full py-5 px-7 border border-gray-300 border-2 hover:cursor-pointer rounded-lg">
                    <button 
                        onClick={() => {
                                if (showIncomeDatePicker) {
                                    setShowIncomeDatePicker(false);
                                    setIncomeDate(null);
                                } else {
                                    setShowIncomeDatePicker(true);
                                }
                            }}
                        className="flex flex-row items-center gap-3 hover:cursor-pointer"
                    >
                        <CircleArrowUp className="h-9 w-9 text-blue-500" />
                        
                        <div className="text-2xl w-full text-start">
                            <b>Income:</b> ${income.toFixed(2)}
                        </div>
                    </button>

                    {showIncomeDatePicker && (
                        <div className="flex flex-row items-center justify-center p-3">
                            <AnalyticsDatePicker 
                                label="Select a date"
                                value={incomeDate}
                                onChange={setIncomeDate} 
                            />
                        </div>
                    )}

                    {showIncomeDatePicker && incomeDate && (
                        <div className="flex flex-col py-2">
                            <IncomeExpensesPie date={incomeDate} category={"income"} />
                        </div>
                    )}
                </div>
                <div className="justify-items-start w-1/1 h-full py-5 px-7 border border-gray-300 border-2 hover:cursor-pointer rounded-lg">
                    <button 
                        onClick={() => {
                                if (showExpensesDatePicker) {
                                    setShowExpensesDatePicker(false);
                                    setExpensesDate(null);
                                } else {
                                    setShowExpensesDatePicker(true);
                                }
                            }}
                        className="flex flex-row items-center gap-3 hover:cursor-pointer"
                    >
                        <CircleArrowDown className="h-9 w-9 text-red-500" />
                        
                        <div className="text-2xl w-full text-start">
                            <b>Expenses:</b> ${expenses.toFixed(2)}
                        </div>
                    </button>

                    {showExpensesDatePicker && (
                        <div className="flex flex-row items-center justify-center p-3">
                            <AnalyticsDatePicker 
                                label="Select a date"
                                value={expensesDate}
                                onChange={setExpensesDate} 
                            />
                        </div>
                    )}

                    {showExpensesDatePicker && expensesDate && (
                        <div className="flex flex-col py-2">
                            <IncomeExpensesPie date={expensesDate} category={"expenses"} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}