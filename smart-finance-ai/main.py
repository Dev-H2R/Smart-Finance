from fastapi import FastAPI

from routes_forecast import router as forecast_router

app = FastAPI(title="Smart Finance AI Service")


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(forecast_router)