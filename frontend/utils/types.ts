import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Account {
    id?: number,
    created_at?: Timestamp;
    account_no: string;
    account_name: string;
    bank_name: string;
    balance: number;
    user_id?: string;
    latest_recorded_date: string;
}

export interface Transaction {
    id?: number,
    created_at?: Timestamp;
    user_id?: string;
    duplicate?: boolean;
    transaction_date: string;
    transaction_description: string;
    withdrawal_amount: number;
    deposit_amount: number;
    account_no: string;
    category: string;
    ending_balance: number;
}

export interface StatementResponse {
    hasData: boolean;
    account: Account;
    transactions: Transaction[];
}

export interface uploadReturnData {
    filename: string;
    content_type: string;
    success: boolean;
    error: string;
    data: StatementResponse[];
}
