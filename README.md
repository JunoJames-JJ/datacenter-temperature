# Datacenter Temperature Intelligence

**An AI system that predicts datacenter temperature before it becomes a problem.**

Cooling is one of the biggest costs in running a datacenter. If temperature is only measured *after* it rises, operators react late, either wasting energy by over-cooling or risking hardware damage by under-cooling. This project predicts temperature ahead of time from live operating conditions, so cooling can be adjusted early.

## How it works

```
Live conditions  ->  ML model  ->  Predicted temperature  ->  Status + dashboard
```

**Inputs the model uses**
- Server CPU/GPU load
- Humidity
- Outside (ambient) temperature
- Cooling system status

**Output**
- Predicted temperature in °C, with a Safe / Warning / Overheating status

## Architecture

```
Sensor data -> Data pipeline -> Database -> ML model -> FastAPI -> Dashboard
                                   |                       ^
                                   +--> Cooling Advisor agent (RAG + tools + human approval)
```

## Roadmap

| Phase | What gets built | Status |
|---|---|---|
| 1. Dashboard | React dashboard: live chart, status indicator, server rack view, simulation mode | Done |
| 2. Data pipeline | Dataset preparation, cleaning and feature engineering with pandas, storage in PostgreSQL, SQL queries for history | Planned |
| 3. ML model | Baseline vs Random Forest vs XGBoost regression, evaluation (MAE, RMSE), feature importance, experiment tracking with MLflow | Planned |
| 4. Model serving | FastAPI prediction service, dashboard connected to the real model, Docker | Planned |
| 5. Cooling Advisor agent | LangGraph agent that calls the prediction API as a tool, retrieves cooling runbooks (RAG with a vector database), recommends an action and asks a human to approve | Planned |
| 6. Evaluation and MLOps | Golden test set, retrieval and answer quality metrics, latency and cost tracking, pytest tests, GitHub Actions CI, drift monitoring | Planned |
| 7. Forecasting and cloud | LSTM for ahead-of-time forecasting, cloud deployment | Future |

> The dashboard currently runs on a simple simulated formula. Phases 2-4 replace it with a trained model.

## Dashboard features

- Live predicted temperature with a color that shifts from cool to hot
- Real-time temperature history chart
- Safe / Warning / Overheating status
- 12-rack server view showing per-rack heat
- Adjustable inputs, plus a hands-free "simulation" mode for demos

## Tech stack

| Area | Tools |
|---|---|
| Frontend | React, Vite, Recharts |
| Data | Python, pandas, SQL, PostgreSQL |
| Classic ML | scikit-learn, XGBoost, MLflow |
| Serving | FastAPI, Docker |
| LLM and agents | LangChain, LangGraph, embeddings, pgvector (RAG) |
| Evaluation | RAGAS or DeepEval, pytest |
| DevOps | Git, GitHub Actions (CI/CD) |

*Tools in the roadmap are planned and are marked as built only once they are working.*


## Vision

A prediction layer for datacenter cooling that can help reduce energy use and prevent overheating, starting as a proof of concept and growing toward real sensor data and time-series forecasting.