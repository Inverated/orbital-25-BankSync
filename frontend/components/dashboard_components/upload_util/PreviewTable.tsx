import { Account, StatementResponse, Transaction } from "@/utils/types";
import { useEffect, useState } from "react";

interface Props {
    currIndex: number
    transactionData: Transaction[];
    accountData: Account;
    onUpdate: (index: number, updatedItem: StatementResponse) => void;
    onDelete: (updatedItem: StatementResponse) => void;
    accountInDatabase: Account | undefined;
    duplicateChecker: boolean;
    duplicateShower: boolean;
}


export default function PreviewTable({ currIndex, transactionData, accountData, onUpdate, onDelete, accountInDatabase, duplicateChecker, duplicateShower }: Props) {
    const [editingId, setEditId] = useState(-1)
    const [isLatest, setIsLatest] = useState<'This Latest' | 'Equal' | 'This Older'>('Equal')
    const [loadedTransactionData, setLoadingData] = useState<Transaction[]>(transactionData)
    const [showDuplicateHighlight, setDuplicateHighlight] = useState(true)
    const [showDuplicateRows, setDuplicateShow] = useState(true)

    const handleTransactionChange = (index: number, field: keyof Transaction, newValue: string | number) => {
        transactionData[index] = { ...transactionData[index], [field]: newValue }
        setLoadingData(transactionData)
        const updatedStatement: StatementResponse = { hasData: true, account: accountData, transactions: transactionData }
        onUpdate(currIndex, updatedStatement)
    }

    const handleDelete = (index: number) => {
        setLoadingData(transactionData.splice(index, 1))
        const updatedStatement: StatementResponse = { hasData: true, account: accountData, transactions: transactionData }
        onDelete(updatedStatement)
    }

    const fixDecimalPlace = (index: number) => {
        const transactionRow = transactionData[index]
        transactionData[index] = {
            ...transactionData[index],
            ['withdrawal_amount']: Number(transactionRow.withdrawal_amount.toFixed(2).split('.').join('.')),
            ['deposit_amount']: Number(transactionRow.deposit_amount.toFixed(2).split('.').join('.')),
            ['ending_balance']: Number(transactionRow.ending_balance.toFixed(2).split('.').join('.')),
        }
        setLoadingData(transactionData)
        const updatedStatement: StatementResponse = { hasData: true, account: accountData, transactions: transactionData }
        onUpdate(currIndex, updatedStatement)
    }

    useEffect(() => {
        setLoadingData(transactionData)
        setDuplicateHighlight(duplicateChecker)
        setDuplicateShow(duplicateShower)

        if (!accountInDatabase) {
            setIsLatest('Equal')
        } else if (accountData.latest_recorded_date == accountInDatabase.latest_recorded_date) {
            setIsLatest('Equal')
        } else if (accountData.latest_recorded_date < accountInDatabase.latest_recorded_date) {
            setIsLatest('This Older')
        } else {
            setIsLatest('This Latest')
        }
    }, [loadedTransactionData, duplicateChecker, duplicateShower])
    const rowStyle = "px-4 py-2 whitespace-pre-line max-w-fit"

    return (
        <>
            <div className="text-sm rounded-lg my-3">
                <p>
                    <b>{accountData?.bank_name}</b>
                    {accountData?.account_name && <><b>: </b>{accountData?.account_name}</>}
                </p>
                <p>
                    <b>Account number: </b>
                    {accountData?.account_no}
                </p>
                <p className="span flex flex-row justify-between">
                    <span>
                        <b>{isLatest == 'This Latest' ? "New balance: " : "Balance: "}</b>
                        <span className={isLatest == 'Equal' ? '' : isLatest == 'This Latest' ? "text-green-600" : "text-red-600 line-through"}>
                            ${accountData?.balance?.toFixed(2)}
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
            <div className='text-sm text-end' hidden={!(duplicateChecker && !duplicateShower)}>
                {transactionData.filter(each => each.duplicate).length} entries hidden
            </div>
            <div className="overflow-auto shadow-md max-h-[400px]">
                <table className="text-xs w-full text-left rtl:text-right">
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
                        {transactionData.map((transaction, index) =>
                            <tr
                                hidden={!duplicateShower && transaction.duplicate && duplicateChecker}
                                className={'border-gray-200 ' + (transaction.duplicate && showDuplicateHighlight ? "odd:bg-red-200 even:bg-red-300" : "odd:bg-white even:bg-gray-300")}
                                key={index}>
                                <th scope="row" className={rowStyle}>
                                    <input
                                        className={editingId != index ? "pointer-events-none select-text cursor-text max-w-25" : "max-w-25"}
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
                                            className="max-w-20"
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
                                            className="max-w-20"
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
                                        className={editingId == index ? "border border-gray-400 max-w-25 rounded-sm h-full" : 'pointer-events-none max-w-25 select-text cursor-text'}
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
                                            className="max-w-20"
                                            type='number'
                                            name='ending balance'
                                            value={transaction.ending_balance}
                                            onChange={(e) => handleTransactionChange(index, 'ending_balance', Number(e.target.value))}
                                            readOnly={editingId != index}
                                        />
                                    }
                                </td>
                                <td className={rowStyle + ' space-x-1.5'}>
                                    <a
                                        className="font-medium text-blue-600 hover:underline hover:cursor-pointer"
                                        onClick={() => {
                                            fixDecimalPlace(index)
                                            setEditId(editingId == index ? -1 : index)
                                        }}>
                                        {editingId != index ? 'Edit' : 'Confirm'}
                                    </a>
                                    <a
                                        className="font-medium text-blue-600 hover:underline hover:cursor-pointer"
                                        onMouseUp={() => handleDelete(index)}>
                                        Delete
                                    </a>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}