import { useEffect, useState } from "react";
import Accounts_TransactionsAccordian from "./Accounts_TransactionsAccordian";
import { getAccountDetails } from "@/lib/supabase_query";

export default function Accounts() {
    const [accounts, setAccounts] = useState<any[]>([]);

    useEffect(() => {
        getAccountDetails().then(data => {
            if (data != null) {
                setAccounts(data);
            }
        });
    }, []);

    return(
        <div className="items-center justify-center">
            { accounts.map((account, index) => (
                <div className="rounded-lg p-7 m-5 border border-black space-y-1" key={index}>
                    <header>{account.bank_name}</header>
                    <p>Account Name: {account.account_name}</p>
                    <p>Account No.: {account.account_no}</p>
                    <p>Balance: ${account.balance}</p>
                    <Accounts_TransactionsAccordian account={account}/>
                </div>
            ))}
        </div>
    )
}