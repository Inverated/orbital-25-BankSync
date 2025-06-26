import { useUserId } from "@/context/UserContext"
import { getAccountDetails, getTransactionDetails } from "@/lib/supabase_query"
import { useEffect, useRef, useState } from "react"

export default function FilterButton(onFilterSet: { setFilter: (accountSelection: string[], categorySelection: string[], isAscending: boolean) => void }) {
    const [filterDialogue, setFilterDialogue] = useState(false)
    const [uniqueAccount, setUniqueAccount] = useState<{ account_name: string, account_no: string, bank_name: string }[]>([])
    const [uniqueCategory, setUniqueCategory] = useState<string[]>([])
    const [accountLoaded, setAccountStatus] = useState(false)
    const [categoryLoaded, setCategoryStatus] = useState(false)

    const selectedAccount = useRef<string[]>([])
    const selectedCategory = useRef<string[]>([])
    const orderDateAscending = useRef(false)

    const userId = useUserId();

    useEffect(() => {
        resetAll()

        getAccountDetails(userId, ['account_name', 'account_no', 'bank_name'])
            .then(arr => {
                arr.forEach(entry => {
                    const name = entry.account_name
                    const no = entry.account_no
                    const bank = entry.bank_name
                    setUniqueAccount(prev => [...prev, { account_name: name, account_no: no, bank_name: bank }])
                })
                setAccountStatus(true)
            })

        getTransactionDetails(userId, ['category'])
            .then(arr => {
                setUniqueCategory([...new Set(arr.map(entry => entry.category)
                    .filter(item => item != undefined))])
            })
        setCategoryStatus(true)

        const handleButtonDown = (event: KeyboardEvent) => {
            if (event.key == 'Escape') {
                closeAll()
            }
        }
        document.addEventListener('keydown', handleButtonDown)
        return () => {
            document.removeEventListener('keydown', handleButtonDown)
        }
    }, [userId, filterDialogue])

    const updateAccountSelection = (account_no: string, checked: boolean) => {
        const index = selectedAccount.current.findIndex(no => no == account_no)
        if ((index == -1) && checked) {
            selectedAccount.current.push(account_no)
        } else if ((index != -1 && !checked)) {
            selectedAccount.current.splice(index, 1)
        }
    }

    const updateCategorySelection = (category: string, checked: boolean) => {
        const index = selectedCategory.current.findIndex(no => no == category)
        if ((index == -1) && checked) {
            selectedCategory.current.push(category)
        } else if ((index != -1 && !checked)) {
            selectedCategory.current.splice(index, 1)
        }
    }

    const handleFilter = () => {
        onFilterSet.setFilter(selectedAccount.current, selectedCategory.current, orderDateAscending.current)
        setFilterDialogue(false)
    }

    const resetAll = () => {
        setUniqueAccount([])
        setUniqueCategory([])
        setAccountStatus(false)
        setCategoryStatus(false)
        selectedAccount.current = []
        selectedCategory.current = []
    }

    const closeAll = () => {
        setFilterDialogue(false)
        resetAll()
    }

    return (
        <div>
            <button className='border border-black mx-3 py-2 px-3 rounded-lg hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition'
                onClick={() => setFilterDialogue(true)}>
                Filter
            </button>
            {filterDialogue && categoryLoaded && accountLoaded &&
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg px-8 py-7 max-w-5/6 w-full z-60 max-h-11/12 overflow-y-auto">
                        <p className="text-2xl mb-3">Filter</p>
                        <div className="text-sm flex justify-between">
                            <div>
                                <span className="text-xl">Account</span>
                                {uniqueAccount.map((account, index) =>
                                    <label key={index} className="flex py-0.5 px-3 gap-x-1">
                                        <input
                                            type='checkbox'
                                            value={account.account_name}
                                            onChange={e => updateAccountSelection(account.account_no, e.currentTarget.checked)} />
                                        {account.bank_name + ': ' + account.account_name}
                                    </label>
                                )}
                            </div>
                            <div>
                                <span className="text-xl">Category</span>
                                {uniqueCategory.map((category, index) =>
                                    <label key={index} className="flex py-0.5 px-3 gap-x-1">
                                        <input
                                            type='checkbox'
                                            value={category}
                                            onChange={e => updateCategorySelection(category, e.currentTarget.checked)} />
                                        {category}
                                    </label>
                                )}
                            </div>
                            <div>
                                <span className="text-xl">Order By</span>
                                <div>
                                    <p>Transaction Date</p>
                                    <div className="flex flex-col px-3 mr-5 py-0.5">
                                        <label className="py-0.5 gap-x-1">
                                            <input type="radio" name="date_order" onClick={() => orderDateAscending.current = true} />
                                            <span>Ascending</span>
                                        </label>
                                        <label className="py-0.5 gap-x-1">
                                            <input type="radio" name="date_order" onClick={() => orderDateAscending.current = false} defaultChecked />
                                            <span>Descending</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={closeAll}
                                className="border border-black mt-4 mx-4 p-1 rounded text-base flex justify-end hover:bg-gray-400 hover:cursor-pointer active:bg-gray-600 active:scale-95 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleFilter}
                                className="border disabled:border-gray-400 disabled:text-gray-400 border-black mt-4 p-1 rounded text-base flex justify-end not-disabled:hover:bg-gray-400 not-disabled:hover:cursor-pointer not-disabled:active:bg-gray-600 not-disabled:active:scale-95 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}