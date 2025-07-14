import { StatementResponse, Transaction } from "./types";

export function duplicateChecking(statements: StatementResponse[], existingTransactions: Transaction[]) {
    const dbSet = new Set(existingTransactions.map(each => {
        const description = each.transaction_description.replaceAll('\n', '').replaceAll(' ', '')
        return '' + each.transaction_date + description + each.deposit_amount.toString() +
            each.withdrawal_amount.toString() + each.category + each.ending_balance.toString()
    }))
    statements.map(statement => {
        statement.transactions.map(each => {
            const description = each.transaction_description.replaceAll(' ', '').replaceAll('\n', '')
            each.duplicate = dbSet.has('' + each.transaction_date + description + each.deposit_amount.toString() +
                each.withdrawal_amount.toString() + each.category + each.ending_balance.toString())
        })
    })
}