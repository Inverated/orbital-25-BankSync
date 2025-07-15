import { Account, StatementResponse, Transaction } from "@/utils/types";
import { useEffect, useState } from "react";
import { Check, SquarePen, Trash } from 'lucide-react';
import { useDatabase } from "@/context/DatabaseContext";
import { duplicateChecking } from "@/utils/duplicateTransactionCheck";
import { getAccountDetails } from "@/lib/databaseQuery";

interface Props {
    currIndex: number
    statement: StatementResponse;
    onTransactionUpdate: (index: number, updatedItem: StatementResponse) => void;
    onDelete: (updatedItem: StatementResponse) => void;
    duplicateChecker: boolean;
    duplicateShower: boolean;
}


export default function PreviewTable({ currIndex, statement, onTransactionUpdate, onDelete,
    duplicateChecker, duplicateShower }: Props) {
    const [editingId, setEditId] = useState(-1)
    const [isLatest, setIsLatest] = useState<'This Latest' | 'Equal' | 'This Older'>('Equal')
    const [loadedTransactionData, setLoadingData] = useState<Transaction[]>([])
    const [accountInDatabase, setExistingAccount] = useState<Account | undefined>(undefined)
    const [showDuplicateHighlight, setDuplicateHighlight] = useState(true)
    const [editingAccount, setEditAccount] = useState(false)
    const [accountList, setAccountList] = useState<string[]>([])

    const { accounts, transactions } = useDatabase()

    const handleTransactionChange = (index: number, field: keyof Transaction, newValue: string | number) => {
        if (statement.transactions[index][field] == newValue) {
            return
        }
        statement.transactions[index] = { ...statement.transactions[index], [field]: newValue }
        statement.transactions[index].duplicate = false
        setLoadingData(statement.transactions)
        const updatedStatement: StatementResponse = { hasData: true, account: statement.account, transactions: statement.transactions }
        onTransactionUpdate(currIndex, updatedStatement)
    }

    const handleDeleteTransaction = (index: number) => {
        if (index == editingId) setEditId(-1)
        setLoadingData(statement.transactions.splice(index, 1))
        const updatedStatement: StatementResponse = { hasData: true, account: statement.account, transactions: statement.transactions }
        onDelete(updatedStatement)
    }

    const fixDecimalPlace = (index: number) => {
        const transactionRow = statement.transactions[index]
        statement.transactions[index] = {
            ...statement.transactions[index],
            ['withdrawal_amount']: Number(transactionRow.withdrawal_amount.toFixed(2).split('.').join('.')),
            ['deposit_amount']: Number(transactionRow.deposit_amount.toFixed(2).split('.').join('.')),
            ['ending_balance']: Number(transactionRow.ending_balance.toFixed(2).split('.').join('.')),
        }
        setLoadingData(statement.transactions)
        const updatedStatement: StatementResponse = { hasData: true, account: statement.account, transactions: statement.transactions }
        onTransactionUpdate(currIndex, updatedStatement)
    }

    const handleAccountChange = (field: keyof Account, newValue: string | number) => {
        const newAccountDetail: Account = { ...statement.account, [field]: newValue }
        const newTransaction: Transaction[] = [...statement.transactions]
        if (field == 'account_no') {
            newTransaction.forEach(each => each.account_no = newValue.toString())
        }

        const updatedStatement: StatementResponse = { hasData: true, account: newAccountDetail, transactions: newTransaction }
        onTransactionUpdate(currIndex, updatedStatement)
    }

    const confirmAcc = (finishedEditing: boolean) => {
        if (finishedEditing) {
            refreshAccInDatabaseCheck()
            duplicateChecking([statement], transactions)
        }
    }

    const handleDeleteAccount = () => {
        onDelete({ ...statement, hasData: false })
    }

    const refreshAccInDatabaseCheck = () => {
        const referenceAcc = getAccountDetails({ accounts, condition: [{ key: 'account_no', value: [statement.account.account_no] }] })
        if (referenceAcc.length == 1) {
            setExistingAccount(referenceAcc[0])
        } else {
            setExistingAccount(undefined)
        }

        if (referenceAcc.length != 1) {
            setIsLatest('Equal')
        } else if (statement.account.latest_recorded_date == referenceAcc[0].latest_recorded_date) {
            setIsLatest('Equal')
        } else if (statement.account.latest_recorded_date < referenceAcc[0].latest_recorded_date) {
            setIsLatest('This Older')
        } else {
            setIsLatest('This Latest')
        }
    }

    const checkDuplicate = () => {
        if (editingId == -1) {
            const sr: StatementResponse[] = [statement]
            duplicateChecking(sr, transactions)
            statement.transactions = sr[0].transactions
        }
    }

    useEffect(() => {
        checkDuplicate()
    }, [editingId])

    useEffect(() => {
        setLoadingData(statement.transactions)
        checkDuplicate()
        setDuplicateHighlight(duplicateChecker)

        const accNoList: string[] = []
        accounts.forEach(acc => accNoList.push(acc.account_no))
        setAccountList(accNoList)

        refreshAccInDatabaseCheck()
    }, [loadedTransactionData, duplicateChecker, duplicateShower, editingId, currIndex])

    const rowStyle = "px-4 py-2 whitespace-pre-line max-w-fit"

    return (
        <>
            <div className="justify-between flex">
                <div className="text-sm rounded-lg my-3 w-5/6">
                    <div className="flex flex-row">
                        {editingAccount && ((!accountInDatabase) || (accountInDatabase?.bank_name == '')) ?
                            <input
                                placeholder="Bank Name"
                                type="text"
                                className="border w-21 pl-1 placeholder:text-gray-600"
                                onChange={(e) => handleAccountChange('bank_name', e.target.value)}
                                defaultValue={statement.account.bank_name}
                            /> :
                            <b>{statement.account.bank_name}</b>

                        }
                        {editingAccount && ((!accountInDatabase) || (accountInDatabase?.account_name == '')) ?
                            (<>
                                <b>: </b>
                                <input
                                    placeholder="Account Name"
                                    type="text"
                                    className="border ml-1 pl-1"
                                    onChange={(e) => handleAccountChange('account_name', e.target.value)}
                                    defaultValue={statement.account.account_name}
                                />
                            </>) : (!statement.account.account_name ? '' :
                                <>
                                    <b className="pr-1">: </b>
                                    {accountInDatabase ?
                                        (accountInDatabase.account_name == statement.account.account_name ? accountInDatabase.account_name :
                                            <div className="sm:flex space-x-2">
                                                <p className="text-red-600 line-through">
                                                    {statement.account.account_name}
                                                </p>
                                                <p className="">
                                                    {accountInDatabase?.account_name}
                                                </p>
                                            </div>
                                        ) :
                                        (statement?.account.account_name)
                                    }
                                </>)}
                    </div>
                    <p>
                        <b>Account number: </b>
                        {!editingAccount ? statement.account?.account_no :
                            <input list="accNoList"
                                className="border pl-1"
                                placeholder="Account No"
                                onChange={(e) => handleAccountChange('account_no', e.target.value)}
                                defaultValue={statement.account?.account_no} />}
                        <datalist id='accNoList'>
                            {accountList.map((accNo, index) =>
                                <option key={index} value={accNo} />
                            )}
                        </datalist>
                    </p>
                    <p className="sm:flex sm:justify-between not-sm:flex not-sm:flex-col">
                        <span>
                            <b>{isLatest == 'This Latest' ? "New balance: " : "Balance: "}</b>
                            <span className={isLatest == 'Equal' ? '' : isLatest == 'This Latest' ? "text-green-600" : "text-red-600 line-through"}>
                                ${statement.transactions.length == 0 ? '0.00' : statement.transactions[statement.transactions.length - 1].ending_balance.toFixed(2)}
                            </span>
                        </span>
                        {
                            accountInDatabase?.latest_recorded_date &&
                            <span>
                                <b>{isLatest == 'This Older' ? "Latest Balance " : "Previous Balance "}
                                    {new Date(accountInDatabase.latest_recorded_date).toLocaleDateString('en-GB')}: </b>
                                <span className={isLatest == 'Equal' ? '' : isLatest == 'This Latest' ? "text-red-600 line-through" : "text-green-600"}>
                                    ${accountInDatabase.balance}
                                </span>
                            </span>
                        }
                    </p>
                </div>
                <div className="pr-3 flex flex-row justify-center scale-70 space-x-2">
                    <div className="text-blue-600 hover:underline hover:cursor-pointer self-center"
                        onClick={() => { setEditAccount(!editingAccount); confirmAcc(editingAccount) }}>
                        {editingAccount ? <Check /> : <SquarePen />}
                    </div>
                    <div
                        className="text-blue-600 hover:underline hover:cursor-pointer self-center"
                        onMouseUp={handleDeleteAccount}>
                        <Trash />
                    </div>
                </div>

            </div>
            <div className='text-sm text-end italic' hidden={!(duplicateChecker && !duplicateShower)}>
                {statement.transactions.filter(each => each.duplicate).length} entries hidden
            </div>
            <div className="overflow-auto shadow-md max-h-[400px]">
                <table className="text-xs w-full text-left">
                    <thead className="bg-gray-300">
                        <tr>
                            <th scope="col" className={rowStyle}>
                                Transaction Date
                            </th>
                            <th scope="col" className={rowStyle}>
                                Description
                            </th>
                            <th scope="col" className={rowStyle}>
                                Deposit
                            </th>
                            <th scope="col" className={rowStyle}>
                                Withdrawal
                            </th>
                            <th scope="col" className={rowStyle}>
                                Category
                            </th>
                            <th scope="col" className={rowStyle}>
                                Balance
                            </th>
                            <th scope="col" className={rowStyle}>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="odd:bg-white even:bg-gray-200">
                            <td></td>
                            <td className='whitespace-nowrap px-4 py-2'>START BALANCE</td>
                            <td /><td /><td />
                            <td className={rowStyle}>{statement.transactions.length == 0 ? '0.00' : (statement.transactions[0].ending_balance + statement.transactions[0].withdrawal_amount - statement.transactions[0].deposit_amount).toFixed(2)}</td>
                            <td />
                        </tr>
                        {statement.transactions.map((transaction, index) =>
                            !(!duplicateShower && transaction.duplicate && duplicateChecker) ? <tr
                                /* classname require usestate it update dynamically, hiddent does not */
                                className={'border-gray-200 ' + (transaction.duplicate && showDuplicateHighlight ? "odd:bg-red-200 even:bg-red-300" : "odd:bg-white even:bg-gray-200")}
                                key={index}>
                                <th scope="row" className={rowStyle}>
                                    <input
                                        className={editingId != index ? " pointer-events-none select-text cursor-text max-w-25" : " max-w-25"}
                                        type='date'
                                        name='date'
                                        value={transaction.transaction_date}
                                        onChange={(e) => handleTransactionChange(index, 'transaction_date', e.target.value)}
                                        readOnly={editingId != index}
                                    />
                                </th>
                                <td className={rowStyle}>
                                    {editingId != index ?
                                        <label htmlFor="description" id={"description_" + index}>
                                            {transaction.transaction_description}
                                        </label> :
                                        <textarea
                                            className="border rounded-sm w-full overflow-hidden z-30 h-[65]"
                                            value={transaction.transaction_description}
                                            name='description'
                                            onChange={(e) => handleTransactionChange(index, 'transaction_description', e.target.value)}
                                            readOnly={editingId != index}
                                        />
                                    }
                                </td>
                                <td className={rowStyle}>
                                    {editingId != index ?
                                        <label htmlFor="deposit">
                                            {(transaction.deposit_amount != 0) ? transaction.deposit_amount.toFixed(2) : ''}
                                        </label> :
                                        <input
                                            className="max-w-20 border"
                                            type='number'
                                            name='deposit'
                                            value={transaction.deposit_amount}
                                            onChange={(e) => handleTransactionChange(index, 'deposit_amount', Number(e.target.value))}
                                            readOnly={editingId != index}
                                        />
                                    }
                                </td>
                                <td className={rowStyle}>
                                    {editingId != index ?
                                        <label htmlFor="withdrawal">
                                            {transaction.withdrawal_amount != 0 ? transaction.withdrawal_amount?.toFixed(2) : ''}
                                        </label> :
                                        <input
                                            className="max-w-20 border"
                                            type='number'
                                            name='withdrawal'
                                            value={transaction.withdrawal_amount}
                                            onChange={(e) => handleTransactionChange(index, 'withdrawal_amount', Number(e.target.value))}
                                            readOnly={editingId != index}
                                        />
                                    }

                                </td>
                                <td className={rowStyle}>
                                    <input
                                        className={editingId == index ? "border max-w-25" : 'pointer-events-none max-w-25 select-text cursor-text'}
                                        type='text'
                                        name='category'
                                        value={transaction.category}
                                        onChange={(e) => handleTransactionChange(index, 'category', e.target.value)}
                                        readOnly={editingId != index}
                                    />
                                </td>
                                <td className={rowStyle}>
                                    {editingId != index ?
                                        <label htmlFor="ending balance">
                                            {transaction.ending_balance?.toFixed(2)}
                                        </label> :
                                        <input
                                            className="max-w-20 border"
                                            type='number'
                                            name='ending balance'
                                            value={transaction.ending_balance}
                                            onChange={(e) => handleTransactionChange(index, 'ending_balance', Number(e.target.value))}
                                            readOnly={editingId != index}
                                        />
                                    }
                                </td>
                                <td>
                                    <div className='max-w-full max-h-full flex flex-row justify-center scale-70 space-x-2'>
                                        <div
                                            className="text-blue-600 hover:underline hover:cursor-pointer"
                                            onClick={() => {
                                                fixDecimalPlace(index)
                                                setEditId(editingId == index ? -1 : index)
                                            }}>
                                            {editingId != index ? <SquarePen /> : <Check />}
                                        </div>
                                        <div
                                            className="text-blue-600 hover:underline hover:cursor-pointer"
                                            onMouseUp={() => handleDeleteTransaction(index)}>
                                            <Trash />
                                        </div>
                                    </div>
                                </td>
                            </tr> : null
                        )}
                        <tr className="odd:bg-white even:bg-gray-200">
                            <td></td>
                            <td className='whitespace-nowrap px-4 py-2'>END BALANCE</td>
                            <td /><td /><td />
                            <td className={rowStyle}>{statement.transactions.length == 0 ? '0.00' :
                                statement.transactions[statement.transactions.length - 1].ending_balance.toFixed(2)}</td>
                            <td />
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}