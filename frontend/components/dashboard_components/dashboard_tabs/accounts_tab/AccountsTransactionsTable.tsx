import { useEffect, useState } from "react";
import { Account, Transaction } from "@/utils/types";
import TransactionAmount from "./TransactionAmount";
import { getTransactionDetails } from "@/lib/databaseQuery";
import { useDatabase } from "@/context/DatabaseContext";

interface AccountsTransactionsTableProps {
    account: Account;
    resetToggle: boolean;
}

export default function AccountsTransactionsTable({ account, resetToggle }: AccountsTransactionsTableProps) {
    const [currTransactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsCount, setTransactionsCount] = useState(10);

    const { transactions } = useDatabase()

    useEffect(() => {
        const transArray = getTransactionDetails({
            transactions: transactions,
            condition: [{ key: 'account_no', value: [account.account_no] }]
        })

        if (transArray != null) { 
            setTransactions(transArray);
        }
    }, [transactions]);

    useEffect(() => {
        setTransactionsCount(10);
    }, [resetToggle]);

    return (
        <div className="pt-1">
            <table className="table-auto border-separate border-spacing-x-2">
                <thead>
                    <tr>
                        <th className="p-1 text-left w-screen">
                            Description
                        </th>

                        <th className="p-1 text-left whitespace-nowrap">
                            Amount
                        </th>

                        <th className="p-1 text-left whitespace-nowrap">
                            Date
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {currTransactions.slice(0, transactionsCount).map((transaction, index) => (
                        <tr key={index}>
                            <td className="p-1 text-left break-words">
                                {transaction.transaction_description}
                            </td>

                            <td className="p-1 text-left whitespace-nowrap">
                                <TransactionAmount transaction={transaction} />
                            </td>

                            <td className="p-1 text-left whitespace-nowrap">
                                {transaction.transaction_date}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {transactionsCount < currTransactions.length && (
                <div className="text-center mt-1 text-blue-600"
                    onClick={(e) => {
                        e.stopPropagation();
                        setTransactionsCount(prev => prev + 5);
                    }}
                >
                    Show More
                </div>
            )}
        </div>
    )
}