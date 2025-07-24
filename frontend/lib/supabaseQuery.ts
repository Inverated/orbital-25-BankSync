import { Account, Profile, Transaction } from "@/utils/types"
import { supabase } from "./supabase"
import decryptData from "@/utils/decryptData"
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

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

export async function queryTransactionDetails(userId: string): Promise<Transaction[]> {
    const { data: transaction_details, error } = await supabase
        .from('encryptedTransactionDetails')
        .select('*')
        .eq('user_id', userId)

    if (error) {
        throw error.message
    }

    const fixedTying = transaction_details as EncryptedTransaction[]
    const decrypted = await decryptTransaction(fixedTying)

    decrypted.sort((fst, snd) => fst.transaction_date < snd.transaction_date ? 1 : fst == snd ? 0 : -1)

    return decrypted
}

export async function queryAccountDetails(userId: string): Promise<Account[]> {
    const { data: account_details, error } = await supabase
        .from('encryptedAccountDetails')
        .select('*')
        .eq('user_id', userId)

    if (error) {
        throw error.message
    }

    const fixedTyping = account_details as EncryptedAccount[]
    const decrypted = await decryptAccount(fixedTyping)

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

    transactions.forEach((transaction, index) => decryptedTransaction.push(
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

async function decryptAccount(accounts: EncryptedAccount[]): Promise<Account[]> {
    const toBeDecrypted: string[][] = []

    accounts.forEach(account => toBeDecrypted.push([
        account.balance
    ]))

    const decryptedList = await decryptData(toBeDecrypted)
    const decryptedAccounts: Account[] = []

    accounts.forEach((account, index) => decryptedAccounts.push({
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

export async function queryProfileDetails(userId: string, userName?:string): Promise<Profile> {
    const { data: profileDetails, error } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', userId)

    if (error) {
        throw error.message
    }

    const profile = profileDetails[0] as Profile | undefined;

    // if profile doesnt exist, insert one
    if (!profile) {
        const newProfile: Profile = { user_id: userId, user_name: userName}
        await supabase.from('profile')
            .upsert(newProfile, { onConflict: 'user_id' })
    
    // if profile exists but user_name is null, update it
    } else if (!profile.user_name && userName) {
        await supabase.from('profile')
            .update({ user_name: userName })
            .eq('user_id', userId)
    }

    const { data: updatedProfileDetails, error: finalError } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', userId)

    if (finalError) {
        throw finalError
    }
    
    return updatedProfileDetails[0] as Profile
}