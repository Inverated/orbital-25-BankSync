import { Account } from '@/utils/types';
import AccountsTransactionsTable from "./AccountsTransactionsTable";
import { ArrowDown } from "lucide-react";
import { useState } from 'react';

interface AccountExpandProps {
    account: Account;
    index: number;
}

export default function AccountsExpandTransactions({ account, index } : AccountExpandProps) {
    const [resetToggle, setResetToggle] = useState(false);

    const expandTransactions = () => {
        const expanded_transactions = document.getElementById(`expanded-${index}`);
        if (expanded_transactions?.className.includes("hidden")) {
            expanded_transactions?.classList.remove("hidden");
        } else {
            expanded_transactions?.classList.add("hidden");
            setResetToggle(prev => !prev);
        }
    }

    return (
        <div 
            onClick={(e) => {
                e.stopPropagation();

                const container = e.currentTarget;
                const expanded = container.classList.contains("expanded");
                container.classList.toggle("expanded", !expanded);

                expandTransactions();
            }}
            className="group hover:cursor-pointer transition-all pt-1"
        >
            <div className="inline-block p-3 rounded-xl
                group-[.expanded]:bg-white group-[expanded]:text-blue-600 group-[.expanded]:border-gray-300 group-[.expanded]:border-2
                bg-blue-500"
            >
                <div className="flex flex-row gap-4 items-center
                    group-[.expanded]:text-blue-600
                    text-white"
                >
                    Show Transactions 
                    <ArrowDown />
                </div>

                <div id={`expanded-${index}`} className="hidden">
                    <AccountsTransactionsTable account={account} resetToggle={resetToggle}/>
                </div>
            </div>
        </div>
    )
}