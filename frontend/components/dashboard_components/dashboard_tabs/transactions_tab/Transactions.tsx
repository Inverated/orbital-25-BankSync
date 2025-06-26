import { getAccountDetails, getTransactionDetail } from "@/lib/supabase_query";
import { useEffect, useState } from "react";
import Transaction_Row from "./Transaction_Row";
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Transaction } from "@/utils/types";

export default function Transactions() {
    const NUMBER_OF_ENTRIES_PER_PAGE = 10

    const [transactionEntry, setEntry] = useState<Partial<Transaction>[]>([])
    const [uniqueCategory, setUnique] = useState<Set<string>>(new Set())

    const handleButtonDown = (event: KeyboardEvent) => {
        if (event.key == 'Escape') {
            setPageDialogue(false)
        } else if (event.key == 'Enter') {
            jumpToPage()
        }
    }

    useEffect(() => {
        type AccountDetails = {
            [account_no: string]: {
                account_name: string;
                bank_name: string;
            }
        }
        const accounts: AccountDetails = {}
        getAccountDetails().then(arr => {
            arr.forEach(entry => {
                accounts[entry.account_no] = {
                    account_name: entry.account_name,
                    bank_name: entry.bank_name
                }
            })
        }).then(() =>
            getTransactionDetail().then(arr => {
                arr.forEach(entry => {
                    setUnique(uniqueCategory.add(entry.category))
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
                            account_name: accounts[entry.account_no].account_name,
                            bank_name: accounts[entry.account_no].bank_name
                        }])
                })
            }))

        document.getElementById('load_transaction_data')?.classList.remove('hidden')

        document.addEventListener('keydown', handleButtonDown)
        return () => {
            document.removeEventListener('keydown', handleButtonDown)
        }
    }, [])

    const [pageNo, setPage] = useState(1)
    const maxPageNo = Math.ceil(transactionEntry.length / 10)

    const addPageNo = (num: number) => {
        const newNum = pageNo + num
        if (newNum > maxPageNo) {
            setPage(maxPageNo)
        } else if (newNum < 1) {
            setPage(1)
        } else {
            setPage(newNum)
        }
    }

    const [selPageDialogue, setPageDialogue] = useState(false)
    const jumpToPage = () => {
        const inputBox = document.getElementById('select_page_num') as HTMLInputElement
        if (!inputBox) return
        const userInput = Number(inputBox.value)

        if (!userInput || userInput < 1) {
            setPage(1)
        } else if (userInput > maxPageNo) {
            setPage(maxPageNo)
        } else {
            setPage(userInput)
        }
        setPageDialogue(false)
    }

    const buttonStyle = 'border border-black mx-3 py-2 px-3 rounded-lg hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition ' as const

    return (
        <div>
            <div className='text-2xl flex justify-between'>
                <p className='p-4'>All Transactions</p>
                <div>
                    <button className={buttonStyle}>Export</button>
                    <button className={buttonStyle}>Filter</button>
                </div>
            </div>
            <div id='load_transaction_data' className='hidden'>
                {
                    transactionEntry.slice(
                        (pageNo - 1) * NUMBER_OF_ENTRIES_PER_PAGE,
                        pageNo * NUMBER_OF_ENTRIES_PER_PAGE
                    )
                        // Unable to extract you the index
                        .map(entry =>
                            <Transaction_Row
                                key={entry.id}
                                details={{ ...entry }}
                                uniqueCategory={[...uniqueCategory]} />
                        )}
                <div className='my-10 flex items-center justify-center'>
                    <ChevronsLeft className='hover:cursor-pointer' onClick={() => addPageNo(-10)} />
                    <ChevronLeft className='hover:cursor-pointer' onClick={() => addPageNo(-1)} />
                    <div className='px-5 hover:cursor-pointer' onClick={() => setPageDialogue(true)}>
                        {pageNo} of {maxPageNo}
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
                                min='1' max={maxPageNo}
                                defaultValue={pageNo} />
                            <span>of {maxPageNo}</span>
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