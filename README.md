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

## Project status

| Part | Status |
|---|---|
| Interactive dashboard (React) | Done |
| Live chart, status indicator, server rack view, auto-simulation | Done |
| Prediction logic | Placeholder formula (for demo purposes) |
| Dataset preparation | Planned |
| Random Forest / XGBoost regression model | Planned |
| Python API (FastAPI) connecting the model to the dashboard | Planned |
| LSTM time-series forecasting | Future roadmap |

> The dashboard currently runs on a simple simulated formula. The next phase replaces it with a trained machine learning model.

## Dashboard features

- Live predicted temperature with a color that shifts from cool to hot
- Real-time temperature history chart
- Safe / Warning / Overheating status
- 12-rack server view showing per-rack heat
- Adjustable inputs, plus a hands-free "simulation" mode for demos

## Tech stack

- **Frontend:** React, Vite, Recharts
- **Planned backend:** Python, FastAPI, scikit-learn / XGBoost



Then open http://localhost:5173

## Vision

A prediction layer for datacenter cooling that can help reduce energy use and prevent overheating, starting as a proof of concept and growing toward real sensor data and time-series forecasting.
