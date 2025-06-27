import { Account, Transaction } from "@/utils/types"
import { supabase } from "./supabase"

export async function getTransactionDetails<TransKey extends (keyof Transaction)[]>(
    userId: string,
    selection: (keyof Transaction)[] = [],
    condition: { key: keyof Transaction, value: string[] }[] = [], ascending_date: true | false = false
): Promise<Pick<Transaction, TransKey[number]>[]> {
    // Keys[number] 
    const query = supabase
        .from('transaction_details')
        .select(selection.length == 0 ? '*' : selection.join(','))
        .eq("user_id", userId)

    condition.forEach(({ key, value }) => {
        query.in(key, value)
    })

    const { data: transaction_details, error } = await query
        .order("transaction_date", { ascending: ascending_date })

    if (error) {
        throw error.message
    }
    return transaction_details as unknown as Pick<Transaction, TransKey[number]>[]
}

export async function getAccountDetails<AccKeys extends (keyof Account)[]>(
    userId: string,
    selection: (keyof Account)[] = [],
    condition: { key: keyof Account, value: string[] }[] = []
): Promise<Pick<Account, AccKeys[number]>[]> {
    let query = supabase
        .from('account_details')
        .select(selection.length == 0 ? '*' : selection.join(','))
        .eq("user_id", userId)

    condition.forEach(({ key, value }) => {
        query = query.in(key, value)
    })
    const { data: account_details, error } = await query

    if (error) {
        throw error.message
    }
    return account_details as unknown as Pick<Account, AccKeys[number]>[]
}