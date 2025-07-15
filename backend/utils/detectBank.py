from backend.models.keywordDict import bankKeywords

def detectBank(textList: list[str]) -> str:
    freqList = dict.fromkeys(bankKeywords, 0)
    for line in textList:
        for key, values in bankKeywords.items():
            if any(keywords in line.lower() for keywords in values):
                freqList[key] += 1

    bank = None
    highestFreq = 0
    for key, freq in freqList.items():
        if (freq > highestFreq) and (freq != 0):
            bank = key
            highestFreq = freq
    return bank
