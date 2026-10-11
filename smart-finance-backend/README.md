# Smart Finance

An AI-powered personal finance management platform — track income and expenses, set budgets, work toward savings goals, automate recurring transactions, and get next-month spending predictions per category.

## Features

- **Auth** — JWT-based registration and login
- **Transactions** — full CRUD, filterable and sortable by category, type, date, amount
- **Dashboard** — income/expense/savings totals, spending breakdown by category
- **Budgets** — set monthly limits per category, track spend against them live
- **Goals** — savings goals with manual progress tracking
- **Recurring transactions** — auto-generate transactions on a schedule (daily/weekly/monthly)
- **AI Forecast** — predicts next month's spend per category using linear regression on spending history (falls back to a simple average when there isn't enough history yet)

## Architecture

The React frontend talks only to Spring Boot. Spring Boot owns all persistent data (Postgres) and handles auth. For forecasts, Spring Boot fetches the user's transaction history and forwards it to a separate FastAPI service, which runs a linear regression per spending category and returns next-month predictions.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, Axios |
| Backend | Java 21, Spring Boot, Spring Security (JWT), Spring Data JPA |
| Database | PostgreSQL |
| AI Service | Python, FastAPI, scikit-learn, pandas |

## Running locally

Requires: Java 21, Node.js, Python 3, PostgreSQL running locally with a `smartfinance` database.

**Backend** (port 8080):
```bash
cd smart-finance-backend
./mvnw spring-boot:run
```

**Frontend** (port 5173):
```bash
cd smart-finance-frontend
npm install
npm run dev
```

**AI service** (port 8000):
```bash
cd smart-finance-ai
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## API overview

| Service | Base path |
|---|---|
| Backend | `http://localhost:8080/api` |
| AI service | `http://localhost:8000` |

Key backend endpoints: `/auth/register`, `/auth/login`, `/transactions`, `/dashboard`, `/budgets`, `/goals`, `/recurring-transactions`, `/forecast`

## How the forecast works

For each expense category, the AI service groups transactions by month and fits a linear regression (`scikit-learn`) against time to find the spending trend, then predicts the next month's value. Categories with only one month of history fall back to that single value rather than attempting a regression with insufficient data. Predictions are clamped at zero to avoid nonsensical negative spending forecasts.