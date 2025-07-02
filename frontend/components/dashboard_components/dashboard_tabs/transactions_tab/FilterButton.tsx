import { useUserId } from "@/context/UserContext"
import { getAccountDetails, getTransactionDetails } from "@/lib/supabase_query"
import AnalyticsDatePicker from "@/utils/DatePicker"
import { Dayjs } from "dayjs"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function FilterButton(onFilterSet: { setFilter: (accountSelection: string[], categorySelection: string[], isAscending: boolean, date: { startDate: Dayjs | null, endDate: Dayjs | null }) => void }) {
    const [filterDialogue, setFilterDialogue] = useState(false)
    const [uniqueAccount, setUniqueAccount] = useState<{ account_name: string, account_no: string, bank_name: string }[]>([])
    const [uniqueCategory, setUniqueCategory] = useState<string[]>([])
    const [accountLoaded, setAccountStatus] = useState(false)
    const [categoryLoaded, setCategoryStatus] = useState(false)

    const selectedAccount = useRef<string[]>([])
    const selectedCategory = useRef<string[]>([])
    const orderDateAscending = useRef(false)

    const [showDropdownAccount, setDropdownAccount] = useState(false)
    const [showDropdownCategory, setDropdownCategory] = useState(false)
    const [showDropdownDate, setDropdownDate] = useState(false)
    const [filterStartDate, setStartDate] = useState<Dayjs | null>(null);
    const [filterEndDate, setEndDate] = useState<Dayjs | null>(null);

    const userId = useUserId();

    const resetAllValues = () => {
        setUniqueAccount([])
        setUniqueCategory([])
        setAccountStatus(false)
        setCategoryStatus(false)
        selectedAccount.current = []
        selectedCategory.current = []
    }

    const closeAll = () => {
        setFilterDialogue(false)
        resetAllValues()
    }

    useEffect(() => {
        resetAllValues()

        getAccountDetails({
            userId: userId,
            selection: ['account_name', 'account_no', 'bank_name']
        }).then(arr => {
            arr.forEach(entry => {
                const name = entry.account_name
                const no = entry.account_no
                const bank = entry.bank_name
                setUniqueAccount(prev => [...prev, { account_name: name, account_no: no, bank_name: bank }])
            })
            setAccountStatus(true)
        })

        getTransactionDetails({
            userId: userId,
            selection: ['category']
        }).then(arr => {
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
        let startDate = null
        let endDate = null
        if (filterStartDate) {
            startDate = filterStartDate.startOf('month')
        }
        if (filterEndDate) {
            endDate = filterEndDate.endOf('month')
        }

        onFilterSet.setFilter(selectedAccount.current, selectedCategory.current, orderDateAscending.current,
            { startDate: startDate, endDate: endDate })
        setFilterDialogue(false)
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
                    <div className="bg-white rounded-lg shadow-lg px-8 py-7 max-w-full w-3/4 z-60 max-h-11/12 overflow-y-auto">
                        <p className="text-2xl mb-3">Filter</p>
                        <div className="text-sm space-y-2 flex-col inline-flex min-w-full max-w-full">

                            <button
                                onClick={() => setDropdownAccount(!showDropdownAccount)}
                                className="hover:bg-gray-300 focus:outline-none font-medium border-b-2 text-sm px-5 py-2.5 text-center inline-flex justify-between" type="button">
                                Account Name
                                {showDropdownAccount ? <ChevronUp /> : <ChevronDown />}
                            </button>
                            <div id="accountDropdown" className="rounded-lg" hidden={!showDropdownAccount}>
                                <ul className="p-3 text-sm">
                                    {uniqueAccount.map((account, index) =>
                                        <li key={index} >
                                            <label className="flex py-1.5 px-3 justify-between">
                                                {account.bank_name + ': ' + account.account_name}
                                                <input
                                                    type='checkbox'
                                                    value={account.account_name}
                                                    onChange={e => updateAccountSelection(account.account_no, e.currentTarget.checked)} />
                                            </label>
                                            {index < uniqueAccount.length - 1 ? <hr /> : ''}
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <button
                                onClick={() => setDropdownCategory(!showDropdownCategory)}
                                className="hover:bg-gray-300 focus:outline-none font-medium border-b-2 text-sm px-5 py-2.5 text-center inline-flex justify-between" type="button">
                                Category
                                {showDropdownCategory ? <ChevronUp /> : <ChevronDown />}
                            </button>
                            <div>
                                <div className="rounded-lg" hidden={!showDropdownCategory}>
                                    <ul className="p-3 text-sm">
                                        {uniqueCategory.map((category, index) =>
                                            <li key={index} >
                                                <label className="flex py-1.5 px-3 justify-between">
                                                    {category}
                                                    <input
                                                        type='checkbox'
                                                        value={category}
                                                        onChange={e => updateCategorySelection(category, e.currentTarget.checked)} />

                                                </label>
                                                {index < uniqueCategory.length - 1 ? <hr /> : ''}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={() => setDropdownDate(!showDropdownDate)}
                                className="hover:bg-gray-300 focus:outline-none font-medium border-b-2 text-sm px-5 py-2.5 text-center inline-flex justify-between" type="button">
                                Date Range
                                {showDropdownDate ? <ChevronUp /> : <ChevronDown />}
                            </button>
                            <div hidden={!showDropdownDate}>
                                <div className="flex flex-col sm:flex-row items-center space-x-2">
                                    <div className="rounded-lg scale-80" >
                                        <AnalyticsDatePicker
                                            label="Start Date"
                                            value={filterStartDate}
                                            onChange={e => setStartDate(e)}
                                        />
                                    </div>
                                    <p>To</p>
                                    <div className="rounded-lg scale-80" hidden={!showDropdownDate}>
                                        <AnalyticsDatePicker
                                            label="End Date"
                                            value={filterEndDate}
                                            onChange={e => setEndDate(e)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div
                                    className="hover:bg-gray-300 focus:outline-none font-medium border-b-2 text-sm px-5 py-2.5">
                                    Date Order
                                </div>
                                <div>
                                    <div className="flex flex-col text-sm">
                                        <label className="space-x-2 my-2">
                                            <input type="radio" name="date_order" onClick={() => orderDateAscending.current = true} />
                                            <span>Ascending</span>
                                        </label>
                                        <label className="space-x-2">
                                            <input type="radio" name="date_order" onClick={() => orderDateAscending.current = false} defaultChecked />
                                            <span>Descending</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end sticky">
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