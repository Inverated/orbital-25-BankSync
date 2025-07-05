import { Account, Transaction } from "@/utils/types"
import { useEffect, useRef, useState } from "react"
import ExportTable from "./ExportTable"
import { exportToXlsx, exportToPdf, downloadBlob, passwordProtect } from "@/utils/downloadFile"
import { ChevronDown, ChevronUp } from "lucide-react"
import { getAccountDetails, getTransactionDetails } from "@/lib/databaseQuery"
import { useDatabase } from "@/context/DatabaseContext"


export default function ExportButton({ filteredAccount, filteredTransaction }: { filteredAccount: Account[], filteredTransaction: Transaction[] }) {
    const [exportDialogue, setExportDialogue] = useState(false)
    const [transactionEntry, setTransaction] = useState<Transaction[]>([])
    const [accountEntry, setAccount] = useState<Account[]>([])

    const [filteredTransactionEntry, setFilteredTransaction] = useState<Transaction[]>([])
    const [filteredAccountEntry, setFilteredAccount] = useState<Account[]>([])

    const [useFiltered, setUsingFiltered] = useState(false)

    const EXPORTACCOUNTHEADER = ['Bank Name', 'Account No', 'Account Name', 'Balance', 'Last Recorded Date']
    const EXPORTTRANSACTIONHEADER = ['Transaction Date', 'Description', 'Deposit', 'Withdrawal', 'Category', 'Ending Balance', 'Account No']
    const EXPORTOPTIONS = ['EXCEL', 'PDF'] as const
    const [exportType, setExporttype] = useState<typeof EXPORTOPTIONS[number]>('EXCEL')
    const [showTypeDropdown, setShowTypeDropdown] = useState(false)

    const [networkError, setNetworkError] = useState(false)
    const [downloadSuccess, setDownloadSuccess] = useState(false)

    const passwordRef = useRef<HTMLInputElement>(null)
    const [activeTab, setActiveTab] = useState<'account' | 'transaction'>('account')

    const exportToFile = async () => {
        let blob: Blob | null = null
        if (exportType == 'EXCEL') {
            if (useFiltered) {
                blob = await exportToXlsx(filteredAccountEntry, filteredTransactionEntry)
            } else {
                blob = await exportToXlsx(accountEntry, transactionEntry)
            }
        } else if (exportType == 'PDF') {
            if (useFiltered) {
                blob = await exportToPdf(filteredAccountEntry, filteredTransactionEntry, EXPORTACCOUNTHEADER, EXPORTTRANSACTIONHEADER)
            } else {
                blob = await exportToPdf(accountEntry, transactionEntry, EXPORTACCOUNTHEADER, EXPORTTRANSACTIONHEADER)
            }
        }
        if (blob) {
            setNetworkError(false)
            if (passwordRef.current?.value) {
                const response = await passwordProtect(blob, exportType, passwordRef.current.value)
                if (response?.status == 200 && response.data) {
                    if (exportType == 'EXCEL') {
                        downloadBlob(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
                    } else if (exportType == 'PDF') {
                        downloadBlob(new Blob([response.data], { type: 'application/pdf' }))
                    }
                } else if (response?.status == 404) {
                    setNetworkError(true)
                    downloadBlob(blob)
                }
            } else {
                downloadBlob(blob)
            }
            setDownloadSuccess(true)
        }
    }

    const resetAllValues = () => {
        setFilteredAccount([])
        setFilteredAccount([])
        setTransaction([])
        setAccount([])
        setNetworkError(false)
        setActiveTab('account')
    }

    const updateExportType = (type: typeof EXPORTOPTIONS[number]) => {
        setExporttype(type)
        setShowTypeDropdown(false)
    }

    const { accounts, transactions } = useDatabase()

    useEffect(() => {
        resetAllValues()
        setFilteredTransaction(filteredTransaction)
        setFilteredAccount(filteredAccount)

        const accArray: Account[] = getAccountDetails({
            accounts: accounts
        })

        const transArray: Transaction[] = getTransactionDetails({
            transactions: transactions
        })

        transArray.forEach(entry => {
            setTransaction(prev => [...prev, {
                transaction_date: entry.transaction_date,
                transaction_description: entry.transaction_description,
                category: entry.category,
                withdrawal_amount: entry.withdrawal_amount,
                deposit_amount: entry.deposit_amount,
                ending_balance: entry.ending_balance,
                account_no: entry.account_no,
            }])
        })

        accArray.forEach(entry => {
            setAccount(prev => [...prev, {
                bank_name: entry.bank_name,
                account_no: entry.account_no,
                account_name: entry.account_name,
                balance: entry.balance,
                latest_recorded_date: entry.latest_recorded_date
            }])
        })

        const handleButtonDown = (event: KeyboardEvent) => {
            if (event.key == 'Escape') {
                resetAllValues()
                setExportDialogue(false)
            }
        }
        const handleClick = (event: MouseEvent) => {
            if (!(event.target && document.getElementById('exportType')?.contains(event.target as Node))) {
                setShowTypeDropdown(false)
            }
        }

        document.addEventListener('click', handleClick)
        document.addEventListener('keydown', handleButtonDown)
        return () => {
            document.removeEventListener('keydown', handleButtonDown)
            document.removeEventListener('click', handleClick)
        }
    }, [exportDialogue, accounts, transactions])

    return (
        transactionEntry && accountEntry && <div>
            <button className='border-b py-0.5 hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition'
                onClick={() => setExportDialogue(true)}>
                <label className="text-base">Export</label>
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
                        <div className="text-sm flex pt-3 pb-1 space-x-2 justify-between">
                            <div className="flex flex-col">
                                <div>
                                    <b>Password: </b>
                                    <input type="text" placeholder="Enter password for encryption" ref={passwordRef} className="placeholder:left-0 placeholder:text-xs pl-1 border rounded-sm w-fit"></input>
                                </div>
                                <div hidden={!networkError} className="text-sm text-red-500">
                                    Network error, unable to encrypt with password
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="flex flex-col text-sm scale-90" id="exportType">

                                <button
                                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                    className="hover:bg-gray-300 focus:outline-none font-medium bg-white border-b-2 mx-2 p-1 text-center inline-flex justify-between" type="button">
                                    {exportType}
                                    <div>
                                        <div className="absolute inset-0 z-1"></div>
                                        {showTypeDropdown ? <ChevronUp /> : <ChevronDown />}
                                    </div>
                                </button>
                                <div hidden={!showTypeDropdown} className="absolute self-center z-5 bg-white rounded-sm">
                                    {EXPORTOPTIONS.map((type, index) =>
                                        <ul key={index}
                                            className="hover:bg-gray-300 text-center py-2 px-4 focus:outline-none"
                                            onClick={() => updateExportType(type)}>
                                            <label>
                                                <button key={index} hidden={type == exportType} />
                                                {type}
                                            </label>
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setExportDialogue(false)}
                                className="border border-black mx-4 p-1 rounded text-base flex justify-end hover:bg-gray-400 hover:cursor-pointer active:bg-gray-600 active:scale-95 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={exportToFile}
                                className="border disabled:border-gray-400 disabled:text-gray-400 border-black p-1 rounded text-base flex justify-end not-disabled:hover:bg-gray-400 not-disabled:hover:cursor-pointer not-disabled:active:bg-gray-600 not-disabled:active:scale-95 transition"
                            >
                                Confirm
                            </button>
                        </div>
                        <div hidden={!downloadSuccess} className="text-sm text-green-500 flex justify-end">
                            Download successful
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}