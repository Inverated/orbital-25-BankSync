import { Transaction } from "@/components/types";
import { useEffect, useRef, useState } from "react";

type uniqueCategory = string[]
type arguements = { details: Partial<Transaction>, uniqueCategory: uniqueCategory }

export default function Transaction_Row({ details, uniqueCategory }: arguements) {
    // Handle persistent expanded row display when shift pressed or long click
    const HOLD_DELAY_TO_PERSIST = 200;
    const [isRowExpanded, updateRowExpandStatus] = useState(false);
    const refIsRowExpanded = useRef(false);
    const isShiftPressed = useRef(false);
    const expandedRow = useRef<HTMLDivElement>(null);

    const clickStartTime = useRef<number | null>(null);

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

        const isClickedOnExpandedElement = expandedRow.current && expandedRow.current.contains(cursorAt)
        const isAlreadyExpanded = refIsRowExpanded.current
        const isLongPress = duration && duration > HOLD_DELAY_TO_PERSIST
        const isClickedOnCurrentRow = currentElement && currentElement.contains(cursorAt)

        if (isClickedOnExpandedElement) {
            // Does nothing if click on an expanded row
        } else if (isAlreadyExpanded && isLongPress) {
            // If current row is already expanded, and is long click then do nothing
        } else if (isClickedOnCurrentRow) {
            // Expand any row when clicked on
            currentElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
            refIsRowExpanded.current = true
            updateRowExpandStatus(true)
        } else if (!isShiftPressed.current) {
            // Collapse everything else if shift not pressed
            updateExpandStatus(false)
        }
        clickStartTime.current = null;
    }

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

    const updateExpandStatus = (isExpanded: boolean) => {
        setEditActive(isExpanded)
        refIsRowExpanded.current = isExpanded
        updateRowExpandStatus(isExpanded)
    }

    useEffect(() => {
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
    }, [])

    // Handle edit dialogue display
    const [showEditDialogue, setEditActive] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(details.category)
    const customCategoryRef = useRef<HTMLInputElement>(null)

    const updateCategory = () => {
        details.category = selectedCategory
        setEditActive(false)
    }
    //change unique category list to be updated when new added 

    const buttonStyle = 'border border-black mx-2 py-2 px-3 rounded-lg hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition ' as const
    return (
        <div>
            {/* Collapsed transaction row */}
            {!isRowExpanded ?
                <div id={String(details.id)} className='flex flex-col justify-between m-3 hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition border border-black rounded-lg'>
                    <div>
                        <p className='p-3 truncate break-after-all'>{details.transaction_description}</p>
                    </div>
                    <div className={'p-3 flex justify-between'}>
                        <p>{details.account_no}</p>
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
                <div ref={expandedRow} className='border border-black rounded-lg m-4 transition'>
                    {/* Expanded transaction row */}
                    <div className='flex flex-col'>
                        <p className='flex p-3 start-0.5'>
                            <b>Description:</b>
                            <span className='px-2 break-all'>
                                {details.transaction_description}
                            </span>
                        </p>
                        <p className='p-2 flex'>
                            <b>Account No: &nbsp;</b>{details.account_no}
                        </p>
                        <div className='p-2 flex'>
                            <b>Transaction amount: &nbsp;</b>
                            <p className={details.withdrawal_amount == 0 ? "text-green-500" : "text-red-500"}>
                                {details.withdrawal_amount == 0 ? '+$' + details.deposit_amount?.toFixed(2) : '-$' + details.withdrawal_amount?.toFixed(2)}
                            </p>
                        </div>
                        <p className='p-2 flex'>
                            <b>Transaction date: &nbsp;</b>{details.transaction_date}
                        </p>
                        <p className='p-2 flex'>
                            <b>Category: &nbsp;</b>{!showEditDialogue && details.category}
                        </p>
                        {
                            showEditDialogue &&
                            <div className='flex flex-col mx-2 py-2 px-2 border border-black w-2/5'>
                                {uniqueCategory.map((cat) =>
                                    <div key={cat}>
                                        <label className='flex justify-between py-1'>
                                            {cat}
                                            <input
                                                value={cat} name={String(details.id)}
                                                checked={cat == selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                type='radio' />
                                        </label>
                                    </div>
                                )}
                                {/* Custom category */}
                                <label className='flex justify-between py-1'>
                                    <input
                                        type='text'
                                        className='border border-black w-3/4 p-1'
                                        ref={customCategoryRef}
                                        placeholder='Custom category'
                                        onFocus={() => setSelectedCategory(customCategoryRef.current ? customCategoryRef.current.value : selectedCategory)}
                                        onChange={() => setSelectedCategory(customCategoryRef.current ? customCategoryRef.current.value : selectedCategory)} />
                                    <input
                                        id='categoryRadio'
                                        type='radio'
                                        name={String(details.id)}
                                        checked={selectedCategory == (customCategoryRef.current ? customCategoryRef.current.value : '')}
                                        onChange={() => setSelectedCategory(customCategoryRef.current ? customCategoryRef.current.value : selectedCategory)} />
                                </label>
                            </div>
                        }
                        <div className='p-2 flex justify-end'>
                            {showEditDialogue ?
                                <>
                                    {/* Confirm and Cancel buttons when edit is active */}
                                    <button
                                        id='submitButton'
                                        className={buttonStyle}
                                        onClick={updateCategory}>
                                        <b>Confirm</b>
                                    </button>
                                    {/* Cancel statement bugging out, must include timeout*/}
                                    <button
                                        className={buttonStyle}
                                        onClick={() => {
                                            setTimeout(() => {
                                                setEditActive(false)
                                            }, 0)
                                        }}>
                                        <b>Cancel</b>
                                    </button>
                                </>
                                :
                                <>
                                    {/* Edit button when edit is inactive */}
                                    <button
                                        className={buttonStyle}
                                        onClick={() => {
                                            updateExpandStatus(true)
                                            setSelectedCategory(details.category)
                                        }}>
                                        <b>Edit</b>
                                    </button>
                                </>
                            }
                            <button
                                className={buttonStyle}
                                onClick={() => updateExpandStatus(false)}>
                                <b>Close</b>
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}