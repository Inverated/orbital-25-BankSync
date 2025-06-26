import { Account, Transaction } from "@/utils/types";
import { useEffect, useState } from "react";

export default function ExportTable(selectedTable: {
    table: 'account' | 'transaction',
    data: Transaction[] | Account[],
    dataHeader: string[]
}) {
    const [transactionEntry, setTransaction] = useState<Transaction[]>([])
    const [accountEntry, setAccount] = useState<Account[]>([])
    const [tableHeader, setHeader] = useState<string[]>([])

    useEffect(() => {
        // Data load instantly if set both at once
        setTransaction(selectedTable.data as Transaction[])
        setAccount(selectedTable.data as Account[])
        setHeader(selectedTable.dataHeader)
    }, [selectedTable.table, selectedTable.data, selectedTable.dataHeader])

    const rowStyle = "px-4 py-2 whitespace-pre-line max-w-fit overflow-hidden"

    return (
        transactionEntry.length != 0 && accountEntry.length != 0 && <>
            <div className="overflow-auto shadow-md mt-4 max-h-[60vh]">
                {selectedTable.table == 'account' ?
                    <table className="text-xs w-full text-left rtl:text-right text-gray-500">
                        <thead className=" text-gray-700 bg-gray-300">
                            <tr>
                                {tableHeader.map((each, index) =>
                                    <th key={index} scope="col" className={rowStyle}>
                                        {each}
                                    </th>
                                )}

                            </tr>
                        </thead>
                        <tbody>
                            {accountEntry.map((account, index) =>
                                <tr className="odd:bg-white even:bg-gray-300 border-gray-200"
                                    key={index}>
                                    <td className={rowStyle}>
                                        {account.bank_name}
                                    </td>
                                    <td className={rowStyle}>
                                        {account.account_no}
                                    </td>
                                    <td className={rowStyle}>
                                        {account.account_name}
                                    </td>
                                    <td className={rowStyle}>
                                        {account.balance?.toFixed(2)}
                                    </td>
                                    <td className={rowStyle}>
                                        {account.latest_recorded_date}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table> :
                    <table className="overflow-auto flex-col text-xs w-full text-left rtl:text-right text-gray-500">
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
                                    Ending Balance
                                </th>
                                <th scope="col" className={rowStyle}>
                                    Account No
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactionEntry.map((transaction, index) =>
                                <tr className="odd:bg-white even:bg-gray-300 border-gray-200"
                                    key={index}>
                                    <th scope="row" className={rowStyle}>
                                        {transaction.transaction_date}
                                    </th>
                                    <td className={rowStyle + ' break-all'}>
                                        {transaction.transaction_description}
                                    </td>
                                    <td className={rowStyle}>
                                        {transaction.deposit_amount && transaction.deposit_amount != 0 ? transaction.deposit_amount.toFixed(2) : ''}
                                    </td>
                                    <td className={rowStyle}>
                                        {transaction.withdrawal_amount && transaction.withdrawal_amount != 0 ? transaction.withdrawal_amount.toFixed(2) : ''}
                                    </td>
                                    <td className={rowStyle}>
                                        {transaction.category}
                                    </td>
                                    <td className={rowStyle}>
                                        {transaction.ending_balance?.toFixed(2)}
                                    </td>
                                    <td className={rowStyle}>
                                        {transaction.account_no}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                }
            </div>
        </>
    )
}