import { Account } from '@/utils/types';
import AccountsTransactionsTable from "./AccountsTransactionsTable";
import { SlArrowDown } from "react-icons/sl";

export interface AccountExpandProps {
  account: Account;
  index: number;
}

export default function AccountsExpand({ account, index } : AccountExpandProps) {
  const expandTransactions = () => {
    const expanded_transactions = document.getElementById(`expanded-${index}`)
    if (expanded_transactions?.className.includes("hidden")) {
      expanded_transactions?.classList.remove("hidden")
    } else {
      expanded_transactions?.classList.add("hidden")
    }
  }
  
  return (
    <div onClick={expandTransactions}
      className="inline-block p-3 rounded-lg border border-black hover:cursor-pointer">
      <h1 className="text-blue-600 underline flex flex-row gap-4 items-center">
        All Transactions 
        <SlArrowDown />
      </h1>
      
      <div id={`expanded-${index}`} className="hidden">
        <AccountsTransactionsTable account={account}/>
      </div>
    </div>
  )
}