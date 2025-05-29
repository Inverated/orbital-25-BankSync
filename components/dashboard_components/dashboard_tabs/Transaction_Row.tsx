import { useEffect, useRef, useState } from "react";

type details = { id: number; transaction_description: string; account_no: string; withdrawal_amount: number; deposit_amount: number; category: string; transaction_date: string }
type uniqueCategory = string[]
type arguements = { details: details, uniqueCategory: uniqueCategory }

export default function Transaction_Row({ details, uniqueCategory }: arguements) {
    //handle persistent tab display
    const HOLD_DELAY_PERSISTANCE = 400
    const [expandedTab, setExpandState] = useState(false)
    const startTimeRef = useRef<number>(0)
    let isShiftPressed = false

    const startTimer = () => startTimeRef.current = Date.now()

    const handleHoldPersistance = (event: MouseEvent) => {
        const elaspedTime = Date.now() - startTimeRef.current //dont store as useState, cannot access immediately cause asyncronous
        const targetElement = event.target as HTMLElement
        const parent = targetElement.closest("#expanded_transaction_tab")

        if (parent?.id == "expanded_transaction_tab") {
            //disable collapsing when clicking expanded tab. 
            return
        } else if (!isShiftPressed && elaspedTime < HOLD_DELAY_PERSISTANCE && targetElement.parentElement?.id != String(details.id)) {
            setExpandState(false)
            setEditActive(false)
        } else if (targetElement.parentElement?.id == String(details.id)) {
            setExpandState(true)
        }
    }

    const handleButtonDown = (event: KeyboardEvent) => {
        if (event.key == 'Shift') {
            isShiftPressed = true
        } else if (event.key == "Escape") {
            //collapse all tab when pressed
            setExpandState(false)
        }
    }

    const handleButtonUp = () => isShiftPressed = false
    useEffect(() => {
        document.addEventListener('mouseup', handleHoldPersistance)
        document.addEventListener('mousedown', startTimer)
        document.addEventListener('keydown', handleButtonDown)
        document.addEventListener('keyup', handleButtonUp)
        return () => {
            document.removeEventListener('mouseup', handleHoldPersistance)
            document.removeEventListener('mousedown', startTimer)
            document.removeEventListener('keydown', handleButtonDown)
            document.removeEventListener('keyup', handleButtonUp)
        }
    }, [startTimer])

    //handle edit dialogue
    const [editDialogue, setEditActive] = useState(false)
    const [tempEditCat, setTempEditCat] = useState(details.category)
    const newCatRef = useRef<HTMLInputElement>(null)

    const updateCategory = () => {
        details.category = tempEditCat
        setEditActive(false)
    }
    //change unique category list to be shared and updated when new added 

    const buttonStyle = "border border-black mx-2 py-2 px-3 rounded-lg hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition " as const
    return (
        <div>
            {/* Collapsed transaction row */}
            {!expandedTab ?
                <div id={String(details.id)} className="flex flex-col justify-between m-4 hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition border border-black rounded-lg">
                    <div className="p-3 truncate break-after-all">{details.transaction_description}</div>
                    <div className="p-3 flex justify-between">
                        <div>Account No: {details.account_no}</div>
                        <div>{details.withdrawal_amount == 0 ? "+$" + details.deposit_amount.toFixed(2) : "-$" + details.withdrawal_amount.toFixed(2)}</div>
                    </div>
                    <div className="p-3 flex justify-between">
                        <div>
                            {details.category}
                        </div>
                        <div>
                            {details.transaction_date}
                        </div>
                    </div>
                </div> : <div id="expanded_transaction_tab" className="border border-black rounded-lg m-4 transition">
                    {/* Expanded transaction row */}
                    <div id="expanded_transaction_tab" className="flex flex-col">
                        <div className="flex p-3 start-0.5">
                            <b>Description:</b>
                            <span className="px-2 break-all">
                                {details.transaction_description}
                            </span>
                        </div>
                        <div className="p-2 flex">
                            <b>Account No: &nbsp;</b>{details.account_no}
                        </div>
                        <div className="p-2 flex">
                            <b>Transaction amount: &nbsp;</b>{details.withdrawal_amount == 0 ? "+$" + details.deposit_amount.toFixed(2) : "-$" + details.withdrawal_amount.toFixed(2)}
                        </div>
                        <div className="p-2 flex">
                            <b>Transaction date: &nbsp;</b>{details.transaction_date}
                        </div>
                        <div className="p-2 flex">
                            <b>Category: &nbsp;</b>{!editDialogue && details.category}
                        </div>
                        {
                            editDialogue &&
                            <div id="expanded_transaction_tab">
                                <div className="flex flex-col mx-2 px-2 border border-black w-2/5">
                                    {uniqueCategory.map((cat) =>
                                        <>
                                            <label key={cat} className="flex justify-between py-1">
                                                {cat}
                                                <input value={cat} name={String(details.id)}
                                                    checked={cat == tempEditCat}
                                                    onChange={(e) => setTempEditCat(e.target.value)}
                                                    type="radio" />
                                            </label>
                                        </>
                                    )}
                                    {/* Custom category */}
                                    <label className="flex justify-between py-1">
                                        <input type="text" className="border border-black" ref={newCatRef} />
                                        <input type="radio" name={String(details.id)}
                                            onChange={() => setTempEditCat(newCatRef.current ? newCatRef.current.value : tempEditCat)} />
                                    </label>
                                </div>
                            </div>
                        }
                        <div className="p-2 flex justify-end">
                            {
                                !editDialogue ?
                                    <button className={buttonStyle}
                                        onClick={() => {
                                            setEditActive(true)
                                            setTempEditCat(details.category)
                                        }}>
                                        <b>Edit</b>
                                    </button> : <>
                                        <button className={buttonStyle}
                                            onClick={updateCategory}>
                                            <b>Confirm</b>
                                        </button>
                                        <button className={buttonStyle}
                                            onClick={() => setEditActive(false)}>
                                            <b>Cancel</b>
                                        </button>
                                    </>
                            }
                            <button className={buttonStyle}
                                onClick={() => {
                                    setExpandState(false);
                                    setEditActive(false)
                                }}>
                                <b>Close</b>
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}