import { useDatabase } from "@/context/DatabaseContext"
import { getAccountDetails, getTransactionDetails } from "@/lib/databaseQuery"
import AnalyticsDatePicker from "@/utils/DatePicker"
import { Account, Transaction } from "@/utils/types"
import { Dayjs } from "dayjs"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function FilterButton(onFilterSet: { setFilter: (accountSelection: string[], categorySelection: string[], isAscending: boolean, date: { startDate: Dayjs | null, endDate: Dayjs | null }) => void }) {
    const [filterDialogue, setFilterDialogue] = useState(false)
    const [uniqueAccount, setUniqueAccount] = useState<{ account_name: string, account_no: string, bank_name: string }[]>([])
    const [uniqueCategory, setUniqueCategory] = useState<string[]>([])
    const [accountLoaded, setAccountLoaded] = useState(false)
    const [categoryLoaded, setCategoryLoaded] = useState(false)

    const selectedAccount = useRef<string[]>([])
    const selectedCategory = useRef<string[]>([])
    const orderDateAscending = useRef(false)

    const [showDropdownAccount, setShowDropdownAccount] = useState(false)
    const [showDropdownCategory, setShowDropdownCategory] = useState(false)
    const [showDropdownDate, setShowDropdownDate] = useState(false)
    const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(null);
    const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null);

    const resetFilterValues = () => {
        selectedAccount.current = []
        selectedCategory.current = []
    }

    const resetAllValues = () => {
        setUniqueAccount([])
        setUniqueCategory([])
        setAccountLoaded(false)
        setCategoryLoaded(false)
    }

    const closeAll = () => {
        resetAllValues()
        resetFilterValues()
        setFilterDialogue(false)
    }

    const { accounts, transactions } = useDatabase()

    useEffect(() => {
        resetAllValues()
        const accArray: Account[] = getAccountDetails({
            accounts: accounts,
        })

        accArray.forEach(entry => {
            const name = entry.account_name
            const no = entry.account_no
            const bank = entry.bank_name
            setUniqueAccount(prev => [...prev, { account_name: name, account_no: no, bank_name: bank }])
        })
        setAccountLoaded(true)


        const transArray: Transaction[] = getTransactionDetails({
            transactions: transactions,
        })

        setUniqueCategory([...new Set(transArray.map(entry => entry.category)
            .filter(item => item != undefined))])

        setCategoryLoaded(true)

        const handleButtonDown = (event: KeyboardEvent) => {
            if (event.key == 'Escape') {
                closeAll()
            }
        }

        document.addEventListener('keydown', handleButtonDown)
        return () => {
            document.removeEventListener('keydown', handleButtonDown)
        }
    }, [filterDialogue, accounts, transactions, selectedAccount, selectedCategory])

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
            <button className='border-b py-0.5 hover:cursor-pointer hover:bg-gradient-to-t hover:from-gray-400 hover:to-white active:bg-gray-500 active:scale-97 transition-all'
                onClick={() => setFilterDialogue(true)}>
                <div className="text-base p-2">Filter</div>
            </button>
            {filterDialogue && categoryLoaded && accountLoaded &&
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg px-8 py-7 max-w-full w-3/4 z-60 max-h-11/12 overflow-y-auto">
                        <p className="text-2xl mb-3">Filter</p>
                        <div className="text-sm space-y-2 flex-col inline-flex min-w-full max-w-full">

                            <button
                                onClick={() => setShowDropdownAccount(!showDropdownAccount)}
                                className="hover:bg-gray-300 focus:outline-none font-medium border-b-2 text-sm px-5 py-2.5 text-center inline-flex justify-between" type="button">
                                Account Name
                                {showDropdownAccount ? <ChevronUp /> : <ChevronDown />}
                            </button>
                            <div id="accountDropdown" className="rounded-lg" hidden={!showDropdownAccount}>
                                <ul className="p-3 text-sm">
                                    {uniqueAccount.map((account, index) =>
                                        <li key={index} >
                                            <label className="flex py-1.5 px-3 justify-between">
                                                {account.bank_name ? account.bank_name + ': ' : ''}{account.account_name == '' ? account.account_no : account.account_name}
                                                <input
                                                    type='checkbox'
                                                    value={account.account_name}
                                                    defaultChecked={selectedAccount.current.includes(account.account_no)}
                                                    onChange={e => updateAccountSelection(account.account_no, e.currentTarget.checked)} />
                                            </label>
                                            {index < uniqueAccount.length - 1 ? <hr /> : ''}
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <button
                                onClick={() => setShowDropdownCategory(!showDropdownCategory)}
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
                                                        defaultChecked={selectedCategory.current.includes(category)}
                                                        onChange={e => updateCategorySelection(category, e.currentTarget.checked)} />

                                                </label>
                                                {index < uniqueCategory.length - 1 ? <hr /> : ''}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowDropdownDate(!showDropdownDate)}
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
                                            onChange={e => setFilterStartDate(e)}
                                        />
                                    </div>
                                    <p>To</p>
                                    <div className="rounded-lg scale-80" hidden={!showDropdownDate}>
                                        <AnalyticsDatePicker
                                            label="End Date"
                                            value={filterEndDate}
                                            onChange={e => setFilterEndDate(e)}
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
                                            <input type="radio" name="date_order"
                                                onClick={() => orderDateAscending.current = true}
                                                defaultChecked={orderDateAscending.current} />
                                            <span>Ascending</span>
                                        </label>
                                        <label className="space-x-2">
                                            <input type="radio" name="date_order"
                                                onClick={() => orderDateAscending.current = false}
                                                defaultChecked={!orderDateAscending.current} />
                                            <span>Descending</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeAll}
                                className="border border-black px-2 py-1 rounded-sm text-base flex justify-end hover:bg-gray-400 hover:cursor-pointer active:bg-gray-600 active:scale-95 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleFilter}
                                className="border disabled:border-gray-400 disabled:text-gray-400 
                                        not-disabled:hover:bg-gray-400 not-disabled:hover:cursor-pointer not-disabled:active:bg-gray-600 not-disabled:active:scale-95 
                                        border-black px-2 py-1 rounded-sm text-base flex justify-end transition"
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