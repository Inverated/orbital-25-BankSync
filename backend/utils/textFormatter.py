
#['','','','Hi','','Bye',''] => ['Hi','Bye']
def rmSpaceFromList(row: list):
    while '' in row:
        row.remove('')
    return [each.strip() for each in row]