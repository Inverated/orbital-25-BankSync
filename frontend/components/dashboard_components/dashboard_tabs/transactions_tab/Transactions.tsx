import { getAccountDetails, getTransactionDetails } from "@/lib/supabase_query";
import { useCallback, useEffect, useRef, useState } from "react";
import Transaction_Row from "./Transaction_Row";
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Transaction } from "@/utils/types";
import FilterButton from "./FilterButton";
import ExportButton from "./ExportButton";
import { useUserId } from "@/context/UserContext";

export default function Transactions() {
    const NUMBER_OF_ENTRIES_PER_PAGE = 10

    const [filterCondiction, setFilterCondition] = useState<{ key: keyof Transaction, value: string[] }[] | undefined>(undefined)
    const [isAscending, setIsAscending] = useState(false)

    const [transactionEntry, setEntry] = useState<Partial<Transaction>[]>([])
    const [uniqueCategory, setUnique] = useState<Set<string>>(new Set())

    const pageNoRef = useRef<HTMLInputElement>(null)
    // useState to update html and useRef to get the latest value to run in function
    const currPageRef = useRef(1)
    const [totalEntries, setTotalEntries] = useState(0)
    const [pageNo, setPageNo] = useState(1)
    const maxPageNo = useRef(Math.ceil(transactionEntry.length / 10))

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

    const [selPageDialogue, setPageDialogue] = useState(false)
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
        setPageDialogue(false)
    }

    const handleButtonDown = (event: KeyboardEvent) => {
        if (event.key == 'Escape') {
            setPageDialogue(false)
        } else if (event.key == 'Enter') {
            jumpToPage()
        } else if (event.key == 'ArrowRight') {
            addPageNo(1)
        } else if (event.key == 'ArrowLeft') {
            addPageNo(-1)
        }
    }
    const handleFilterQuery = useCallback((accountSelection: string[], categorySelection: string[], ascendingSelection: boolean) => {
        setIsAscending(ascendingSelection)
        const filter: { key: keyof Transaction, value: string[] }[] = []
        if (accountSelection.length != 0) {
            filter.push({ key: 'account_no', value: accountSelection })
        }
        if (categorySelection.length != 0) {
            filter.push({ key: 'category', value: categorySelection })
        }
        if (filter.length == 0) {
            setFilterCondition(undefined)
        } else {
            setFilterCondition(filter)
        }
        setPageNo(1)
    }, [])

    const userId = useUserId();

    useEffect(() => {
        setEntry([])
        currPageRef.current = 1
        setUnique(new Set())
        pageNoRef.current = document.getElementById('select_page_num') as HTMLInputElement
        type AccountDetails = {
            [account_no: string]: {
                account_name: string;
                bank_name: string;
            }
        }

        const accounts: AccountDetails = {}
        getAccountDetails(userId).then(arr => {
            arr.forEach(entry => {
                accounts[entry.account_no] = {
                    account_name: entry.account_name,
                    bank_name: entry.bank_name
                }

            })
        }).then(() =>
            getTransactionDetails(userId, [], filterCondiction, isAscending).then(arr => {
                maxPageNo.current = (Math.ceil(arr.length / 10))
                setTotalEntries(arr.length)
                arr.forEach(entry => {
                    if (entry.category) {
                        setUnique(uniqueCategory.add(entry.category))
                    }
                    setEntry(prev =>
                        [...prev, {
                            id: entry.id,
                            transaction_description: entry.transaction_description,
                            account_no: entry.account_no,
                            withdrawal_amount: entry.withdrawal_amount,
                            deposit_amount: entry.deposit_amount,
                            category: entry.category,
                            transaction_date: entry.transaction_date,
                            ending_balance: entry.ending_balance,
                            account_name: entry.account_no ? accounts[entry.account_no].account_name : '',
                            bank_name: entry.account_no ? accounts[entry.account_no].bank_name : ''
                        }])
                })
            }))

        document.getElementById('load_transaction_data')?.classList.remove('hidden')

        document.addEventListener('keydown', handleButtonDown)
        return () => {
            document.removeEventListener('keydown', handleButtonDown)
        }
    }, [filterCondiction, isAscending])

    const buttonStyle = 'border border-black mx-3 py-2 px-3 rounded-lg hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition ' as const

    return (
        <div>
            <div className='text-2xl flex justify-between'>
                <p className='p-4'>All Transactions</p>
                <div className=" flex justify-between">
                    <ExportButton />
                    <FilterButton
                        setFilter={handleFilterQuery} />
                </div>
            </div>
            <div id='load_transaction_data' className='hidden'>
                {
                    transactionEntry.slice(
                        (pageNo - 1) * NUMBER_OF_ENTRIES_PER_PAGE,
                        Math.min(totalEntries , pageNo * NUMBER_OF_ENTRIES_PER_PAGE)
                    )
                        .map((entry) =>
                            <Transaction_Row
                                key={entry.id}
                                details={{ ...entry }}
                                uniqueCategory={[...uniqueCategory]} />
                        )}
                <div className='my-10 flex items-center justify-center'>
                    <ChevronsLeft className='hover:cursor-pointer' onClick={() => addPageNo(-10)} />
                    <ChevronLeft className='hover:cursor-pointer' onClick={() => addPageNo(-1)} />
                    <div className='px-5 hover:cursor-pointer' onClick={() => setPageDialogue(true)}>
                        {pageNo} of {maxPageNo.current}
                    </div>
                    <ChevronRight className='hover:cursor-pointer' onClick={() => addPageNo(1)} />
                    <ChevronsRight className='hover:cursor-pointer' onClick={() => addPageNo(10)} />
                </div>
            </div>

            {selPageDialogue &&
                <div className='fixed inset-0 flex justify-center items-center z-50'>
                    <div className='absolute inset-0 bg-black opacity-50'></div>
                    <div className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full z-10'>
                        <p className='text-xl font-semibold'>Select page number</p>
                        <div className='flex justify-center items-center my-7'>
                            <input
                                id='select_page_num'
                                className='border border-black w-[40px] mx-1'
                                type='number'
                                min='1' max={maxPageNo.current}
                                defaultValue={currPageRef.current}
                                ref={pageNoRef} />
                            <span>of {maxPageNo.current}</span>
                        </div>
                        <div className='flex justify-end'>
                            <button onClick={() => setPageDialogue(false)}
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

    )
}