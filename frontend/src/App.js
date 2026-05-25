import { useState } from 'react';
import './App.css';
import ShapFeatureChart from './ShapFeatureChart';

const API_URL = 'https://medrisk-ai-backend.onrender.com/predict';

const INITIAL_FORM = {
  Age: '',
  Sex: 'M',
  ChestPainType: 'ASY',
  RestingBP: '',
  Cholesterol: '',
  FastingBS: '0',
  RestingECG: 'Normal',
  MaxHR: '',
  ExerciseAngina: 'N',
  Oldpeak: '',
  ST_Slope: 'Up',
};

const CHEST_PAIN_OPTIONS = [
  { value: 'ASY', label: 'ASY — Asymptomatic' },
  { value: 'NAP', label: 'NAP — Non-anginal' },
  { value: 'ATA', label: 'ATA — Atypical angina' },
  { value: 'TA', label: 'TA — Typical angina' },
];

function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      Age: parseInt(form.Age, 10),
      Sex: form.Sex,
      ChestPainType: form.ChestPainType,
      RestingBP: parseFloat(form.RestingBP),
      Cholesterol: parseFloat(form.Cholesterol),
      FastingBS: parseFloat(form.FastingBS),
      RestingECG: form.RestingECG,
      MaxHR: parseFloat(form.MaxHR),
      ExerciseAngina: form.ExerciseAngina,
      Oldpeak: parseFloat(form.Oldpeak),
      ST_Slope: form.ST_Slope,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(
          detail?.detail?.[0]?.msg ||
            detail?.detail ||
            `Request failed (${response.status})`
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Unable to reach the prediction server. Ensure the backend is running at http://127.0.0.1:8000.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setResult(null);
    setError(null);
  };

  const isHighRisk = result?.prediction === 1;
  const probabilityPct = result
    ? (result.probability * 100).toFixed(1)
    : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div>
          <h1>MedRisk AI</h1>
          <p className="tagline">Heart disease risk assessment</p>
        </div>
      </header>

      <main className="app-main">
        <form className="assessment-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h2>Patient profile</h2>
            <div className="form-grid">
              <label className="field">
                <span>Age</span>
                <input
                  type="number"
                  name="Age"
                  value={form.Age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  required
                  placeholder="e.g. 54"
                />
              </label>
              <label className="field">
                <span>Sex</span>
                <select name="Sex" value={form.Sex} onChange={handleChange}>
                  <option value="M">M — Male</option>
                  <option value="F">F — Female</option>
                </select>
              </label>
              <label className="field field-wide">
                <span>Chest pain type</span>
                <select
                  name="ChestPainType"
                  value={form.ChestPainType}
                  onChange={handleChange}
                >
                  {CHEST_PAIN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="form-section">
            <h2>Vitals &amp; labs</h2>
            <div className="form-grid">
              <label className="field">
                <span>Resting BP (mmHg)</span>
                <input
                  type="number"
                  name="RestingBP"
                  value={form.RestingBP}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="e.g. 130"
                />
              </label>
              <label className="field">
                <span>Cholesterol (mg/dL)</span>
                <input
                  type="number"
                  name="Cholesterol"
                  value={form.Cholesterol}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="e.g. 240"
                />
              </label>
              <label className="field">
                <span>Fasting blood sugar</span>
                <select
                  name="FastingBS"
                  value={form.FastingBS}
                  onChange={handleChange}
                >
                  <option value="0">0 — ≤ 120 mg/dL</option>
                  <option value="1">1 — &gt; 120 mg/dL</option>
                </select>
              </label>
            </div>
          </section>

          <section className="form-section">
            <h2>Cardiac assessment</h2>
            <div className="form-grid">
              <label className="field">
                <span>Resting ECG</span>
                <select
                  name="RestingECG"
                  value={form.RestingECG}
                  onChange={handleChange}
                >
                  <option value="Normal">Normal</option>
                  <option value="LVH">LVH</option>
                  <option value="ST">ST</option>
                </select>
              </label>
              <label className="field">
                <span>Max heart rate</span>
                <input
                  type="number"
                  name="MaxHR"
                  value={form.MaxHR}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="e.g. 150"
                />
              </label>
              <label className="field">
                <span>Exercise angina</span>
                <select
                  name="ExerciseAngina"
                  value={form.ExerciseAngina}
                  onChange={handleChange}
                >
                  <option value="Y">Y — Yes</option>
                  <option value="N">N — No</option>
                </select>
              </label>
              <label className="field">
                <span>Oldpeak (ST depression)</span>
                <input
                  type="number"
                  name="Oldpeak"
                  value={form.Oldpeak}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                  placeholder="e.g. 1.4"
                />
              </label>
              <label className="field">
                <span>ST slope</span>
                <select
                  name="ST_Slope"
                  value={form.ST_Slope}
                  onChange={handleChange}
                >
                  <option value="Up">Up</option>
                  <option value="Flat">Flat</option>
                  <option value="Down">Down</option>
                </select>
              </label>
            </div>
          </section>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Analyzing…' : 'Assess risk'}
            </button>
          </div>
        </form>

        <aside className="results-panel">
          {error && (
            <div className="result-card result-error" role="alert">
              <h3>Assessment unavailable</h3>
              <p>{error}</p>
            </div>
          )}

          {!error && !result && !loading && (
            <div className="result-card result-placeholder">
              <div className="placeholder-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3>Ready for assessment</h3>
              <p>
                Complete the patient form and submit to receive a heart disease
                risk prediction powered by ML.
              </p>
            </div>
          )}

          {loading && (
            <div className="result-card result-loading">
              <div className="spinner" aria-hidden="true" />
              <p>Running risk model…</p>
            </div>
          )}

          {result && !loading && (
            <div
              className={`result-card result-outcome ${isHighRisk ? 'high-risk' : 'low-risk'}`}
            >
              <span className="risk-badge">
                {isHighRisk ? 'High Risk' : 'Low Risk'}
              </span>
              <h3>Risk prediction</h3>
              <p className="risk-label">
                {isHighRisk
                  ? 'Elevated likelihood of heart disease'
                  : 'Lower likelihood of heart disease'}
              </p>

              <div className="probability-block">
                <div className="probability-header">
                  <span>Probability</span>
                  <strong>{probabilityPct}%</strong>
                </div>
                <div className="probability-bar">
                  <div
                    className="probability-fill"
                    style={{ width: `${probabilityPct}%` }}
                  />
                </div>
                <p className="probability-note">
                  Model confidence for positive classification
                </p>
              </div>

              {result.shap_values && (
                <ShapFeatureChart shapValues={result.shap_values} />
              )}

              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={handleReset}
              >
                New assessment
              </button>
            </div>
          )}
        </aside>
      </main>

      <footer className="app-footer">
        <p>For clinical decision support only — not a substitute for professional diagnosis.</p>
      </footer>
    </div>
  );
}

export default App;
