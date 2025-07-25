import { Account, Transaction } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import { updateTransactionDetails } from "@/lib/supabaseUpdate";
import { useDatabase } from "@/context/DatabaseContext";
import { useUserId } from "@/context/UserContext";
import { supabase } from "@/lib/supabase";

type uniqueCategory = string[]
type arguements = { details: Transaction & Partial<Account>, uniqueCategory: uniqueCategory }

export default function TransactionRow({ details, uniqueCategory }: arguements) {
    // Handle persistent expanded row display when shift pressed or long click
    const HOLD_DELAY_TO_PERSIST = 200;
    const [isRowExpanded, setIsRowExpanded] = useState(false);
    const refIsRowExpanded = useRef(false);
    const isShiftPressed = useRef(false);
    const expandedRow = useRef<HTMLDivElement>(null)

    const clickStartTime = useRef<number | null>(null);

    const userId = useUserId()
    const { refreshDatabase, loaded } = useDatabase()

    const updateExpandStatus = (isExpanded: boolean) => {
        setShowEditDialogue(isExpanded)
        refIsRowExpanded.current = isExpanded
        setIsRowExpanded(isExpanded)
    }

    useEffect(() => {
        const handleButtonDown = (event: KeyboardEvent) => {
            if (event.key == 'Shift') {
                isShiftPressed.current = true
            } else if (event.key == 'Escape') {
                // Collapse all row when pressed
                updateExpandStatus(false)
            } else if (event.key == 'Enter') {
                event.preventDefault()
                document.getElementById('submitButton')?.click()
            }
        }

        const handleButtonUp = (event: KeyboardEvent) => {
            if (event.key == 'Shift') {
                isShiftPressed.current = false
            }
        }

        const handleMouseDown = () => {
            clickStartTime.current = Date.now();
        };

        const handleMouseUp = (event: MouseEvent) => {
            let duration = null
            if (clickStartTime.current) {
                duration = Date.now() - clickStartTime.current
            }

            const currentElement = document.getElementById(String(details.id))
            const cursorAt = event.target as Node

            const isClickedOnExpandedElement = expandedRow.current?.contains(cursorAt)
            const isAlreadyExpanded = refIsRowExpanded.current
            const isLongPress = duration && duration > HOLD_DELAY_TO_PERSIST
            const isClickedOnCurrentRow = currentElement?.contains(cursorAt)

            if (isClickedOnExpandedElement) {
                // Does nothing if click on an expanded row
            } else if (isAlreadyExpanded && isLongPress) {
                // If current row is already expanded, and is long click then do nothing
            } else if (isClickedOnCurrentRow) {
                // Expand any row when clicked on
                currentElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                refIsRowExpanded.current = true
                setIsRowExpanded(true)
            } else if (!isShiftPressed.current) {
                // Collapse everything else if shift not pressed
                updateExpandStatus(false)
            }
            clickStartTime.current = null;
        }

        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('keydown', handleButtonDown)
        document.addEventListener('keyup', handleButtonUp)
        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('keydown', handleButtonDown)
            document.removeEventListener('keyup', handleButtonUp)
        }
    }, [details.id])

    // Handle edit dialogue display
    const [showEditDialogue, setShowEditDialogue] = useState(false)
    const [existingCat, setCat] = useState(details.category)
    const [customCat, setCustomCat] = useState('')
    const [selectedCat, setSelectedCat] = useState('')

    const customCategoryRef = useRef<HTMLInputElement>(null)

    const updateTransaction = async (key: keyof Transaction, newValue: string) => {
        if (newValue == '') {
            return
        }
        if (details[key] == newValue) {
            setShowEditDialogue(false)
            return
        }
        const currTransaction: Transaction = {
            id: details.id,
            transaction_date: details.transaction_date,
            transaction_description: details.transaction_description,
            withdrawal_amount: details.withdrawal_amount,
            deposit_amount: details.deposit_amount,
            account_no: details.account_no,
            category: details.category,
            ending_balance: details.ending_balance
        }

        const newTransaction = { ...currTransaction, [key]: newValue }
        if (currTransaction.id) {
            await updateTransactionDetails(userId, currTransaction.id, newTransaction)
                .then(() => {
                    refreshDatabase()
                })
        }
    }

    const deleteTransaction = async () => {
        if (details.id) {
            const { error } = await supabase.from('encryptedTransactionDetails')
                .delete()
                .eq('user_id', userId)
                .eq('id', details.id)
            if (error) {
                console.error(error.message)
            } else {
                setShowEditDialogue(false)
                refreshDatabase()
            }
        }
    }

    useEffect(() => {
        if (loaded) setShowEditDialogue(false)
    }, [loaded])

    const buttonStyle = 'mx-2 my-1 py-2 px-3 rounded-lg hover:cursor-pointer bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-97 text-white font-semibold tracking-wide transition' as const
    
    return (
        <div>
            {/* Collapsed transaction row */}
            {!isRowExpanded ?
                <div id={String(details.id)} className='flex flex-col justify-between m-3 p-1.5 hover:cursor-pointer hover:bg-gradient-to-t hover:from-gray-300 hover:via-gray-200 hover:to-gray-300 active:bg-gray-500 active:scale-97 transition-all border-gray-300 border-2 rounded-lg'>
                    <div>
                        <p className='p-3 truncate break-after-all'>{details.transaction_description}</p>
                    </div>
                    <div className={'p-3 flex justify-between'}>
                        <p>{details.account_name ? details.account_name : 'Unknown Account'}</p>
                        <p className={details.withdrawal_amount == 0 ? "text-green-500" : "text-red-500"}>
                            {details.withdrawal_amount == 0 ? '+$' + details.deposit_amount?.toFixed(2) : '-$' + details.withdrawal_amount?.toFixed(2)}
                        </p>
                    </div>
                    <div className='p-3 flex justify-between'>
                        <p>
                            {details.category}
                        </p>
                        <p>
                            {details.transaction_date}
                        </p>
                    </div>
                </div>
                :
                <div ref={expandedRow} className='border border-gray-300 border-2 rounded-lg m-4 transition'>
                    {/* Expanded transaction row */}
                    <div className='flex flex-col p-2'>
                        <p className='flex p-3 start-0.5'>
                            <b>Description:</b>
                            <span className='px-2 whitespace-pre-line break-all'>
                                {details.transaction_description}
                            </span>
                        </p>
                        <div className="flex justify-between">
                            <p className='p-2 flex'>
                                <b>{details.account_name ? details.account_name + ': ' : 'Account No: '}&nbsp;</b>{details.account_no}
                            </p>
                            {details.bank_name && <div className="flex mx-2">
                                <b>Bank: &nbsp;</b><p>{details.bank_name}</p>
                            </div>}
                        </div>

                        <div className="flex justify-between">
                            <div className='p-2 flex'>
                                <b>Transaction amount: &nbsp;</b>
                                <p className={details.withdrawal_amount == 0 ? "text-green-500" : "text-red-500"}>
                                    {details.withdrawal_amount == 0 ? '+$' + details.deposit_amount?.toFixed(2) : '-$' + details.withdrawal_amount?.toFixed(2)}
                                </p>
                            </div>
                            <div className="flex mx-2">
                                <b>Ending Balance: &nbsp;</b><p>${details.ending_balance?.toFixed(2)}</p>
                            </div>
                        </div>
                        <p className='p-2 flex'>
                            <b>Transaction date: &nbsp;</b>{details.transaction_date}
                        </p>
                        <p className='p-2 flex'>
                            <b>Category: &nbsp;</b>{!showEditDialogue && details.category}
                        </p>
                        {
                            showEditDialogue &&
                            <div className='flex flex-col mx-2 py-2 px-3 border border-gray-300 border-2 rounded-xl not-sm:w-5/6 sm:w-2/5'>
                                <label className='flex justify-between py-1' htmlFor="existingRadio">
                                    <div>
                                        Select: <select className="p-1 ml-4 mr-3 h-7"
                                            name="existingCategory"
                                            defaultValue={details.category}
                                            onFocus={(e) => {
                                                setCat(e.target.value)
                                                setSelectedCat(e.target.value)
                                                const el = document.getElementById('existingRadio') as HTMLInputElement
                                                el.checked = true
                                            }}
                                            onChange={(e) => {
                                                setCat(e.target.value)
                                                setSelectedCat(e.target.value)
                                            }}>
                                            {uniqueCategory.map((cat =>
                                                <option value={cat} key={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <input
                                        id="existingRadio"
                                        name={String(details.id)}
                                        defaultChecked
                                        onClick={() => setSelectedCat(existingCat)}
                                        type='radio' />
                                </label>

                                {/* Custom category */}
                                <label className='flex justify-between py-1' htmlFor='categoryRadio'>
                                    <div>
                                        Custom:<input
                                            name="customCategory"
                                            type='text'
                                            className='border-b border-gray-300 p-2 ml-2 h-7 w-1/2'
                                            ref={customCategoryRef}
                                            placeholder='Custom category'
                                            onFocus={(e) => {
                                                setCustomCat(e.target.value)
                                                setSelectedCat(e.target.value)
                                                const el = document.getElementById('categoryRadio') as HTMLInputElement
                                                el.checked = true
                                            }}
                                            onChange={(e) => {
                                                setCustomCat(e.target.value)
                                                setSelectedCat(e.target.value)
                                            }} />
                                    </div>
                                    <input
                                        id='categoryRadio'
                                        type='radio'
                                        name={String(details.id)}
                                        onClick={() => setSelectedCat(customCat)}
                                    />
                                </label>
                            </div>
                        }
                        <div className='p-2 flex justify-end'>
                            {showEditDialogue ?
                                <>
                                    <button
                                        id='submitButton'
                                        className={buttonStyle}
                                        onClick={deleteTransaction}>
                                        Delete
                                    </button>
                                    {/* Confirm and Cancel buttons when edit is active */}
                                    <button
                                        id='submitButton'
                                        className={buttonStyle}
                                        onClick={() => updateTransaction('category', selectedCat)}>
                                        Confirm
                                    </button>
                                    {/* Cancel statement bugging out, must include timeout*/}
                                    <button
                                        className={buttonStyle}
                                        onClick={() => {
                                            setTimeout(() => {
                                                setShowEditDialogue(false)
                                            }, 0)
                                        }}>
                                        Cancel
                                    </button>
                                </>
                                :
                                <>
                                    {/* Edit button when edit is inactive */}
                                    <button
                                        className={buttonStyle}
                                        onClick={() => {
                                            updateExpandStatus(true)
                                            setCat(details.category)
                                        }}>
                                        Edit
                                    </button>
                                </>
                            }
                            <button
                                className={buttonStyle}
                                onClick={() => updateExpandStatus(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}