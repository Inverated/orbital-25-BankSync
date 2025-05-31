import supabase from "@/app/config/supabaseClient";

const {data: {session}} = await supabase.auth.getSession();

export async function getAccountDetails() {
    if (!session) {
        return null
    }
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
    if (!session) {
        return null
    }
    const { data: transaction_details, error } = await supabase
        .from('transaction_details')
        .select("*")
        // .eq("user_id", session.user.id)
        
    if (error) {
        throw error.message
    }

    return transaction_details
}

export async function getTransactionDetailByAccountNo(account_no: string) {
    if (!session) {
        return null
    }
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
    if (!session) {
        return null
    }
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
    if (!session) {
        return null
    }
    const { data: transaction_details, error } = await supabase
        .from('transaction_details')
        .select("withdrawal_amount")
        //.eq("user_id", session.user.id)
    if (error) {
        throw error.message
    }
    return transaction_details 
}