import './ShapFeatureChart.css';

export const FEATURE_NAMES = [
  'Age',
  'RestingBP',
  'Cholesterol',
  'FastingBS',
  'MaxHR',
  'Oldpeak',
  'Sex_F',
  'Sex_M',
  'ChestPainType_ASY',
  'ChestPainType_ATA',
  'ChestPainType_NAP',
  'ChestPainType_TA',
  'RestingECG_LVH',
  'RestingECG_Normal',
  'RestingECG_ST',
  'ExerciseAngina_N',
  'ExerciseAngina_Y',
  'ST_Slope_Down',
  'ST_Slope_Flat',
  'ST_Slope_Up',
];

export function getTopShapFeatures(shapValues, limit = 8) {
  if (!shapValues?.length) return [];

  const paired = FEATURE_NAMES.map((name, i) => ({
    name,
    label: name.replace(/_/g, ' '),
    value: Number(shapValues[i] ?? 0),
  }));

  return paired
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, limit);
}

function ShapFeatureChart({ shapValues }) {
  const features = getTopShapFeatures(shapValues);
  if (!features.length) return null;

  const maxAbs = Math.max(...features.map((f) => Math.abs(f.value)), 0.001);
  // Bars grow from the center axis; each side is half the track (50% = full side).
  const maxBarWidthPct = 50;

  return (
    <div className="shap-chart">
      <h4 className="shap-chart-title">Key factors (SHAP)</h4>
      <p className="shap-chart-subtitle">Top 8 drivers of this prediction</p>

      <div className="shap-legend" aria-hidden="true">
        <span className="shap-legend-item shap-legend-negative">
          <span className="shap-legend-swatch" /> Toward low risk
        </span>
        <span className="shap-legend-item shap-legend-positive">
          <span className="shap-legend-swatch" /> Toward high risk
        </span>
      </div>

      <ul className="shap-rows">
        {features.map((feature) => {
          const widthPct =
            (Math.abs(feature.value) / maxAbs) * maxBarWidthPct;
          const isPositive = feature.value >= 0;

          return (
            <li key={feature.name} className="shap-row">
              <span className="shap-label" title={feature.name}>
                {feature.label}
              </span>
              <div className="shap-bar-track" role="presentation">
                <div className="shap-axis" />
                <div
                  className={`shap-bar ${isPositive ? 'shap-bar-positive' : 'shap-bar-negative'}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <span
                className={`shap-value ${isPositive ? 'shap-value-positive' : 'shap-value-negative'}`}
              >
                {feature.value >= 0 ? '+' : ''}
                {feature.value.toFixed(3)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ShapFeatureChart;
