import { AccountDetails, TransactionDetails, getAccountDetails, getTransactionDetails } from "@/lib/databaseQuery";
import { useCallback, useEffect, useRef, useState } from "react";
import { Account, Transaction } from "@/utils/types";
import FilterButton from "./FilterButton";
import ExportButton from "./ExportButton";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useUserId } from "@/context/UserContext";
import { Dayjs } from "dayjs";
import { useDatabase } from "@/context/DatabaseContext";
import TransactionRow from "./TransactionRow";

type AccountMap = {
    [account_no: string]: {
        account_name: string;
        bank_name: string;
    }
}

export default function Transactions() {
    const NUMBER_OF_ENTRIES_PER_PAGE = 10
    const userId = useUserId()

    const { accounts, transactions } = useDatabase()

    const [isAscending, setIsAscending] = useState(false)
    const [transFilterCondition, setTransFilterCondition] = useState<TransactionDetails>({ transactions: transactions, ascending_date: isAscending })
    const [accFilterCondition, setAccFilterCondition] = useState<AccountDetails>({ accounts: accounts })

    const [transactionEntry, setTransactionEntry] = useState<Transaction[]>([])
    const [accountEntry, setAccountEntry] = useState<Account[]>([])
    const [uniqueCategory, setUniqueCategory] = useState<Set<string>>(new Set())
    const currAccounts: AccountMap = {}

    // useState to update html and useRef to get the latest value to run in function
    const pageNoRef = useRef<HTMLInputElement>(null)
    const currPageRef = useRef(1)
    const [totalEntries, setTotalEntries] = useState(0)
    const [pageNo, setPageNo] = useState(1)
    const maxPageNo = useRef(Math.ceil(transactionEntry.length / 10))
    const [selPageDialogue, setSelPageDialogue] = useState(false)

    const resetAllValues = () => {
        transFilterCondition.transactions = transactions
        accFilterCondition.accounts = accounts
        setTransactionEntry([])
        setAccountEntry([])
        currPageRef.current = 1
        setPageNo(1)
        setUniqueCategory(new Set())
    }

    const addPageNo = (num: number) => {
        const newNum = currPageRef.current + num
        if (newNum > maxPageNo.current) {
            currPageRef.current = maxPageNo.current
            setPageNo(maxPageNo.current)
        } else if (newNum < 1) {
            currPageRef.current = 1
            setPageNo(1)
        } else {
            currPageRef.current = newNum
            setPageNo(newNum)
        }
    }

    const jumpToPage = () => {
        const userInput = Number(pageNoRef.current?.value)
        if (!userInput || userInput < 1) {
            currPageRef.current = 1
            setPageNo(1)
        } else if (userInput > maxPageNo.current) {
            currPageRef.current = maxPageNo.current
            setPageNo(maxPageNo.current)
        } else {
            currPageRef.current = userInput
            setPageNo(userInput)
        }
        setSelPageDialogue(false)
    }

    const handleButtonDown = (event: KeyboardEvent) => {
        if (event.key == 'Escape') {
            setSelPageDialogue(false)
        } else if (event.key == 'Enter') {
            jumpToPage()
        } else if (event.key == 'ArrowRight') {
            addPageNo(1)
        } else if (event.key == 'ArrowLeft') {
            addPageNo(-1)
        }
    }

    const handleFilterQuery = useCallback((accountSelection: string[], categorySelection: string[], ascendingSelection: boolean,
        date: { startDate: Dayjs | null, endDate: Dayjs | null } | null) => {
        const transConditionFilter: { key: keyof Transaction, value: string[] }[] = []
        const transactionFilter: TransactionDetails = { transactions, ascending_date: ascendingSelection }
        const accountFilter: AccountDetails = { accounts }
        setIsAscending(ascendingSelection)

        if (accountSelection.length != 0) {
            transConditionFilter.push({ key: 'account_no', value: accountSelection })
            accountFilter.condition = [{ key: 'account_no', value: accountSelection }]
        }
        if (categorySelection.length != 0) {
            transConditionFilter.push({ key: 'category', value: categorySelection })
        }

        if (transConditionFilter.length != 0) {
            transactionFilter.condition = transConditionFilter
        }
        if (date) {
            transactionFilter.date = date
        }
        setAccFilterCondition(accountFilter)
        setTransFilterCondition(transactionFilter)
        setPageNo(1)
    }, [])

    useEffect(() => {
        resetAllValues()
        pageNoRef.current = document.getElementById('select_page_num') as HTMLInputElement
        const transArray: Transaction[] = getTransactionDetails(transFilterCondition)
        const accArray: Account[] = getAccountDetails(accFilterCondition)

        accArray.forEach(entry => {
            currAccounts[entry.account_no] = {
                account_name: entry.account_name,
                bank_name: entry.bank_name
            }
            setAccountEntry(prev => {
                if (prev.filter(e => e.account_no == entry.account_no).length == 0) {
                    return [...prev, {
                        user_id: userId,
                        bank_name: entry.bank_name,
                        account_no: entry.account_no,
                        account_name: entry.account_name,
                        balance: entry.balance,
                        latest_recorded_date: entry.latest_recorded_date
                    }]
                } else {
                    return prev
                }
            })
        })

        maxPageNo.current = (Math.ceil(transArray.length / 10))
        setTotalEntries(transArray.length)

        transArray.forEach(entry => {
            if (entry.category) {
                setUniqueCategory(uniqueCategory.add(entry.category))
            }
            setTransactionEntry(prev =>
                [...prev, {
                    id: entry.id,
                    user_id: userId,
                    transaction_description: entry.transaction_description,
                    account_no: entry.account_no,
                    withdrawal_amount: entry.withdrawal_amount,
                    deposit_amount: entry.deposit_amount,
                    category: entry.category,
                    transaction_date: entry.transaction_date,
                    ending_balance: entry.ending_balance,
                    account_name: currAccounts[entry.account_no] ? currAccounts[entry.account_no].account_name : '',
                    bank_name: currAccounts[entry.account_no] ? currAccounts[entry.account_no].bank_name : '',
                }])
        })

        document.getElementById('load_transaction_data')?.classList.remove('hidden')

        document.addEventListener('keydown', handleButtonDown)
        return () => {
            document.removeEventListener('keydown', handleButtonDown)
        }
    }, [userId, transFilterCondition, accounts, transactions])

    const buttonStyle = "bg-transparent hover:bg-gray-200 active:bg-gray-300 active:scale-95 rounded-lg font-sans font-semibold tracking-widest border px-3 py-2 transition cursor-pointer" as const

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="lg:w-3/4 md:w-3/4 not-lg:w-6/7">
                <div className="flex justify-end space-x-4 mx-4">
                    <ExportButton
                        filteredAccount={accountEntry}
                        filteredTransaction={transactionEntry} />
                    <FilterButton
                        setFilter={handleFilterQuery} />
                </div>

                <div id='load_transaction_data' className='hidden'>
                    {
                        transactionEntry.slice(
                            (pageNo - 1) * NUMBER_OF_ENTRIES_PER_PAGE,
                            Math.min(totalEntries, pageNo * NUMBER_OF_ENTRIES_PER_PAGE)
                        )
                            .map((entry) =>
                                <TransactionRow
                                    key={entry.id}
                                    details={{ ...entry }}
                                    uniqueCategory={[...uniqueCategory]} />
                            )}
                    <div className='my-6 flex items-center justify-center'>
                        <ChevronsLeft className='hover:cursor-pointer' onClick={() => addPageNo(-10)} />
                        <ChevronLeft className='hover:cursor-pointer' onClick={() => addPageNo(-1)} />
                        <button className='px-5 hover:cursor-pointer' onClick={() => setSelPageDialogue(true)}>
                            {pageNo} of {maxPageNo.current}
                        </button>
                        <ChevronRight className='hover:cursor-pointer' onClick={() => addPageNo(1)} />
                        <ChevronsRight className='hover:cursor-pointer' onClick={() => addPageNo(10)} />
                    </div>
                </div>

                {selPageDialogue &&
                    <div className='fixed inset-0 flex justify-center items-center z-50'>
                        <div className='absolute inset-0 bg-black opacity-50'></div>
                        <div className='bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full z-10'>
                            <p className='text-xl font-semibold'>Select a page number</p>
                            <div className='flex justify-center items-center my-7'>
                                <input
                                    id='select_page_num'
                                    className='w-[40px] mx-1'
                                    type='number'
                                    min='1' max={maxPageNo.current}
                                    defaultValue={currPageRef.current}
                                    ref={pageNoRef} />
                                <span>of {maxPageNo.current}</span>
                            </div>
                            <div className='flex justify-end gap-4'>
                                <button onClick={() => setSelPageDialogue(false)}
                                    className={buttonStyle}>
                                    Close
                                </button>
                                <button onClick={jumpToPage}
                                    className={buttonStyle}>
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
