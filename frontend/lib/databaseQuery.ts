import { Account, Transaction } from "@/utils/types"
import { Dayjs } from "dayjs";

export type TransactionDetails = {
    transactions: Transaction[];
    condition?: { key: keyof Transaction, value: string[] }[];
    ascending_date?: boolean;
    date?: { startDate: Dayjs | null, endDate: Dayjs | null } | null;
}

export type AccountDetails = {
    accounts: Account[];
    condition?: { key: keyof Account, value: string[] }[];
}

export function getTransactionDetails({
    transactions,
    condition = [],
    ascending_date = false,
    date = null
}: TransactionDetails): Transaction[] {

    let filtered: Transaction[] = [...transactions]

    condition.forEach(({ key, value }) => {
        filtered = filtered.filter(entry => {
            const item = entry[key as keyof Transaction]
            if (item && value.includes(item.toString())) {
                return true
            }
        })
    })

    if (date) {
        if (date.startDate) {
            const start = date.startDate.startOf("month").toISOString();
            filtered.filter(each => each.transaction_date >= start)
        }
        if (date.endDate) {
            const end = date.endDate.endOf("month").toISOString();
            filtered.filter(each => each.transaction_date <= end)
        }
    }

    if (ascending_date) {
        filtered.sort((fst, snd) => fst.transaction_date > snd.transaction_date ? 1 : fst == snd ? 0 : -1)
    } else {
        filtered.sort((fst, snd) => fst.transaction_date < snd.transaction_date ? 1 : fst == snd ? 0 : -1)
    }
    return filtered
}

export function getAccountDetails({
    accounts,
    condition = []
} : AccountDetails): Account[] {
    
    let filtered: Account[] = [...accounts]

    condition.forEach(({ key, value }) => {
        filtered = filtered.filter(entry => {
            const item = entry[key as keyof Account]
            if (item && value.includes(item.toString())) {
                return true
            }
        })
    })

    return filtered
}
