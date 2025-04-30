import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import UserList from './index';  

const mockFetchUsers = jest.fn();
const mockUsers = [
  {
    UserID: 1,
    DisplayName: 'Marriott Smith',
    Email: 'marriott@example.com',
    Status: 'Active',
    AdminUser: true,
    FunctionalUser: true,
    BlockAccess: false,
    MFA_Mobile: '123-456-7890',
  },
  {
    UserID: 2,
    DisplayName: 'Christopher Brown',
    Email: 'christopher@example.com',
    Status: 'Inactive',
    AdminUser: false,
    FunctionalUser: true,
    BlockAccess: true,
    MFA_Mobile: '098-765-4321',
  },
];

describe('UserList', () => {
  test('renders user list', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<UserList users={mockUsers} fetchUsers={mockFetchUsers} />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Marriott Smith')).toBeInTheDocument();
      expect(screen.getByText('Christopher Brown')).toBeInTheDocument();
    });
  });

  test('filters users by search query', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<UserList users={mockUsers} fetchUsers={mockFetchUsers} />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Search Name or Email...'), {
      target: { value: 'christopher' },
    });

    await waitFor(() => {
      expect(screen.getByText('Christopher Brown')).toBeInTheDocument();
      expect(screen.queryByText('Marriott Smith')).not.toBeInTheDocument();
    });
  });

  test('handles delete user action', async () => {
    const mockDelete = jest.spyOn(window, 'confirm').mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<UserList users={mockUsers} fetchUsers={mockFetchUsers} />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => expect(mockFetchUsers).toHaveBeenCalled());
    mockDelete.mockRestore();  
  });
});
