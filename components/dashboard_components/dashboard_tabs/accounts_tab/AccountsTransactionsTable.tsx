import { useEffect, useState } from "react";
import { getTransactionDetailByAccountNo } from "@/lib/supabase_query";
import { Account, Transaction } from "@/components/types";
import TransactionAmount from "./TransactionAmount";

interface AccountsTransactionsTableProps {
    account: Account;
}

export default function AccountsTransactionsTable({ account }: AccountsTransactionsTableProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        getTransactionDetailByAccountNo(account.account_no).then(data => {
            if (data != null) {
                setTransactions(data);
            }
        })
    })
    
    return (
        <table className="table-fixed" 
            style={{margin: "0 auto", width: "100%"}}>
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
                { transactions.map((transaction, index) => (
                    <tr key={index}>
                        <td className="p-1 text-left" 
                            style={{ 
                                width: "60%", 
                                wordBreak: "break-word", 
                                overflowWrap: "anywhere" }}>
                                    {transaction.transaction_description}
                        </td>
                        
                        <td className="p-1 text-left" 
                            style={{ width: "20%" }}>
                                <TransactionAmount transaction={transaction}/>
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