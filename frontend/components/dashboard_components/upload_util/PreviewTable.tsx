import { Account, Transaction } from "@/utils/types";

export default function PreviewTable({ transactionData, accountData }: { transactionData: Partial<Transaction>[], accountData: Partial<Account> | null }) {
    console.log(accountData)
    return (
        <>
            <div className="text-sm sm:rounded-lg mt-4">
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
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Deposit Amount
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Withdrawal Amount
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionData.map((transaction, index) =>
                            <tr className="odd:bg-white even:bg-gray-300 border-gray-200"
                                key={index}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {transaction.transaction_description}
                                </th>
                                <td className="px-6 py-4">
                                    {transaction.deposit_amount}
                                </td>
                                <td className="px-6 py-4">
                                    {transaction.withdrawal_amount}
                                </td>
                                <td className="px-6 py-4">
                                    {transaction.category}
                                </td>
                                <td className="px-6 py-4">
                                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}