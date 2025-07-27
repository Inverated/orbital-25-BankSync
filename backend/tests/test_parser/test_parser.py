import json
import pytest
from backend.services.fileProcesser import fileParser

test_site = 'backend/tests/test_parser/test_files/'


@pytest.mark.parametrize(
    "test_file, file_type, result_file, error_message", [
        (test_site + "SC_test.txt", 'txt', test_site + "result_files/SC_result.json", None),
        (test_site + "DBS_test.txt", 'txt', test_site + "result_files/DBS_result.json", None),
        (test_site + "OCBC_test.txt", 'txt', test_site + "result_files/OCBC_result.json", None),
        (test_site + "UOB_test.txt", 'txt', test_site + "result_files/UOB_result.json", None),
        (test_site + "UOB_test.txt", '', None, 'Please use a valid file extension'),
        (test_site + "UOB_test.txt", 'not a thing', None, 'Please use a valid file extension'),
        
    ]
)
def test_parser(test_file, file_type, result_file, error_message):
    with open(test_file, 'rb') as file:
        parsed = fileParser(file.read(), file_type, None)

        if parsed[0]:
            json_str = [a.model_dump() for a in parsed[1]]
            with open(result_file, 'r') as res:
                expected = json.load(res)
                assert json_str == expected
        else:
            assert parsed[1] == error_message
