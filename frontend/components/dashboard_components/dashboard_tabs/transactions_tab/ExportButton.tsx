import { useUserId } from "@/context/UserContext"
import { getAccountDetails, getTransactionDetails } from "@/lib/supabase_query"
import { Account, Transaction } from "@/utils/types"
import { useEffect, useState } from "react"
import ExportTable from "./ExportTable"
import exportToXlsx from "@/utils/downloadFile"


export default function ExportButton({ filteredAccount, filteredTransaction }: { filteredAccount: Account[], filteredTransaction: Transaction[] }) {
    const [exportDialogue, setExportDialogue] = useState(false)
    const [transactionEntry, setTransaction] = useState<Transaction[]>([])
    const [accountEntry, setAccount] = useState<Account[]>([])

    const [filteredTransactionEntry, setFilteredTransaction] = useState<Transaction[]>([])
    const [filteredAccountEntry, setFilteredAccount] = useState<Account[]>([])

    const [useFiltered, setUsingFiltered] = useState(false)

    const EXPORTACCOUNTHEADER = ['Bank Name', 'Account No', 'Account Name', 'Balance', 'Last Recorded Date']
    const EXPORTTRANSACTIONHEADER = ['Transaction Date', 'Description', 'Deposit', 'Withdrawal', 'Category', 'Ending Balance', 'Account No']

    const [activeTab, setActiveTab] = useState<'account' | 'transaction'>('account')

    const userId = useUserId()

    const exportToFile = () => {
        if (useFiltered) {
            exportToXlsx(filteredAccountEntry, filteredTransactionEntry, EXPORTACCOUNTHEADER, EXPORTTRANSACTIONHEADER)
        } else {
            exportToXlsx(accountEntry, transactionEntry, EXPORTACCOUNTHEADER, EXPORTTRANSACTIONHEADER)
        }
    }

    const resetAllValues = () => {
        setFilteredAccount([])
        setFilteredAccount([])
        setTransaction([])
        setAccount([])
        setActiveTab('account')
    }

    // query data here. Export only filtered items added later
    useEffect(() => {
        resetAllValues()

        setFilteredTransaction(filteredTransaction)
        setFilteredAccount(filteredAccount)

        getTransactionDetails({
            userId: userId
        }).then(arr => arr.forEach(entry => {
            setTransaction(prev => [...prev, {
                transaction_date: entry.transaction_date,
                transaction_description: entry.transaction_description,
                category: entry.category,
                withdrawal_amount: entry.withdrawal_amount,
                deposit_amount: entry.deposit_amount,
                ending_balance: entry.ending_balance,
                account_no: entry.account_no,
            }])
        }))
        getAccountDetails({
            userId: userId
        }).then(arr => arr.forEach(entry => {
            setAccount(prev => [...prev, {
                bank_name: entry.bank_name,
                account_no: entry.account_no,
                account_name: entry.account_name,
                balance: entry.balance,
                latest_recorded_date: entry.latest_recorded_date
            }])
        }))

        const handleButtonDown = (event: KeyboardEvent) => {
            if (event.key == 'Escape') {
                resetAllValues()
                setExportDialogue(false)
            }
        }
        document.addEventListener('keydown', handleButtonDown)
        return () => {
            document.removeEventListener('keydown', handleButtonDown)
        }
    }, [userId, exportDialogue])

    return (
        transactionEntry && accountEntry && <div>
            <button className='border border-black mx-3 py-2 px-3 rounded-lg hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition'
                onClick={() => setExportDialogue(true)}>
                Export
            </button>
            {exportDialogue &&
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg px-8 max-w-5/6 w-full z-60 py-5 max-h-[90vh] overflow-auto">
                        <div className="flex flex-row justify-between">
                            <p className="text-2xl">Export</p>
                            <label className="text-sm flex flex-row space-x-2 py-1">
                                <p>Use filtered data</p>
                                <input id='filterCheck' checked={useFiltered} onChange={() => setUsingFiltered(!useFiltered)} type="checkbox" />
                            </label>
                        </div>
                        <button
                            className={`px-4 py-2 border-b-2 ${activeTab === 'account'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-blue-600'
                                }`}
                            onClick={() => setActiveTab('account')}
                        >
                            Accounts
                        </button>
                        <button
                            className={`px-4 py-2 border-b-2 ${activeTab === 'transaction'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-blue-600'
                                }`}
                            onClick={() => setActiveTab('transaction')}
                        >
                            Transactions
                        </button>
                        {activeTab === 'account' ?
                            <ExportTable
                                table={'account'}
                                data={!useFiltered ? accountEntry : filteredAccountEntry}
                                dataHeader={EXPORTACCOUNTHEADER}
                            /> :
                            <ExportTable
                                table={'transaction'}
                                data={!useFiltered ? transactionEntry : filteredTransactionEntry}
                                dataHeader={EXPORTTRANSACTIONHEADER}
                            />
                        }
                        <div className="flex justify-end">
                            <button
                                onClick={() => setExportDialogue(false)}
                                className="border border-black mt-4 mx-4 p-1 rounded text-base flex justify-end hover:bg-gray-400 hover:cursor-pointer active:bg-gray-600 active:scale-95 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={exportToFile}
                                className="border disabled:border-gray-400 disabled:text-gray-400 border-black mt-4 p-1 rounded text-base flex justify-end not-disabled:hover:bg-gray-400 not-disabled:hover:cursor-pointer not-disabled:active:bg-gray-600 not-disabled:active:scale-95 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}