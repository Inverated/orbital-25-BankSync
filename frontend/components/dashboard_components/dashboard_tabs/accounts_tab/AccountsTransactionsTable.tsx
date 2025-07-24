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
            <table className="table-fixed"
                style={{ margin: "0 auto", width: "100%" }}>
                <thead>
                    <tr>
                        <th className="p-1 text-left"
                            style={{ width: "80%" }}>
                            Description
                        </th>

                        <th className="p-1 text-left"
                            style={{ width: "10%" }}>
                            Amount
                        </th>

                        <th className="p-1 text-left"
                            style={{ width: "10%" }}>
                            Date
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {currTransactions.slice(0, transactionsCount).map((transaction, index) => (
                        <tr key={index}>
                            <td className="p-1 text-left"
                                style={{
                                    width: "60%",
                                    wordBreak: "break-word",
                                    overflowWrap: "anywhere"
                                }}>
                                {transaction.transaction_description}
                            </td>

                            <td className="p-1 text-left"
                                style={{ width: "20%" }}>
                                <TransactionAmount transaction={transaction} />
                            </td>

                            <td className="p-1 text-left"
                                style={{ width: "20%" }}>
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