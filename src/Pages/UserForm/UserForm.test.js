import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserForm from './index';
import { MemoryRouter, Route, Routes } from 'react-router-dom';


jest.mock('../../Components/CheckBoxField', () => ({ label, name, checked, onChange }) => (
  <label>
    {label}
    <input type="checkbox" name={name} checked={checked} onChange={onChange} />
  </label>
));

const mockUsers = [
  {
    UserID: 1,
    DisplayName: 'Jacob John',
    Email: 'john@example.com',
    Status: 'Active',
    AdminUser: 1,
    FunctionalUser: 0,
    BlockAccess: 1,
    MFA_Mobile: '999999',
  },
];

const mockOnSubmit = jest.fn(() => Promise.resolve());

describe('UserForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty form in add mode', () => {
    render(
      <MemoryRouter initialEntries={['/add']}>
        <Routes>
          <Route path="/add" element={<UserForm headerTitle="Add User" users={[]} onSubmit={mockOnSubmit} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Display Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/MFA Mobile/i)).toHaveValue('');
    expect(screen.getByLabelText(/Status/i)).toHaveValue('');
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  test('renders form in edit mode with user data', async () => {
    render(
      <MemoryRouter initialEntries={['/edit/1']}>
        <Routes>
          <Route path="/edit/:UserID" element={<UserForm headerTitle="Edit User" users={mockUsers} onSubmit={mockOnSubmit} />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByDisplayValue('Jacob John')).toBeInTheDocument());
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('999999')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Active')).toBeInTheDocument();
    expect(screen.getByLabelText(/Admin User/i)).toBeChecked();
    expect(screen.getByLabelText(/Block Access/i)).toBeChecked();
  });

});
