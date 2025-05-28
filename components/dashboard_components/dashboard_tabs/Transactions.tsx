import { getTransactionDetail } from "@/lib/supabase_query"
import { useEffect, useState } from "react"
import Transaction_Row from "./Transaction_Row";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function Transactions() {
    const [pageNo, setPage] = useState(1)
    let maxPageNo = 1

    type Entry = { id: number, transaction_description: string; account_no: string; withdrawal_amount: number; deposit_amount: number; category: string; transaction_date: string }
    const [transactionEntry, setEntry] = useState<Entry[]>([])

    useEffect(() => {
        getTransactionDetail().then(arr => {
            arr?.forEach(entry => setEntry(prev =>
                [...prev, {
                    id: entry.id,
                    transaction_description: entry.transaction_description,
                    account_no: entry.account_no,
                    withdrawal_amount: entry.withdrawal_amount,
                    deposit_amount: entry.deposit_amount,
                    category: entry.category,
                    transaction_date: entry.transaction_date
                }]))
        })
        document.getElementById("load_transaction_data")?.classList.remove('hidden')
    }, [])

    maxPageNo = Math.ceil(transactionEntry.length / 10)

    const setPageNo = (num: number) => {
        const newNum = pageNo + num
        if (newNum > maxPageNo) {
            setPage(maxPageNo)
        } else if (newNum < 1) {
            setPage(1)
        } else {
            setPage(newNum)
        }
    }


//change display to only show 10 entries
return (
    <div>
        <div className="text-3xl flex justify-between">
            <h1 className="p-4">All Transactions</h1>
            <div>
                <button className="p-2 m-4 border border-black rounded-lg hover:cursor-pointer">Export</button>
                <button className="p-2 m-4 border border-black rounded-lg hover:cursor-pointer">Filter</button>
            </div>
        </div>

        <div id="load_transaction_data" className="hidden">
            {transactionEntry.map(entry =>
                <Transaction_Row key={entry.id} {...entry} />

            )}
            <div className="my-10 flex items-center justify-center">
                <FaAngleDoubleLeft className="hover:cursor-pointer" onClick={() => setPageNo(-10)} /><FaAngleLeft className="hover:cursor-pointer" onClick={() => setPageNo(-1)} />
                <div className="px-5">
                    {pageNo + " of " + maxPageNo}
                </div>
                <FaAngleRight className="hover:cursor-pointer" onClick={() => setPageNo(1)} /><FaAngleDoubleRight className="hover:cursor-pointer" onClick={() => setPageNo(10)} />
            </div>
        </div>

    </div>

)
}