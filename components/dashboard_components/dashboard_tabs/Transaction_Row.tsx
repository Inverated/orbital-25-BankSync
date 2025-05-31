import { useEffect, useRef, useState } from "react";

type details = { id: string; transaction_description: string; account_no: string; withdrawal_amount: number; deposit_amount: number; category: string; transaction_date: string }
type uniqueCategory = string[]
type arguements = { details: details, uniqueCategory: uniqueCategory }

export default function Transaction_Row({ details, uniqueCategory }: arguements) {
    // Handle persistent expanded row display when shift pressed or long click
    const HOLD_DELAY_TO_PERSIST = 200;
    const [isRowExpanded, updateExpandRef] = useState(false);
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

        const currentElement = document.getElementById(details.id)
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
            updateExpandRef(true)
        } else if (!isShiftPressed.current) {
            // Collapse everything else if shift not pressed
            updateExpandStatus(false)
        }
        clickStartTime.current = null;
    }

    const handleButtonDown = (event: KeyboardEvent) => {
        if (event.key == 'Shift') {
            isShiftPressed.current = true
        } else if (event.key == "Escape") {
            // Collapse all row when pressed
            updateExpandStatus(false)
        } else if (event.key == "Enter") {
            document.getElementById("categoryRadio")?.classList.add('active')
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
        updateExpandRef(isExpanded)
    }

    // TODO: add in ux for phone?
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
    const [tempEditCat, setTempEditCat] = useState(details.category)
    const newCatRef = useRef<HTMLInputElement>(null)

    const updateCategory = () => {
        details.category = tempEditCat
        setEditActive(false)
    }
    //change unique category list to be updated when new added 

    const buttonStyle = "border border-black mx-2 py-2 px-3 rounded-lg hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition " as const
    return (
        <div>
            {/* Collapsed transaction row */}
            {!isRowExpanded ?
                <div id={details.id} className="flex flex-col justify-between m-4 hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition border border-black rounded-lg">
                    <div>
                        <p className="p-3 truncate break-after-all">{details.transaction_description}</p>
                    </div>
                    <div className="p-3 flex justify-between">
                        <p>Account No: {details.account_no}</p>
                        <p>{details.withdrawal_amount == 0 ? "+$" + details.deposit_amount.toFixed(2) : "-$" + details.withdrawal_amount.toFixed(2)}</p>
                    </div>
                    <div className="p-3 flex justify-between">
                        <p>
                            {details.category}
                        </p>
                        <p>
                            {details.transaction_date}
                        </p>
                    </div>
                </div>
                :
                <div ref={expandedRow} className="border border-black rounded-lg m-4 transition">
                    {/* Expanded transaction row */}
                    <div className="flex flex-col">
                        <p className="flex p-3 start-0.5">
                            <b>Description:</b>
                            <span className="px-2 break-all">
                                {details.transaction_description}
                            </span>
                        </p>
                        <p className="p-2 flex">
                            <b>Account No: &nbsp;</b>{details.account_no}
                        </p>
                        <p className="p-2 flex">
                            <b>Transaction amount: &nbsp;</b>{details.withdrawal_amount == 0 ? "+$" + details.deposit_amount.toFixed(2) : "-$" + details.withdrawal_amount.toFixed(2)}
                        </p>
                        <p className="p-2 flex">
                            <b>Transaction date: &nbsp;</b>{details.transaction_date}
                        </p>
                        <p className="p-2 flex">
                            <b>Category: &nbsp;</b>{!showEditDialogue && details.category}
                        </p>
                        {
                            showEditDialogue &&
                            <div className="flex flex-col mx-2 px-2 border border-black w-2/5">
                                {uniqueCategory.map((cat) =>
                                    <div key={cat}>
                                        <label className="flex justify-between py-1">
                                            {cat}
                                            <input value={cat} name={details.id}
                                                checked={cat == tempEditCat}
                                                onChange={(e) => setTempEditCat(e.target.value)}
                                                type="radio" />
                                        </label>
                                    </div>
                                )}
                                {/* Custom category */}
                                <label className="flex justify-between py-1">
                                    <input type="text" className="border border-black" ref={newCatRef} />
                                    <input id="categoryRadio" type="radio" name={details.id}
                                        onChange={() => setTempEditCat(newCatRef.current ? newCatRef.current.value : tempEditCat)} />
                                </label>
                            </div>
                        }
                        <div className="p-2 flex justify-end">
                            {showEditDialogue ?
                                <>
                                    {/* Confirm and Cancel buttons when edit is active */}
                                    <button
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