from datetime import datetime
from backend.models.keywordDict import monthLookup
from dateutil.parser import parse

from backend.utils.textFormatter import rmSpaceFromList


def parseDate(splitted: list[str], yyyy: str) -> bool | tuple[str, str]:
    '''
        Converts:
            12 Mar, 12 Mar 2025, 12/03/2025, 12-03-2025
        Into:
            yyyy-mm-dd
    '''
    defaultDate = datetime(int(yyyy), 1, 1)
    
    if monthLookup.get(splitted[3].lower()) != None and splitted[2].isdigit():
        # OCBC format fix for double dates
        # dd mmm dd mmm ...
        try:
            date = parse(' '.join(splitted[:2]), dayfirst=True, default=defaultDate)
            return (date.date().isoformat(), splitted[4])
        except:
            None
    elif len(splitted[0]) == len(splitted[1]) and len(splitted[0]) > 2 and monthLookup.get(splitted[1]) == None:
        # length of transaction and credited date same, shortest possible d/m d/m, ensure 2nd d/m is not month
        # 1/1 1/1 ...,  not 1 May ... 
        # dd/mm dd/mm ...
        try:
            date = parse(splitted[0], dayfirst=True, default=defaultDate)
            date2 = parse(splitted[1], dayfirst=True, default=defaultDate)
            if date.month == date2.month:
                return (date.date().isoformat(), splitted[2])
        except:
            None
            
    for index in range(3, 0, -1):
        descriptionStartIndex = index
        
        each = ' '.join(splitted[:index])
        try:
            # Detect standard iso date format before checking for other format
            # Will detect wrongly later since iso is month first
            date = datetime.strptime(each, "%Y-%m-%d")  
            return (date.date().isoformat(), splitted[descriptionStartIndex])
        except:
            None
        try:
            date = parse(each, dayfirst=True, default=defaultDate)
            return (date.date().isoformat(), splitted[descriptionStartIndex])
        except:
            continue
    return False


def standardRowBreakdown(row: str, yyyy: str = '1900') -> list[str] | bool:
    '''
        For row arrangement: date    description    deposit/empty   withdrawal/empty   balance
        Converts row into a list of [date, description, deposit/withdrawal, balance]
    '''
    splitted: list[str] = rmSpaceFromList(row.strip().split(' '))

    if len(splitted) < 4:
        return False

    dateResult = parseDate(splitted, yyyy)
    if not dateResult:
        return False
    date, descriptionStartWord = dateResult

    testBalance = splitted[-1].replace(',', '')
    testChange = splitted[-2].replace(',', '')
    testOptional = splitted[-3].replace(',','')

    if '-' in testBalance:
        testBalance = '-' + testBalance.replace('-', '')

    if testBalance.find('.') == -1 or testChange.find('.') == -1:
        return False
    
    descriptionEndIndex = -2
    
    try:
        balance = float(testBalance)
        change = float(testChange)
        try:
            optional = float(testOptional)
            if (change == 0.00) ^ (optional == 0.00):
                if change == 0.00:
                    change = optional
                descriptionEndIndex = -3
        except:
            None
    except:
        return False

    descriptionStartIndex = 1
    for index, item in enumerate(splitted):
        if descriptionStartWord in item:
            descriptionStartIndex = index
            break

    description = ' '.join(splitted[descriptionStartIndex: descriptionEndIndex])
    return [date, description, change, balance]
