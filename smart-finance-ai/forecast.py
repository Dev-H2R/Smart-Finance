from sklearn.linear_model import LinearRegression
import numpy as np

import datetime
from collections import defaultdict

from schemas import (
    CategoryForecast,
    ForecastResponse,
    TransactionIn,
    TransactionType,
)


def month_key(d: datetime.date) -> tuple[int, int]:
    return (d.year, d.month)


def next_month(year: int, month: int) -> tuple[int, int]:
    if month == 12:
        return (year + 1, 1)
    return (year, month + 1)


def months_between(start: tuple[int, int], end: tuple[int, int]) -> list[tuple[int, int]]:
    months = []
    current = start
    while current <= end:
        months.append(current)
        current = next_month(*current)
    return months


def predict(monthly_totals: list[float]) -> tuple[float, str]:
    if len(monthly_totals) == 1:
        return monthly_totals[0], "single_month"

    X = np.arange(len(monthly_totals)).reshape(-1, 1)
    y = np.array(monthly_totals)

    model = LinearRegression()
    model.fit(X, y)

    next_index = np.array([[len(monthly_totals)]])
    predicted = model.predict(next_index)[0]

    predicted = max(0.0, predicted)

    return predicted, "linear_regression"
def build_forecast(
    transactions: list[TransactionIn],
    today: datetime.date | None = None,
) -> ForecastResponse:
    today = today or datetime.date.today()
    current_month = month_key(today)

    totals: dict[str, dict[tuple[int, int], float]] = defaultdict(lambda: defaultdict(float))
    for t in transactions:
        if t.type == TransactionType.EXPENSE:
            totals[t.category][month_key(t.date)] += t.amount

    all_months = {m for by_month in totals.values() for m in by_month}
    if not all_months:
        year, month = next_month(*current_month)
        return ForecastResponse(forecast_month=f"{year}-{month:02d}", forecasts=[])

    complete_months = {m for m in all_months if m < current_month}
    last_month = max(complete_months or all_months)
    year, month = next_month(*last_month)

    forecasts = []
    for category, by_month in totals.items():
        usable = {m: v for m, v in by_month.items() if m <= last_month}
        if not usable:
            continue
        series = [usable.get(m, 0.0) for m in months_between(min(usable), last_month)]
        amount, method = predict(series)
        forecasts.append(
            CategoryForecast(
                category=category,
                predicted_amount=round(amount, 2),
                months_of_data=len(series),
                method=method,
            )
        )

    forecasts.sort(key=lambda f: f.predicted_amount, reverse=True)
    return ForecastResponse(forecast_month=f"{year}-{month:02d}", forecasts=forecasts)