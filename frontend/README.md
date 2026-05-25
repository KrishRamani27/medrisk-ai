# MedRisk AI — Frontend

React client for [MedRisk AI](../README.md): heart disease risk assessment with SHAP explainability.

**Live app:** [https://medrisk-ai-three.vercel.app/](https://medrisk-ai-three.vercel.app/)

Full project documentation (architecture, ML pipeline, backend setup, and deployment) is in the [repository root README](../README.md).

## Quick start

```bash
npm install
npm start
```

For local development against a running FastAPI instance, set `API_URL` in `src/App.js` to `http://127.0.0.1:8000/predict`.

| Script        | Description              |
|---------------|--------------------------|
| `npm start`   | Dev server on port 3000  |
| `npm test`    | Jest / React Testing Library |
| `npm run build` | Production bundle for Vercel |
