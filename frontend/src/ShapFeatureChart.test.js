import { getTopShapFeatures, FEATURE_NAMES } from './ShapFeatureChart';

test('returns top 8 features by absolute SHAP value', () => {
  const shap = FEATURE_NAMES.map((_, i) => (i === 0 ? 0.9 : i === 5 ? -0.8 : 0.01 * i));
  const top = getTopShapFeatures(shap);

  expect(top).toHaveLength(8);
  expect(top[0].name).toBe('Age');
  expect(Math.abs(top[0].value)).toBeGreaterThanOrEqual(Math.abs(top[7].value));
});
