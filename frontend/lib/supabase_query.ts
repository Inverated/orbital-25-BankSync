import { Account, Transaction } from "@/utils/types"
import { supabase } from "./supabase"
import decryptData from "@/utils/decryptData"
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import { Dayjs } from "dayjs";

type EncryptedAccount = {
    id?: number,
    created_at?: Timestamp;
    account_no: string;
    account_name: string;
    bank_name: string;
    balance: string;
    user_id?: string;
    latest_recorded_date: string;
}

type EncryptedTransaction = {
    id?: number,
    created_at?: Timestamp;
    user_id?: string;
    transaction_date: string;
    transaction_description: string;
    withdrawal_amount: string;
    deposit_amount: string;
    account_no: string;
    category: string;
    ending_balance: string;
}

export async function getTransactionDetails(
    userId: string,
    selection: (keyof Transaction)[] = [],
    condition: { key: keyof Transaction, value: string[] }[] = [],
    ascending_date: true | false = false,
    date: { startDate: Dayjs, endDate: Dayjs } | null = null
): Promise<Transaction[]> {
    const query = supabase
        .from('encryptedTransactionDetails')
        .select(selection.length == 0 ? '*' : selection.join(','))
        .eq("user_id", userId)

    condition.forEach(({ key, value }) => {
        query.in(key, value)
    })

    if (date) {
        const start = date.startDate.startOf("month").toISOString();
        const end = date.endDate.endOf("month").toISOString();
        console.log(start, end)
        query.gte("transaction_date", start)
            .lte("transaction_date", end)
    }

    const { data: transaction_details, error } = await query
        .order("transaction_date", { ascending: ascending_date })

    if (error) {
        throw error.message
    }

    // Only fetch what you input into selection. getting non existent col from unknown returns undefined
    // no easy workaround that works cause supabase returns GenericStringError as data type when selecting columns dynamically
    const fixedTying = transaction_details as unknown as EncryptedTransaction[]
    const decrypted = await decryptTransaction(fixedTying)
    return decrypted
}

// Analytics tab - Spending by Category
export async function getTransactionCategories(): Promise<{ category: string }[]> {
    const { data: transaction_categories, error } = await supabase
        .rpc("gettransactioncategories");

    if (error) {
        throw error.message;
    }

    return transaction_categories;
}

export async function getAccountDetails(
    userId: string,
    selection: (keyof Account)[] = [],
    condition: { key: keyof Account, value: string[] }[] = []
): Promise<Account[]> {
    let query = supabase
        .from('encryptedAccountDetails')
        .select(selection.length == 0 ? '*' : selection.join(','))
        .eq("user_id", userId)

    condition.forEach(({ key, value }) => {
        query = query.in(key, value)
    })
    const { data: account_details, error } = await query

    if (error) {
        throw error.message
    }
    const fixedTyping = account_details as unknown as EncryptedAccount[]
    const decrypted = await decryptAccounts(fixedTyping)
    return decrypted
}

async function decryptTransaction(transactions: EncryptedTransaction[]): Promise<Transaction[]> {
    const toBeDecrypted: string[][] = []
    transactions.forEach(transaction => toBeDecrypted.push([
        transaction.transaction_description,
        transaction.withdrawal_amount,
        transaction.deposit_amount,
        transaction.ending_balance
    ]))
    const decryptedList = await decryptData(toBeDecrypted)

    const decryptedTransaction: Transaction[] = []

    transactions.map((transaction, index) => decryptedTransaction.push(
        {
            id: transaction.id,
            created_at: transaction.created_at,
            user_id: transaction.user_id,
            transaction_date: transaction.transaction_date,
            transaction_description: decryptedList[index][0],
            withdrawal_amount: Number(decryptedList[index][1]),
            deposit_amount: Number(decryptedList[index][2]),
            account_no: transaction.account_no,
            category: transaction.category,
            ending_balance: Number(decryptedList[index][3])
        }))

    return decryptedTransaction
}

async function decryptAccounts(accounts: EncryptedAccount[]): Promise<Account[]> {
    const toBeDecrypted: string[][] = []
    accounts.forEach(account => toBeDecrypted.push([
        account.balance
    ]))

    const decryptedList = await decryptData(toBeDecrypted)
    const decryptedAccounts: Account[] = []

    accounts.map((account, index) => decryptedAccounts.push({
        id: account.id,
        created_at: account.created_at,
        account_no: account.account_no,
        account_name: account.account_name,
        bank_name: account.bank_name,
        balance: Number(decryptedList[index][0]),
        user_id: account.user_id,
        latest_recorded_date: account.latest_recorded_date
    }))

    return decryptedAccounts
}