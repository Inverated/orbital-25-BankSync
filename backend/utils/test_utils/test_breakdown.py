import pytest
from backend.utils.rowBreakdown import standardRowBreakdown

@pytest.mark.parametrize(
    "input_row, optional_year, expected_output",
    [
        # Deposit of 100.0, normal spacing
        ("01/15/2023 Grocery 100.00 1200.50", None, ["2023-01-15", "Grocery", 100.0, 1200.5]),
        # Missing year, optional year given, extra spaces between columns
        ("03/20  Grocery    50.00   1500.00", "2024", ["2024-03-20", "Grocery", 50.0, 1500.0]),
        # Deposit present, multiple spaces in description, no year missing
        ("2023-07-04 Gas Station 200.00 1454.50", None, ["2023-07-04", "Gas Station", 200.0, 1454.5]),
        # Withdrawal, missing year, optional used, uneven spacing
        ("11/11  Coffee  5.75 1000.25", "2022", ["2022-11-11", "Coffee", 5.75, 1000.25]),
        # Missing amount field
        ("2023-05-01 Salary 3000.00", None, False),
        # Blank optional year but date has year, deposit
        ("2021-12-31 Bonus 200.00 3000.00", "", ["2021-12-31", "Bonus", 200.0, 3000.0]),
        # Both deposit and withdrawal blank
        ("04/15/2023 Gift  0.00", None, False),
        # Extra spaces, missing year, optional used, deposit
        ("  07/07  Dinner   30.00   970.00  ", "2025", ["2025-07-07", "Dinner", 30.0, 970.0]),
        # Withdrawal with decimal and spaces in description
        ("08/22  Utility Bill  75.25  925.75", "2023", ["2023-08-22", "Utility Bill", 75.25, 925.75]),
    ]
)
def test_rowbreakdown(input_row, optional_year, expected_output):
    if optional_year:
        result = standardRowBreakdown(input_row, optional_year)
    else:
        result = standardRowBreakdown(input_row)
    assert result == expected_output
