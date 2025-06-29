from datetime import datetime
import re
from backend.utils.textFormatter import rmSpaceFromList
from backend.models.keywordDict import monthLookup
from dateutil.parser import parse


def parseDate(text: str, yyyy: str) -> bool | tuple[str, str]:
    '''
        Converts:
            12 Mar, 12 Mar 2025, 12/03/2025, 12-03-2025
        Into:
            yyyy-mm-dd
    '''
    splitted = text.split(' ')
    defaultDate = datetime(int(yyyy), 1, 1)
    
    if monthLookup.get(splitted[3].lower()) != None and splitted[2].isdigit():
        #OCBC format hotfix for double dates
        try:
            date = parse(' '.join(splitted[:2]), dayfirst=True, default=defaultDate)
            return (date.date().isoformat(), splitted[4])
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
    splitted: list[str] = rmSpaceFromList(row.split(' '))

    if len(splitted) < 4:
        return False

    dateResult = parseDate(row.strip(), yyyy)
    if not dateResult:
        return False
    date, descriptionStartWord = dateResult

    testBalance = splitted[-1].replace(',', '')
    testChange = splitted[-2].replace(',', '')

    if '-' in testBalance:
        testBalance = '-' + testBalance.replace('-', '')

    if testBalance.find('.') == -1 or testChange.find('.') == -1:
        return False
    
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
