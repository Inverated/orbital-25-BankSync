interface MoneyInMoneyOutProps {
    account_no: string,
}

export default function MoneyInMoneyOut({ account_no } : MoneyInMoneyOutProps) {
    return (
        <div>
            {account_no}
        </div>
    )
}