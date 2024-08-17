import { render, screen } from '@testing-library/react';
import Home from '../app/page';

test('renders hello world', () => {
  render(<Home />);
  const heading = screen.getByText(/hello world/i);
  expect(heading).toBeInTheDocument();
});
