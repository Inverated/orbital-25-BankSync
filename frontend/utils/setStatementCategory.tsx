import { StatementResponse } from "./types";

export default function setStatementCategory(statements: StatementResponse[]) {
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

// Allow user to customise rules in future?
const keywordMap: { [category: string]: string[] } = {
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
        'mrt', "bus/mrt"
    ],
    "Income": ["payroll", "salary", "income", "deposit", "bonus"],
    "Transfer": ["fast", 'paylah', "paynow", "trf", "transfer", 'to'],
    "Interest": ["interest"],
    "Payment": ["debit card", "purchase", "nets", "pos", "point-of-sale", "alipay"],
    "Entertainment": ["netflix", "spotify", "youtube", "cinema", "theatre", "concert", "game", "steam"],
    "Utilities": ["bill", "internet", "wifi", "phone", "mobile", "telecom"],
    "Travel": ["hotel", "flight", "trip", "travel"],
    "Healthcare": ["hospital", "clinic", "pharmacy", "health", "doctor", "dentist", "watsons"],
    "Withdrawal": ["withdrawal", "atm"],
};