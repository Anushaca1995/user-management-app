import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';


beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            UserID: 1,
            DisplayName: 'John Cena',
            UserType: 'Actor',
            Age: 30,
          },
        ]),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders the app and fetches users on load', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const johnCena = await screen.findByText((content, node) =>
    node.textContent === 'John Cena'
  );

  expect(johnCena).toBeInTheDocument();
});
