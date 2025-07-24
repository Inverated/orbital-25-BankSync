import { useDatabase } from "@/context/DatabaseContext";
import { getTransactionDetails } from "@/lib/databaseQuery";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface IncomeExpensesExpandProps {
    category: string;
}

interface AccountCashFlow {
    account_no: string;
    account_name: string;
    bank_name: string;
    amount: number;
    lastMonthAmount: number;
}

export default function IncomeExpensesExpand({ category }: IncomeExpensesExpandProps) {
    const [accountArray, setAccountArray] = useState<AccountCashFlow[]>([]);
    
    const { transactions, accounts } = useDatabase();

    useEffect(() => {
        const totalMap = new Map<string, number>();
        const lastMonthMap = new Map<string, number>();

        const transactionAccountList = getTransactionDetails({
            transactions: transactions,
        });

        const lastMonthStart = dayjs().subtract(1, "month").startOf("month").toISOString();
        const lastMonthEnd = dayjs().subtract(1, "month").endOf("month").toISOString();

        transactionAccountList.forEach(entry => {
            const accountNo = entry.account_no;

            const isLastMonth = entry.transaction_date >= lastMonthStart && entry.transaction_date <= lastMonthEnd;

            const amount = 
                category === "income" ? entry.deposit_amount :
                category === "expenses" ? entry.withdrawal_amount : 
                0.0;
            
            totalMap.set(accountNo, (totalMap.get(accountNo) || 0) + amount);

            if (isLastMonth) {
                lastMonthMap.set(accountNo, (lastMonthMap.get(accountNo) || 0) + amount);
            }
        })

        const newAccountArray: AccountCashFlow[] = Array.from(totalMap.entries())
            .map(([account_no, amount]) => { 
                const account = accounts.find(acc => acc.account_no === account_no);
                const lastMonthAmount = lastMonthMap.get(account_no) || 0;
                
                return {
                    account_no,
                    account_name: account?.account_name || "",
                    bank_name: account?.bank_name || "",
                    amount,
                    lastMonthAmount
                };
            }
        );

        setAccountArray(newAccountArray)
    }, [transactions, accounts, category])
    
    return (
        <div className="w-full">
            {accountArray.map((account, index) => 
                <div key={index} className="flex flex-col">
                    <div className="flex flex-row justify-between text-lg">
                        <div>
                            <b>{account.account_name ? account.account_name : 'Account No'} ({account.account_no}) &middot; {account.bank_name} </b>
                        </div>

                        <div>
                            ${account.amount?.toFixed(2) || '0.00'}
                        </div>
                    </div>

                    <div className={`pt-1 text-right text-med ${category == "income" ? "text-blue-400" : "text-red-400"}`}>
                        ${account.lastMonthAmount.toFixed(2)} {category == "income" ? "earned" : "spent"} in the past month
                    </div>

                    {index < accountArray.length && <hr className="my-3 border-gray-300" />}
                </div>
            )}
        </div>
    )
}