import { useEffect, useRef, useState } from "react";

export default function Transaction_Row(details: { id: number; transaction_description: string; account_no: string; withdrawal_amount: number; deposit_amount: number; category: string; transaction_date: string }) {
    const HOLD_DELAY_PERSISTANCE = 400
    const [active, setActiveState] = useState(false)
    const startTimeRef = useRef<number>(0)
    const startTimer = () => startTimeRef.current = Date.now()
    let isShiftPressed = false

    const handleHoldPersistance = (event: MouseEvent) => {
        const elaspedTime = Date.now() - startTimeRef.current //dont store as useState, takes a while to update
        console.log(isShiftPressed)

        const targetElement = event.target as HTMLElement
        if (!isShiftPressed && elaspedTime < HOLD_DELAY_PERSISTANCE && targetElement.parentElement?.id != String(details.id)) {
            setActiveState(false)
        } else if (targetElement.parentElement?.id == String(details.id) || targetElement.parentElement?.id == String(details.id)) {
            setActiveState(true)
        } 
    }
    const handleButtonDown = (event: KeyboardEvent) => {
        if (event.key == 'Shift') {
            isShiftPressed = true
        } 
        console.log(isShiftPressed)

    }
    const handleButtonUp = (event: KeyboardEvent) => {
        isShiftPressed = false
        console.log(isShiftPressed)
    }

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

    return (
        <div>
            {!active ? <div id={String(details.id)} className="flex flex-col justify-between m-4 hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition border border-black rounded-lg">
                <div className="p-3 truncate">{details.transaction_description}</div>
                <div className="p-3 flex justify-between">
                    <div>
                        Account No: {details.account_no}
                    </div>
                    <div>
                        {details.withdrawal_amount == 0 ? "+$" + details.deposit_amount.toFixed(2) : "-$" + details.withdrawal_amount.toFixed(2)}
                    </div>
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
                <div className="flex flex-col justify-between">
                    <div className="flex p-3 start-0.5">
                        <span>
                            <b>Description: </b>
                        </span>
                        <span className="px-2">
                            {details.transaction_description}
                        </span>
                    </div>
                    <div className="p-3 flex justify-between">
                        <div>
                            <b>Account No: </b>{details.account_no}
                        </div>
                        <div>
                            <b>Transaction amount: </b>{details.withdrawal_amount == 0 ? "+$" + details.deposit_amount.toFixed(2) : "-$" + details.withdrawal_amount.toFixed(2)}
                        </div>
                    </div>
                    <div className="p-3 flex justify-between">
                        <div>
                            <b>Category: </b>{details.category}
                        </div>
                        <div>
                            <b>Transaction date: </b>{details.transaction_date}
                        </div>
                    </div>
                    <div className="p-3 flex justify-end">
                        <button className="border border-black mx-2 py-2 px-3 rounded-lg hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition"><b>Edit</b></button>
                        <button className="border border-black mx-2 py-2 px-3 rounded-lg hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition"
                            onClick={() => setActiveState(false)}><b>Close</b></button>
                    </div>
                </div>
            </div>}
        </div>
    )
}