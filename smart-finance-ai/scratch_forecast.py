import datetime

from forecast import build_forecast
from schemas import TransactionIn


def tx(amount, kind, category, year, month):
    return TransactionIn(amount=amount, type=kind, category=category, date=datetime.date(year, month, 10))


data = [
    tx(3000, "EXPENSE", "Food", 2026, 6),
    tx(3500, "EXPENSE", "Food", 2026, 7),
    tx(4000, "EXPENSE", "Food", 2026, 8),
    tx(500, "EXPENSE", "Food", 2026, 9),
    tx(15000, "EXPENSE", "Rent", 2026, 8),
    tx(2000, "EXPENSE", "Travel", 2026, 7),
    tx(50000, "INCOME", "Salary", 2026, 8),
]

result = build_forecast(data, today=datetime.date(2026, 9, 24))
print(result.forecast_month)
for f in result.forecasts:
    print(f)