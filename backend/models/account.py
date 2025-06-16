from typing import List
from pydantic import BaseModel

from backend.models.transaction import Transaction

class Account(BaseModel):
    account_no: str = ''
    account_name: str = ''
    bank_name: str = ''
    balance: float = 0.0
    
class Statement(BaseModel):
    hasData: bool = False
    account: Account = Account()
    transactions: List[Transaction] = [Transaction()]
