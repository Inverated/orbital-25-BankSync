from pydantic import BaseModel

class Transaction(BaseModel):
    transaction_date: str = ""
    transaction_description: str = ""
    withdrawal_amount: int = 0
    deposit_amount: int = 0
    category: str = ""