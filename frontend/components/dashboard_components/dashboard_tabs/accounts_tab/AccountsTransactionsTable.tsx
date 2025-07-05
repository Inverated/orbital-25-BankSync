import { useEffect, useState } from "react";
import { Account, Transaction } from "@/utils/types";
import TransactionAmount from "./TransactionAmount";
import { useTransactionDetails } from "@/lib/databaseQuery";
import { useDatabase } from "@/context/DatabaseContext";

interface AccountsTransactionsTableProps {
    account: Account;
}

export default function AccountsTransactionsTable({ account }: AccountsTransactionsTableProps) {
    const [currTransactions, setTransactions] = useState<Transaction[]>([]);

    const { transactions } = useDatabase()

    useEffect(() => {
        const transArray = useTransactionDetails({
            transactions: transactions,
            condition: [{ key: 'account_no', value: [account.account_no] }]
        })

        if (transArray != null) {
            setTransactions(transArray)
        }
    }, [transactions])

    return (
        <table className="table-fixed"
            style={{ margin: "0 auto", width: "100%" }}>
            <thead>
                <tr>
                    <th className="p-1 text-left"
                        style={{ width: "60%" }}>
                        Description
                    </th>

                    <th className="p-1 text-left"
                        style={{ width: "20%" }}>
                        Amount
                    </th>

                    <th className="p-1 text-left"
                        style={{ width: "20%" }}>
                        Date
                    </th>
                </tr>
            </thead>

            <tbody>
                {currTransactions.map((transaction, index) => (
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
    )
}