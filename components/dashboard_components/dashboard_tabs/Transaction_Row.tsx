export default function Transaction_Row(details: { transaction_description: string; account_no: string; withdrawal_amount: number; deposit_amount: number; category: string; transaction_date: string }) {
    return (
        <div className="flex flex-col justify-between m-4 hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 active:scale-97 transition border border-black rounded-lg">
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
                    Category: {details.category}
                </div>
                <div>
                    {details.transaction_date}
                </div>
            </div>
        </div>
    )
}