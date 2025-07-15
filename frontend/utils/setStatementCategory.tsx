import { StatementResponse } from "./types";

export default function setStatementCategory(statements: StatementResponse[]) {
    statements.map((statement) => {
        statement.transactions.map((entry) => {
            const description = entry.transaction_description.toLowerCase()
            for (const [category, keywords] of Object.entries(keywordMap)) {
                if (keywords.some((kw) => kw in description.split(' '))) {
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
        "starbucks", "mcdonalds", "kfc", "pizza", "burger king",
        "dunkin", "coffee", "restaurant", "cafe", "dominos", "foodpanda", "ubereats"
    ],
    "Shopping": [
        "amazon", "ebay", "etsy", "store", "mall", "nike", "adidas", "zara", "clothing", "shopee", "aliexpress", "taobao"
    ],
    "Transport": ["uber", "taxi", "bus", "train", "gas", "fuel", "shell", "grab"],
    "Income": ["payroll", "salary", "income", "deposit", "bonus"],
    "Transfer": ["fast", 'paylah', "paynow", "trf", "transfer", 'to'],
    "Interest": ["interest"],
    "Payment": ["debit card", "purchase", "nets", "pos", "point-of-sale"],
    "Entertainment": ["netflix", "spotify", "youtube", "cinema", "theatre", "concert", "game", "steam"],
    "Utilities": ["bill", "internet", "wifi", "phone", "mobile", "telecom"],
    "Travel": ["hotel", "flight", "trip", "travel"],
    "Healthcare": ["hospital", "clinic", "pharmacy", "health", "doctor", "dentist"],
    "Withdrawal": ["withdrawal"],
};