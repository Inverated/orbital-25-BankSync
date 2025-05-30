import { Transaction } from "@/components/types";

interface TransactionProps {
    transaction: Transaction;
}

export default function TransactionAmount({ transaction }: TransactionProps) {
    if (transaction.withdrawal_amount === 0) {
        return (
            <div className="text-green-500">
                +${transaction.deposit_amount}
            </div>
        );
    }
    
    if (transaction.deposit_amount === 0) {
        return (
            <div className="text-red-500">
                -${transaction.withdrawal_amount}
            </div>
        );
    }
}