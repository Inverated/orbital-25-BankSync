import { Dayjs } from "dayjs";
import { supabase } from "./supabase"

//need to pass in session later for RLS instead of getting session here

// Queries for Overview tab
export async function getAccountDetails() {
    const { data: account_details, error } = await supabase
        .from("account_details")
        .select("*")
        //.eq("user_id", session.user.id)
    
    if (error) {
        throw error.message;
    }

    return account_details;
}                

export async function getIncome() {
    const { data: transaction_details, error } = await supabase
        .from("transaction_details")
        .select("deposit_amount")
        //.eq("user_id", session.user.id)
    
    if (error) {
        throw error.message;
    }
    
    return transaction_details;
}

export async function getExpenses() {
    const { data: transaction_details, error } = await supabase
        .from("transaction_details")
        .select("withdrawal_amount")
        //.eq("user_id", session.user.id)
    
    if (error) {
        throw error.message;
    }
    
    return transaction_details; 
}

// Queries for Accounts tab
export async function getTransactionDetailByAccountNo(account_no: string) {
    const { data: transaction_details, error } = await supabase
        .from("transaction_details")
        .select("*")
        // .eq("user_id", session.user.id)
        .eq("account_no", account_no)
    
    if (error) {
        throw error.message;
    }

    return transaction_details;
}

// Queries for Transactions tab
export async function getTransactionDetail() {
    const { data: transaction_details, error } = await supabase
        .from("transaction_details")
        .select("*")
        .order("transaction_date", {ascending:false})
        // .eq("user_id", session.user.id)
    
    if (error) {
        throw error.message;
    }

    return transaction_details;
}

// Queries for Analytics tab
export async function getSpendingByDate(date: Dayjs) {
    const start = date.startOf("month").toISOString();
    const end = date.endOf("month").toISOString();

    const { data: transaction_details, error } = await supabase
        .from("transaction_details")
        .select("transaction_date, withdrawal_amount")
        .gte("transaction_date", start)
        .lte("transaction_date", end)
        //.eq("user_id", session.user.id)
    
    if (error) {
        throw error.message;
    }

    return transaction_details;
}

export async function getTransactionCategories(): Promise<{ category: string }[]> {
    const { data: transaction_categories, error } = await supabase
        .rpc("gettransactioncategories");
    
    if (error) {
        throw error.message;
    }

    return transaction_categories;
}

export async function getSpendingByCategory(category: string) {
    const { data: transaction_details, error } = await supabase
        .from("transaction_details")
        .select("category, withdrawal_amount")
        //.eq("user_id", session.user.id)
        .eq("category", category)
    
    if (error) {
        throw error.message;
    }

    return transaction_details;
}