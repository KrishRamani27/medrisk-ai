import { render, screen } from '@testing-library/react';
import App from './App';

test('renders MedRisk AI header', () => {
  render(<App />);
  expect(screen.getByText(/MedRisk AI/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /assess risk/i })).toBeInTheDocument();
});
