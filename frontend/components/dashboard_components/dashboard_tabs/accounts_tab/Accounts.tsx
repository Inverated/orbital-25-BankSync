import { useEffect, useState } from "react";
import { Account } from "@/utils/types";
import AccountsExpandTransactions from "./AccountsExpandTransactions";
import { useDatabase } from "@/context/DatabaseContext";

export default function Accounts() {
    const [currAccounts, setAccounts] = useState<Account[]>([]);

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const { accounts } = useDatabase();

    useEffect(() => {
        setAccounts(accounts);
    }, [accounts])

    const toggleExpand = (index: number) => {
        setExpandedIndex(prev => (prev === index ? null : index));
    }

    return (
        <div className="flex justify-center">
            <div className="w-3/4">
                {currAccounts.map((account, index) => (
                    <div 
                        className="rounded-lg p-7 m-5 border border-gray-300 border-2 space-y-1 hover:cursor-pointer" 
                        key={index}
                        onClick={() => toggleExpand(index)}
                    >
                        {expandedIndex === index ? (
                            <div className="text-lg flex flex-col gap-2">
                                <p><a className="font-bold">Account Name:</a> {account.account_name}</p>
                                <p><a className="font-bold">Account Number:</a> {account.account_no}</p>
                                <p><a className="font-bold">Bank Name:</a> {account.bank_name}</p>
                                <p><a className="font-bold">Balance:</a> ${account.balance.toFixed(2)}</p>
                                
                                <AccountsExpandTransactions account={account} index={index} />
                            </div>
                        ) : (
                            <div className="flex flex-row items-center justify-between">
                                <div className="text-xl font-bold">
                                    {account.account_name} ({account.account_no}) &middot; {account.bank_name}
                                </div>
                                
                                <div className="text-xl">
                                    ${account.balance.toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}