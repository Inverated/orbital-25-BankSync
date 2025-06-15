import { Dayjs } from "dayjs";
import { supabase } from "./supabase"

//need to pass in session later for RLS instead of getting session here
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

export async function getSpendingByDate(date: Dayjs) {
    const start = date.startOf("month").toISOString();
    const end = date.endOf("month").toISOString();

    const { data: transaction_details, error } = await supabase
        .from("transaction_details")
        .select("withdrawal_amount, transaction_date")
        .gte("transaction_date", start)
        .lte("transaction_date", end)
        //.eq("user_id", session.user.id)
    
    if (error) {
        throw error.message;
    }

    console.log("Fetched for month", date.format("MMM YYYY"), transaction_details);

    return transaction_details;
}