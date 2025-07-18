import { Transaction } from "@/utils/types";
import encryptData from "@/utils/encryptData"
import { supabase } from "./supabase";

export async function updateTransactionDetails(userId: string, rowId: number, updatedTransaction: Transaction) {
    const toBeEncrypted: string[][] = []

    toBeEncrypted.push([
        updatedTransaction.transaction_description,
        updatedTransaction.withdrawal_amount.toString(),
        updatedTransaction.deposit_amount.toString(),
        updatedTransaction.ending_balance.toString(),
    ])

    const encrypted: string[][] = await encryptData(toBeEncrypted)

    const updateData = {
        account_no: updatedTransaction.account_no,
        transaction_date: updatedTransaction.transaction_date,
        transaction_description: encrypted[0][0],
        withdrawal_amount: encrypted[0][1],
        deposit_amount: encrypted[0][2],
        category: updatedTransaction.category,
        ending_balance: encrypted[0][3],
    }

    const { error } = await supabase
        .from('encryptedTransactionDetails')
        .update(updateData)
        .eq('id', rowId)
        .eq('user_id', userId)

    if (error) throw error
}