import { Account, StatementResponse, Transaction } from "@/utils/types";
import { useState } from "react";

interface Props {
    currIndex: number
    transactionData: Transaction[];
    accountData: Account;
    onUpdate: (index: number, updatedItem: StatementResponse) => void
}


export default function PreviewTable({ currIndex, transactionData, accountData, onUpdate }: Props) {
    const [editingId, setEditId] = useState(-1)

    const handleTransactionChange = (index: number, field: keyof Transaction, newValue: string | number) => {
        transactionData[index] = { ...transactionData[index], [field]: newValue }
        const updatedStatement: StatementResponse = { hasData: true, account: accountData, transactions: transactionData }
        onUpdate(currIndex, updatedStatement)
    }

    const fixDecimalPlace = (index: number) => {
        const transactionRow = transactionData[index]
        transactionData[index] = {
            ...transactionData[index],
            ['withdrawal_amount']: Number(transactionRow.withdrawal_amount.toFixed(2).split('.').join('.')),
            ['deposit_amount']: Number(transactionRow.deposit_amount.toFixed(2).split('.').join('.')),
            ['ending_balance']: Number(transactionRow.ending_balance.toFixed(2).split('.').join('.')),
        }
        const updatedStatement: StatementResponse = { hasData: true, account: accountData, transactions: transactionData }
        onUpdate(currIndex, updatedStatement)
    }

    const rowStyle = "px-4 py-2 whitespace-pre-line max-w-fit"

    return (
        <>
            <div className="text-sm rounded-lg mt-4">
                <p>
                    <b>{accountData?.bank_name}</b>
                    {accountData?.account_name && <><b>: </b>{accountData?.account_name}</>}
                </p>
                <p>
                    <b>Account number: </b>
                    {accountData?.account_no}
                </p>
                <p>
                    <b>Balance: </b>
                    ${accountData?.balance?.toFixed(2)}
                </p>
            </div>
            <div className="overflow-auto shadow-md mt-4 max-h-[400px]">
                <table className="text-xs w-full text-left rtl:text-right text-gray-500">
                    <thead className=" text-gray-700 bg-gray-300">
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
                            <tr className="odd:bg-white even:bg-gray-300 border-gray-200"
                                key={index}>
                                <th scope="row" className={rowStyle}>
                                    <input
                                        className={editingId != index ? "pointer-events-none select-text cursor-text max-w-25" : "max-w-25"}
                                        type='date'
                                        value={transaction.transaction_date}
                                        onChange={(e) => handleTransactionChange(index, 'transaction_date', e.target.value)}
                                        readOnly={editingId != index}
                                    />
                                </th>
                                <td className={rowStyle}>
                                    {editingId != index ?
                                        <div id={"description_" + index}>
                                            {transaction.transaction_description}
                                        </div> :
                                        <textarea
                                            className="border rounded-sm w-full overflow-hidden z-30 h-[65]"
                                            value={transaction.transaction_description}
                                            onChange={(e) => handleTransactionChange(index, 'transaction_description', e.target.value)}
                                            readOnly={editingId != index}
                                        />
                                    }
                                </td>
                                <td className={rowStyle}>
                                    {editingId != index ?
                                        <div>
                                            {(transaction.deposit_amount != 0) ? transaction.deposit_amount.toFixed(2) : ''}
                                        </div> :
                                        <input
                                            className="max-w-20"
                                            type='number'
                                            value={transaction.deposit_amount}
                                            onChange={(e) => handleTransactionChange(index, 'deposit_amount', Number(e.target.value))}
                                            readOnly={editingId != index}
                                        />
                                    }
                                </td>
                                <td className={rowStyle}>
                                    {editingId != index ?
                                        <div>
                                            {transaction.withdrawal_amount != 0 ? transaction.withdrawal_amount?.toFixed(2) : ''}
                                        </div> :
                                        <input
                                            className="max-w-20"
                                            type='number'
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
                                        value={transaction.category}
                                        onChange={(e) => handleTransactionChange(index, 'category', e.target.value)}
                                        readOnly={editingId != index}
                                    />
                                </td>
                                <td className={rowStyle}>
                                    {editingId != index ?
                                        <div>
                                            {transaction.ending_balance?.toFixed(2)}
                                        </div> :
                                        <input
                                            className="max-w-20"
                                            type='number'
                                            value={transaction.ending_balance}
                                            onChange={(e) => handleTransactionChange(index, 'ending_balance', Number(e.target.value))}
                                            readOnly={editingId != index}
                                        />
                                    }
                                </td>
                                <td className={rowStyle}>
                                    <a
                                        className="font-medium text-blue-600 hover:underline hover:cursor-pointer"
                                        onClick={() => {
                                            fixDecimalPlace(index)
                                            setEditId(editingId == index ? -1 : index)
                                        }}>
                                        {editingId != index ? 'Edit' : 'Confirm'}
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