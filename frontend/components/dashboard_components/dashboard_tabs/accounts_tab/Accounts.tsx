import { useEffect, useState } from "react";
import { getAccountDetails } from "@/lib/supabase_query";
import { Account } from "@/utils/types";
import AccountsExpand from "./AccountsExpand";
import { useUserId } from "@/context/UserContext";

export default function Accounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);

    const userId = useUserId()
    useEffect(() => {
        getAccountDetails(userId).then(data => {
            if (data != null) {
                setAccounts(data);
            }
        })
    }, [userId])

    return(
        <div className="items-center justify-center">
            { accounts.map((account, index) => (
                <div className="rounded-lg p-7 m-5 border border-black space-y-1" key={index}>
                    <h1>{account.bank_name}</h1>
                    <p>Account Name: {account.account_name}</p>
                    <p>Account No.: {account.account_no}</p>
                    <p>Balance: ${account.balance.toFixed(2)}</p>
                    <AccountsExpand account={account} index={index}/>
                </div>
            ))}
        </div>
    )
}