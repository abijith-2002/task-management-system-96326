import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tasks header', () => {
  render(<App />);
  const heading = screen.getByText(/Tasks/i);
  expect(heading).toBeInTheDocument();
});
