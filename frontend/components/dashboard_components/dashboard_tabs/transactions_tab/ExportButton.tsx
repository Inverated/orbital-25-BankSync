import { Account, Transaction } from "@/utils/types"
import { useEffect, useRef, useState } from "react"
import ExportTable from "./ExportTable"
import { exportToXlsx, exportToPdf, downloadBlob, passwordProtect } from "@/utils/downloadFile"
import { ChevronDown, ChevronUp } from "lucide-react"
import { getAccountDetails, getTransactionDetails } from "@/lib/databaseQuery"
import { useDatabase } from "@/context/DatabaseContext"


export default function ExportButton({ filteredAccount, filteredTransaction }: { filteredAccount: Account[], filteredTransaction: Transaction[] }) {
    const [exportDialogue, setExportDialogue] = useState(false)
    const [transactionEntry, setTransactionEntry] = useState<Transaction[]>([])
    const [accountEntry, setAccountEntry] = useState<Account[]>([])

    const [filteredTransactionEntry, setFilteredTransactionEntry] = useState<Transaction[]>([])
    const [filteredAccountEntry, setFilteredAccountEntry] = useState<Account[]>([])

    const [useFiltered, setUseFiltered] = useState(false)

    const EXPORTACCOUNTHEADER = ['Bank Name', 'Account No', 'Account Name', 'Balance', 'Last Recorded Date']
    const EXPORTTRANSACTIONHEADER = ['Transaction Date', 'Description', 'Deposit', 'Withdrawal', 'Ending Balance', 'Category', 'Account No']
    const EXPORTOPTIONS = ['EXCEL', 'PDF'] as const
    const [exportType, setExportType] = useState<typeof EXPORTOPTIONS[number]>('EXCEL')
    const [showTypeDropdown, setShowTypeDropdown] = useState(false)

    const [networkError, setNetworkError] = useState(false)
    const [downloadSuccess, setDownloadSuccess] = useState(false)

    const passwordRef = useRef<HTMLInputElement>(null)
    const [activeTab, setActiveTab] = useState<'account' | 'transaction'>('account')

    const exportXlsxToBlob = async () => {
        if (useFiltered) {
            return await exportToXlsx(filteredAccountEntry, filteredTransactionEntry)
        } else {
            return await exportToXlsx(accountEntry, transactionEntry)
        }
    }

    const exportPdfToBlob = async () => {
        if (useFiltered) {
            return await exportToPdf(filteredAccountEntry, filteredTransactionEntry, EXPORTACCOUNTHEADER, EXPORTTRANSACTIONHEADER)
        } else {
            return await exportToPdf(accountEntry, transactionEntry, EXPORTACCOUNTHEADER, EXPORTTRANSACTIONHEADER)
        }
    }

    const exportToFile = async () => {
        setDownloadSuccess(false)
        let blob: Blob | null = null
        if (exportType == 'EXCEL') {
            blob = await exportXlsxToBlob()
        } else if (exportType == 'PDF') {
            blob = await exportPdfToBlob()
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
                    // Download even if cannot connect to backend to encrypt
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
        setFilteredAccountEntry([])
        setTransactionEntry([])
        setAccountEntry([])
        setNetworkError(false)
        setActiveTab('account')
    }

    const updateExportType = (type: typeof EXPORTOPTIONS[number]) => {
        setExportType(type)
        setShowTypeDropdown(false)
    }

    const { accounts, transactions } = useDatabase()

    useEffect(() => {
        resetAllValues()
        setFilteredTransactionEntry(filteredTransaction)
        setFilteredAccountEntry(filteredAccount)

        const accArray: Account[] = getAccountDetails({
            accounts: accounts
        })

        const transArray: Transaction[] = getTransactionDetails({
            transactions: transactions
        })

        transArray.forEach(entry => {
            setTransactionEntry(prev => [...prev, {
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
            setAccountEntry(prev => [...prev, {
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
            <button className="py-0.5 mt-3 mb-0.5 px-1 rounded-lg hover:cursor-pointer bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-97 text-white font-semibold tracking-wide transition"
                onClick={() => setExportDialogue(true)}>
                <div className="text-base p-2">Export</div>
            </button>
            {exportDialogue &&
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg px-9 max-w-5/6 w-full z-60 py-7 max-h-[90vh] overflow-auto">
                        <div className="flex flex-row justify-between">
                            <p className="text-2xl font-bold tracking-wide">Export</p>
                            <label className="flex flex-row space-x-2 py-1">
                                <p>Use filtered data</p>
                                <input id='filterCheck' checked={useFiltered} onChange={() => setUseFiltered(!useFiltered)} type="checkbox" />
                            </label>
                        </div>
                        <button
                            className={`px-4 py-2 mt-1 border-b-2 ${activeTab === 'account'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-green-600'
                                }`}
                            onClick={() => setActiveTab('account')}
                        >
                            Accounts
                        </button>
                        <button
                            className={`px-4 py-2 mt-1 border-b-2 ${activeTab === 'transaction'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-green-600'
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
                        <div className="text-sm flex pt-5 pb-1 space-x-2 justify-between">
                            <div className="flex flex-col">
                                <div>
                                    <b>Password: </b>
                                    <input
                                        name="exportPasswordInput"
                                        type="text"
                                        placeholder="Enter password for encryption"
                                        ref={passwordRef}
                                        className="placeholder:left-0 placeholder:text-xs pl-2 py-1 border rounded-sm w-fit" />
                                </div>
                                <div hidden={!networkError} className="text-sm text-red-500 mt-2">
                                    Network error, unable to encrypt with password
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-3">
                            <div className="flex flex-col text-sm scale-90" id="exportType">
                                <button
                                    name="exportTypeSelector"
                                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                    className="hover:bg-gray-200 focus:outline-none font-medium bg-white border-b-2 mx-1 p-2 gap-1 text-center inline-flex justify-between" type="button">
                                    {exportType}
                                    <div>
                                        <div className="absolute inset-0 z-1"></div>
                                        {showTypeDropdown ? <ChevronUp /> : <ChevronDown />}
                                    </div>
                                </button>
                                <div hidden={!showTypeDropdown} className="absolute self-center z-5 bg-white rounded-sm">
                                    {EXPORTOPTIONS.map((type, index) =>
                                        <ul key={index}
                                            className="hover:bg-gray-200 text-center py-2 px-4 focus:outline-none"
                                        >
                                            <label>
                                                <button hidden={type == exportType} onClick={() => updateExportType(type)} />
                                                {type}
                                            </label>
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setExportDialogue(false)}
                                className="bg-transparent hover:bg-gray-200 active:bg-gray-300 active:scale-95 rounded-lg font-sans font-semibold tracking-widest border px-3 py-2 transition cursor-pointer"
                            >
                                Close
                            </button>
                            <button
                                onClick={exportToFile}
                                className="bg-transparent border disabled:border-gray-300 disabled:text-gray-300 border-black px-3 py-2 rounded-lg font-sans font-semibold tracking-widest flex justify-end not-disabled:hover:bg-gray-200 not-disabled:hover:cursor-pointer not-disabled:active:bg-gray-300 not-disabled:active:scale-95 transition"
                            >
                                Confirm
                            </button>
                        </div>
                        <div hidden={!downloadSuccess} className="text-sm text-green-500 flex justify-end mt-3.5">
                            Download successful !
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}