import { useEffect, useState } from "react";
import Accounts_TransactionsAccordian from "./AccountsAccordian";
import { getAccountDetails } from "@/lib/supabase_query";

export default function Accounts() {
    const [accounts, setAccounts] = useState<any[]>([]);

    useEffect(() => {
        getAccountDetails().then(data => {
            if (data != null) {
                setAccounts(data);
            }
        })
    }, [])

    return(
        <div className="items-center justify-center">
            { accounts.map((account, index) => (
                <div className="rounded-lg p-7 m-5 border border-black space-y-1" key={index}>
                    <h1>{account.bank_name}</h1>
                    <p>Account Name: {account.account_name}</p>
                    <p>Account No.: {account.account_no}</p>
                    <p>Balance: ${account.balance.toFixed(2)}</p>
                    <Accounts_TransactionsAccordian account={account}/>
                </div>
            ))}
        </div>
    )
}