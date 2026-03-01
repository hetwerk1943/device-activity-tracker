import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders activity tracker heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/activity tracker/i);
  expect(headingElement).toBeInTheDocument();
});
