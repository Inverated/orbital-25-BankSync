import "@testing-library/jest-dom";
import { Account, defaultKeywordMap, StatementResponse, Transaction, uploadReturnData } from "./utils/types";
import dayjs from "dayjs";
import * as databaseQuery from "@/lib/databaseQuery";

jest.mock('@/context/UserContext', () => ({
    useUserId: () => ({
        userId: 'User ID',
    }),
}));

jest.mock('@/context/ProfileContext', () => ({
    useProfile: () => ({
        profile: { user_name: "mock name" },
        //keywordMap: new Map(Object.entries(defaultKeywordMap)),
        keywordMap: [],
        refreshProfile: jest.fn(),
        refreshStatus: true,
    }),
}));

jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn()
}));

jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            upsert: jest.fn().mockResolvedValue({
                error: null
            })
        })),
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
            getUser: jest.fn().mockResolvedValue({
                data: {
                    user: {
                        app_metadata: { providers: ['google'] }
                    }
                }
            })
        },
    },
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
    useRouter: jest.fn(() => ({
        push: jest.fn()
    }))
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
