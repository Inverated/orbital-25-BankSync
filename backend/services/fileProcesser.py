from typing import Optional
from backend.services import pdfTextProcesser
from backend.utils import pdfReader
from backend.utils.pdfReader import convertToPypdf, decryptPdf


def fileParser(content: bytes, extension: str, password: Optional[str]):
    if (extension == 'pdf'):
        return parsePdf(content, password)
    elif (extension == 'csv'):
        return (False, 'Not implemented yet')



def parsePdf(content: bytes, password: Optional[str]):
    pypdf = convertToPypdf(content)
    if (pdfReader.isPasswordProtected(pypdf)):
        if password == None:
            return (False, 'Require Password')
        else:
            pypdf = decryptPdf(pypdf, password)
            if pypdf == None:
                return (False, 'Invalid Password')
    
    #Remove copy protection (Encryption != password only)
    pypdf = pdfReader.stripEncryption(pypdf)
    extractedText = pdfReader.extractText(pypdf)
    

    if extractedText == []:
        return (False, 'File cannot be read, ensure it is text and can be selected')
    bank = pdfTextProcesser.detectBank(extractedText)
    
    #try:
    match bank:
        case 'DBS':
            return pdfTextProcesser.processDBS(extractedText)
        case 'UOB':
            return pdfTextProcesser.processUOB(extractedText)
        case 'OCBC':
            # pdf have weird formatting or some shit for ocbc pdf
            # takes very long for pdf plumber to extract text 
            # similar object count in each page to other pdf
            # see objects = page.objects
            # might be char object got some stupid complicated formatting shit
                   
            return pdfTextProcesser.processOCBC(extractedText)     
        case 'SC':
            return pdfTextProcesser.processSC(extractedText)
        case _:
            return (False, 'Invalid bank type. Please use supported bank types only.')
    #except Exception as e:
    #    return (False, e)

