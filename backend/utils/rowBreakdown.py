import re
from backend.utils.textFormatter import rmSpaceFromList
from backend.models.keywordDict import monthLookup


def parseDate(text: str, yyyy: str) -> bool | tuple[str, str]:
    '''
        Converts:
            12 Mar, 12 Mar 2025, 12/03/2025, 12-03-2025
        Into:
            yyyy-mm-dd
    '''
    splitted = re.split(r'[^a-zA-Z0-9]+', text)
    mm = ''
    dd = ''

    descriptionStartIndex = 2
    testYear = splitted[2]
    
    # 2nd date column for date where value is credited
    # Description first row cannot be a date. why sc, why do you want to add a useless date on top
    hasValueCreditedDate = monthLookup.get(splitted[3].lower()) != None or ((len(splitted) > 8) and monthLookup.get(splitted[4].lower()) != None)

    if testYear.isdigit() and not hasValueCreditedDate:
        if len(testYear) == 2:
            yyyy = '20' + testYear
            descriptionStartIndex = 3
        elif len(testYear) == 4:
            yyyy = testYear
            descriptionStartIndex = 3
    
    if hasValueCreditedDate:
        descriptionStartIndex *= 2
        
    if monthLookup.get(splitted[0].lower()) != None:
        mm = monthLookup.get(splitted[0].lower())
        dd = splitted[1]
    elif monthLookup.get(splitted[1].lower()) != None:
        mm = monthLookup.get(splitted[1].lower())
        dd = splitted[0]
    elif not splitted[0].isdigit() and not splitted[1].isdigit():
        # both not numbers and cannot find a match in month dict
        return False
    else:
        dd = splitted[0]
        mm = splitted[1]
        
    return (yyyy + '-' + mm + '-' + dd, splitted[descriptionStartIndex])


def standardRowBreakdown(row: str, yyyy: str = '1900') -> list[str] | bool:
    '''
        For row arrangement: date    description    deposit/empty   withdrawal/empty   balance
        Converts row into a list of [date, description, deposit/withdrawal, balance]
    '''
    splitted: list[str] = rmSpaceFromList(row.split(' '))

    if len(splitted) <= 4:
        return False

    dateResult = parseDate(row.strip(), yyyy)
    if not dateResult:
        return False
    date, descriptionStartWord = dateResult
    
    testBalance = splitted[-1].replace(',', '')
    testChange = splitted[-2].replace(',', '')
    
    if '-' in testBalance:
        testBalance = '-' + testBalance.replace('-', '')
        
    try:
        balance = float(testBalance)
        change = float(testChange)
    except:
        return False
    
    descriptionStartIndex = 1
    for index, item in enumerate(splitted):
        if descriptionStartWord in item:
            descriptionStartIndex = index
            break
               
    description = ' '.join(splitted[descriptionStartIndex: -2])
    return [date, description, change, balance]
    
    
