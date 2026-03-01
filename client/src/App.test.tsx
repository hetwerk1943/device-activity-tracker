import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Activity Tracker heading', () => {
  render(<App />);
  const heading = screen.getByText(/activity tracker/i);
  expect(heading).toBeInTheDocument();
});

test('renders connection status indicator', () => {
  render(<App />);
  const status = screen.getByText(/disconnected/i);
  expect(status).toBeInTheDocument();
});

test('renders Connect WhatsApp section', () => {
  render(<App />);
  const whatsappSection = screen.getByText(/connect whatsapp/i);
  expect(whatsappSection).toBeInTheDocument();
});

test('renders Connect Signal section', () => {
  render(<App />);
  const signalSection = screen.getByText(/connect signal/i);
  expect(signalSection).toBeInTheDocument();
});
