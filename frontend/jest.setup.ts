import "@testing-library/jest-dom";
import { Account, Transaction } from "./utils/types";
import dayjs from "dayjs";
import * as databaseQuery from "@/lib/databaseQuery";

export const testTransactions: Transaction[] = [
    {
        transaction_date: "2024-06-01",
        transaction_description: "salary",
        withdrawal_amount: 0,
        deposit_amount: 1000,
        account_no: "12345",
        category: "salary",
        ending_balance: 1000,
    },
    {
        transaction_date: "2024-06-10",
        transaction_description: "transfer",
        withdrawal_amount: 0,
        deposit_amount: 500,
        account_no: "12345",
        category: "transfer",
        ending_balance: 1500,
    },
    {
        transaction_date: "2024-06-11",
        transaction_description: "food",
        withdrawal_amount: 200,
        deposit_amount: 0,
        account_no: "12345",
        category: "food",
        ending_balance: 1300,
    },
    {
        transaction_date: "2024-06-30",
        transaction_description: "food",
        withdrawal_amount: 100,
        deposit_amount: 0,
        account_no: "12345",
        category: "food",
        ending_balance: 1200,
    },
]

export const testAccounts: Account[] = [
    {
        account_name: "account 1",
        account_no: '12345',
        bank_name: 'bank 1',
        balance: 100,
        latest_recorded_date: dayjs("2024-06-30").toISOString(),
    },
    {
        account_name: "account 2",
        account_no: '54321',
        bank_name: 'bank 2',
        balance: 1000,
        latest_recorded_date: dayjs("2024-05-30").toISOString(),
    },
]

jest.mock('@/context/DatabaseContext', () => ({
    useDatabase: () => ({
        refreshDatabase: jest.fn(),
        loaded: true,
        transactions: testTransactions,
        accounts: testAccounts
    }),
}));

jest.mock('@/context/UserContext', () => ({
    useUserId: () => ({
        userId: 'User ID',
    }),
}));

jest.mock('@/context/ProfileContext', () => ({
    useProfile: () => ({
        profile: { user_name: "mock name"},
        keywordMap: {},
        refreshProfile: jest.fn(),
        refreshStatus: true,
    }),
}));

jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn()
}));

jest.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: jest.fn().mockResolvedValue({
                data: { session: { user: { id: 'mock id' } } },
                error: null,
            }),
            updateUser: jest.fn().mockResolvedValue({
                error: null,
            }),
            signOut: jest.fn().mockResolvedValue({
                error: null,
            }),
        },
    },
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

jest.spyOn(databaseQuery, "getTransactionDetails").mockImplementation(({ transactions, date }) => {
    return transactions.filter(transaction => {
        const transactionDate = dayjs(transaction.transaction_date);

        if (date && date.startDate && date.endDate) {
            return (transactionDate >= date.startDate && transactionDate <= date.endDate);
        } else {
            return true;
        }
    })
})

jest.spyOn(databaseQuery, "getAccountDetails").mockImplementation(({ accounts, condition }) => {
    let filtered: Account[] = [...accounts]
    if (condition) condition.forEach(({ key, value }) => {
        filtered = filtered.filter(entry => {
            const item = entry[key]
            if (item && value.includes(item.toString())) {
                return true
            }
        })
    })

    return filtered
})