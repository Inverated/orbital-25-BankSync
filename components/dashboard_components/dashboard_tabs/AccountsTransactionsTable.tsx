import { useEffect, useState } from "react";
import { AccordionProps } from "./AccountsAccordian";
import { getTransactionDetailByAccountNo } from "@/lib/supabase_query";
import TransactionAmount from "./TransactionAmount";

export default function Accounts_TransactionsTable({ account }: AccordionProps) {
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        getTransactionDetailByAccountNo(account.account_no).then(data => {
            if (data != null) {
                setTransactions(data);
            }
        })
    }, [])
    
    return (
        <table style={{margin: "0 auto", width: "100%"}}>
            <thead>
                <tr>
                    <th className="p-1 text-left">Description</th>
                    <th className="text-left">Amount</th>
                    <th  className="text-left">Date</th>
                </tr>
            </thead>

            <tbody>
                { transactions.map((transaction, index) => (
                    <tr key={index}>
                        <td className="p-1 text-left">{transaction.transaction_description}</td>
                        <td><TransactionAmount transaction={transaction}/></td>
                        <td>{transaction.transaction_date}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}