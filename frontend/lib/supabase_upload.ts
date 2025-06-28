import { Account, StatementResponse, Transaction } from "@/utils/types";
import encryptData from "@/utils/encryptData"
import { supabase } from "./supabase";

export async function addStatements(userId: string, statements: StatementResponse[]): Promise<Error | null> {
    try {
        await Promise.all(statements.map(async statement => {
            await addAccountDetails(userId, statement.account).then(() => addTransactionDetails(userId, statement.transactions))
        }))
        return null
    } catch (error) {
        console.error(error)
        return error instanceof Error ? error : new Error('Unknown error');
    }
}

async function addAccountDetails(userId: string, account: Account) {
    const encrypted: string[][] = await encryptData([
        [account.balance.toString()]
    ])

    const upsertData = {
        user_id: userId,
        account_no: account.account_no,
        account_name: account.account_name,
        bank_name: account.bank_name,
        balance: encrypted[0][0],
        latest_recorded_date: account.latest_recorded_date
    }

    const { error } = await supabase
        .from('encryptedAccountDetails')
        .upsert(upsertData,
            { onConflict: 'account_no' }
        )
    if (error) throw error
}

async function addTransactionDetails(userId: string, transactions: Transaction[]) {
    const toBeEncrypted: string[][] = []

    transactions.forEach(entry => {
        toBeEncrypted.push([
            entry.transaction_description,
            entry.withdrawal_amount.toString(),
            entry.deposit_amount.toString(),
            entry.ending_balance.toString(),
        ])
    })

    const encrypted: string[][] = await encryptData(toBeEncrypted)

    const upsertData = await Promise.all(
        transactions.map(async (entry, index) => ({
            user_id: userId,
            account_no: entry.account_no,
            transaction_date: entry.transaction_date,
            transaction_description: encrypted[index][0],
            withdrawal_amount: encrypted[index][1],
            deposit_amount: encrypted[index][2],
            category: entry.category,
            ending_balance: encrypted[index][3],
        })))

    const { error } = await supabase
        .from('encryptedTransactionDetails')
        .insert(upsertData)

    if (error) throw error
}