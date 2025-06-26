from pydantic import BaseModel

class Transaction(BaseModel):
    transaction_date: str = ""
    transaction_description: str = ""
    withdrawal_amount: float = 0.0
    deposit_amount: float = 0.0
    category: str = ""
    amount_changed: float = 0.0
    ending_balance: float = 0.0
    #account_no redundent but keep here for typescript interface
    account_no: str = ""