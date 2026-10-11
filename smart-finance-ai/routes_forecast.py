from fastapi import APIRouter

from forecast import build_forecast
from schemas import ForecastRequest, ForecastResponse

router = APIRouter()


@router.post("/forecast", response_model=ForecastResponse)
def forecast(request: ForecastRequest) -> ForecastResponse:
    return build_forecast(request.transactions)