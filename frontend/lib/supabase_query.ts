import { supabase } from "./supabase"

//need to pass in session later for RLS instead of getting session here
export async function getAccountDetails() {
    const { data: account_details, error } = await supabase
        .from('account_details')
        .select("*")
        //.eq("user_id", session.user.id)
    if (error) {
        throw error.message
    }
    return account_details
}                

export async function getTransactionDetail() {
    const { data: transaction_details, error } = await supabase
        .from('transaction_details')
        .select("*")
        .order("transaction_date", {ascending:false})
        //.eq("user_id", user_id)
    if (error) {
        throw error.message
    }
    return transaction_details
}

export async function getTransactionDetailByAccountNo(account_no: string) {
    const { data: transaction_details, error } = await supabase
        .from('transaction_details')
        .select("*")
        // .eq("user_id", session.user.id)
        .eq("account_no", account_no)
    if (error) {
        throw error.message
    }
    return transaction_details
}

export async function getIncome() {
    const { data: transaction_details, error } = await supabase
        .from('transaction_details')
        .select("deposit_amount")
        //.eq("user_id", session.user.id)
    if (error) {
        throw error.message
    }
    return transaction_details 
}

export async function getExpenses() {
    const { data: transaction_details, error } = await supabase
        .from('transaction_details')
        .select("withdrawal_amount")
        //.eq("user_id", session.user.id)
    if (error) {
        throw error.message
    }
    return transaction_details 
}