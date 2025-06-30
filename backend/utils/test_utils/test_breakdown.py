import pytest
from backend.utils.rowBreakdown import standardRowBreakdown

@pytest.mark.parametrize(
    "input_row, optional_year, expected_output",
    [
        # Date formating tests
        ("15/1/2023 Food 100.00 1200.50", None, ["2023-01-15", "Food", 100.0, 1200.5]),
        ("15-01-2023 Food 100.00 1200.50", None, ["2023-01-15", "Food", 100.0, 1200.5]),
        ("15 01 2023 Food 100.00 1200.50", None, ["2023-01-15", "Food", 100.0, 1200.5]),
        ("15.01.2023 Food 100.00 1200.50", None, ["2023-01-15", "Food", 100.0, 1200.5]),
        ("15/01 Food 100.00 1200.50", None, ["1900-01-15", "Food", 100.0, 1200.5]),
        ("15-01 Food 100.00 1200.50", None, ["1900-01-15", "Food", 100.0, 1200.5]),
        ("15 01 Food 100.00 1200.50", None, ["1900-01-15", "Food", 100.0, 1200.5]),
        ("15.01 Food 100.00 1200.50", None, ["1900-01-15", "Food", 100.0, 1200.5]),
        ("15/01/2023 Food 100.00 1200.50", '2000', ["2023-01-15", "Food", 100.0, 1200.5]),
        ("15-01-2023 Food 100.00 1200.50", '2000', ["2023-01-15", "Food", 100.0, 1200.5]),
        ("15 01 2023 Food 100.00 1200.50", '2000', ["2023-01-15", "Food", 100.0, 1200.5]),
        ("15.01.2023 Food 100.00 1200.50", '2000', ["2023-01-15", "Food", 100.0, 1200.5]),
        ("15/01 Food 100.00 1200.50", '2000', ["2000-01-15", "Food", 100.0, 1200.5]),
        ("15-01 Food 100.00 1200.50", '2000', ["2000-01-15", "Food", 100.0, 1200.5]),
        ("15 01 Food 100.00 1200.50", '2000', ["2000-01-15", "Food", 100.0, 1200.5]),
        ("15.01 Food 100.00 1200.50", '2000', ["2000-01-15", "Food", 100.0, 1200.5]),
        ("141100 Food 100.00 1200.50", None, ["2000-11-14", "Food", 100.0, 1200.5]),
        # Deposit present, multiple spaces in description, no year missing
        ("2023-07-04 Gas Station 200.00 1454.50", None, ["2023-07-04", "Gas Station", 200.0, 1454.5]),
        # Withdrawal, missing year, optional used, uneven spacing
        ("11/11  Coffee  5.75 1000.25", "2022", ["2022-11-11", "Coffee", 5.75, 1000.25]),
        # Missing amount field
        ("2023-05-01 Salary 3000.00", None, False),
        # Both deposit and withdrawal blank
        ("14/5/2023 Gift  0.00", None, False),
        # Extra spaces, missing year, optional used, deposit
        ("  07/07  Dinner   30.00   970.00  ", "2025", ["2025-07-07", "Dinner", 30.0, 970.0]),
        # Extra extra spaces
        ("      07/07             Dinner              30.00              970.00      ", "2025", ["2025-07-07", "Dinner", 30.0, 970.0]),
        # Withdrawal with decimal and spaces in description
        ("08/22  Utility Bill  75.25  925.75", "2023", ["2023-08-22", "Utility Bill", 75.25, 925.75]),
        # Missing description
        ("08/22     75.25  925.75", None, False),
        # Multiple dates
        ("22 Aug 22 Aug Food    75.25  925.75", None, ["1900-08-22", "Food", 75.25, 925.75]),
        ("22/8 22/8 Food    75.25  925.75", None, ["1900-08-22", "Food", 75.25, 925.75]),
    ]
)
def test_rowbreakdown(input_row, optional_year, expected_output):
    if optional_year:
        result = standardRowBreakdown(input_row, optional_year)
    else:
        result = standardRowBreakdown(input_row)
    assert result == expected_output
