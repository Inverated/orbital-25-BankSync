import { useEffect, useState } from "react";
import { Account } from "@/utils/types";
import AccountsExpand from "./AccountsExpand";
import { useDatabase } from "@/context/DatabaseContext";

export default function Accounts() {
    const [currAccounts, setAccounts] = useState<Account[]>([]);

    const { accounts } = useDatabase()

    useEffect(() => {
        setAccounts(accounts);
    }, [accounts])

    return (
        <div className="items-center justify-center">
            {currAccounts.map((account, index) => (
                <div className="rounded-lg p-7 m-5 border border-black space-y-1" key={index}>
                    <h1>{account.bank_name}</h1>
                    <p>Account Name: {account.account_name}</p>
                    <p>Account No.: {account.account_no}</p>
                    <p>Balance: ${account.balance.toFixed(2)}</p>
                    <AccountsExpand account={account} index={index} />
                </div>
            ))}
        </div>
    )
}