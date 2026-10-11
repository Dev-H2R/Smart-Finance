import datetime
from enum import Enum

from pydantic import BaseModel


class TransactionType(str, Enum):
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"


class TransactionIn(BaseModel):
    amount: float
    type: TransactionType
    category: str
    date: datetime.date


class ForecastRequest(BaseModel):
    transactions: list[TransactionIn]


class CategoryForecast(BaseModel):
    category: str
    predicted_amount: float
    months_of_data: int
    method: str


class ForecastResponse(BaseModel):
    forecast_month: str
    forecasts: list[CategoryForecast]