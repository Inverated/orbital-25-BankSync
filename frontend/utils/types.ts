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

export type keywordMapType = Map<string, string[]>

export const defaultKeywordMap: { [category: string]: string[] } = {
    "Food and Drinks": [
        "starbucks", "mcdonalds", "mcdonald's", "kfc", "pizza", "burger king", "koufu",
        "dunkin", "coffee", "restaurant", "cafe", "dominos", "foodpanda", "ubereats", "meal"
    ],
    "Online Shopping": [
        "amazon", "ebay", "shopee", "shopeepay", "aliexpress", "taobao", "lazada"
    ],
    "Shopping": [
        "etsy", "store", "mall", "nike", "adidas", "zara",
        "clothing", "supermarket", "don don donki"
    ],
    "Transport": [
        "uber", "taxi", "bus", "train", "gas", "fuel", "shell", "grab",
        "mrt", "bus/mrt"
    ],
    "Income": ["payroll", "salary", "income", "deposit", "bonus"],
    "Transfer": ["fast", "paylah", "paynow", "trf", "transfer", "to"],
    "Interest": ["interest"],
    "Payment": ["debit card", "purchase", "nets", "pos", "point-of-sale", "alipay"],
    "Entertainment": ["netflix", "spotify", "youtube", "cinema", "theatre", "concert", "game", "steam"],
    "Utilities": ["bill", "internet", "wifi", "phone", "mobile", "telecom"],
    "Travel": ["hotel", "flight", "trip", "travel"],
    "Healthcare": ["hospital", "clinic", "pharmacy", "health", "doctor", "dentist", "watsons"],
    "Withdrawal": ["withdrawal", "atm"]
}

export interface Profile {
    user_id: string,
    id?: number,
    created_at?: string,
    category_filter?: {
        [category: string]: string[];
    },
    user_name?: string,
}