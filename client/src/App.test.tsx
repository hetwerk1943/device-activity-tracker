import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders activity tracker header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Activity Tracker/i);
  expect(headerElement).toBeInTheDocument();
});
