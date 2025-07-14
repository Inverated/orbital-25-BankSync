from backend.models.account import Statement


def assignWithdrawDeposit(statement: Statement, initialBal: float):
    for index, transaction in enumerate(statement.transactions):
        if index == 0:
            if transaction.ending_balance > initialBal:
                transaction.deposit_amount = transaction.amount_changed
            else:
                transaction.withdrawal_amount = transaction.amount_changed
            continue

        if transaction.ending_balance > statement.transactions[index - 1].ending_balance:
            transaction.deposit_amount = transaction.amount_changed
        else:
            transaction.withdrawal_amount = transaction.amount_changed


def setLatestDate(transaction: Statement):
    if len(transaction.transactions) == 0:
        return
    fst = transaction.transactions[0].transaction_date
    snd = transaction.transactions[-1].transaction_date
    if fst > snd:
        transaction.account.latest_recorded_date = fst
    else:
        transaction.account.latest_recorded_date = snd