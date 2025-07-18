import { keywordMapType, StatementResponse } from "./types";

export default function setStatementCategory(statements: StatementResponse[], keywordMap: keywordMapType) {
    statements.forEach((statement) => {
        statement.transactions.forEach((entry) => {
            const description = entry.transaction_description.toLowerCase() + ' '
            for (const [category, keywords] of Object.entries(keywordMap)) {
                if (keywords.some((kw) => description.includes(kw + ' '))) {
                    entry.category = category
                    break
                }
            }
            if (entry.category == '') {
                entry.category = 'Others'
            }
        })
    })
}