import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../Components/Table';
import Filter from '../../Components/Filter';
import './styles.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserList = ({ users, fetchUsers }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [adminFilter, setAdminFilter] = useState('All');
  const [functionalFilter, setFunctionalFilter] = useState('All');
  const [blockAccessFilter, setBlockAccessFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const handleDelete = async (UserID) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`http://localhost:3000/users/${UserID}`, { method: 'DELETE' });
        toast.success("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        toast.error('Error deleting user!');
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.DisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchQuery.toLowerCase());
  
    const adminMatch =
      adminFilter === 'All' ||
      (adminFilter === 'Yes' && user.AdminUser) ||
      (adminFilter === 'No' && !user.AdminUser);
  
    const functionalMatch =
      functionalFilter === 'All' ||
      (functionalFilter === 'Yes' && user.FunctionalUser) ||
      (functionalFilter === 'No' && !user.FunctionalUser);
  
    const blockAccessMatch =
      blockAccessFilter === 'All' ||
      (blockAccessFilter === 'Yes' && user.BlockAccess) ||
      (blockAccessFilter === 'No' && !user.BlockAccess);
  
    const statusMatch =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && user.Status === 'Active') ||
      (statusFilter === 'Testing' && user.Status === 'Testing') ||
      (statusFilter === 'Inactive' && user.Status === 'Inactive');
  
    return searchMatch && adminMatch && functionalMatch && blockAccessMatch && statusMatch;
  });
  

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : '';
    const bValue = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : '';

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setAdminFilter('All');
    setFunctionalFilter('All');
    setBlockAccessFilter('All');
    setStatusFilter('All');
    setSortConfig({ key: null, direction: 'ascending' });
  };

  const columns = [
    { label: '#', sortable: false },
    { label: 'Display Name', sortable: true, onSort: () => handleSort('DisplayName'), isSorted: sortConfig.key === 'DisplayName', isAscending: sortConfig.direction === 'ascending' },
    { label: 'Email', sortable: true, onSort: () => handleSort('Email'), isSorted: sortConfig.key === 'Email', isAscending: sortConfig.direction === 'ascending' },
    { label: 'Status', sortable: false },
    { label: 'Admin User', sortable: false },
    { label: 'Functional User', sortable: false },
    { label: 'Block Access', sortable: false },
    { label: 'MFA Mobile', sortable: false },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (user) => navigate(`/edit-user/${user.UserID}`) ,
      className: 'edit-btn'
    },
    {
      label: 'Delete',
      onClick: (user) => handleDelete(user.UserID),
      className: 'delete-btn'
    }
  ];
  
  return (
    <div className="user-list-container">
      <h1>User Management</h1>

      <div className="filters-section">
        <div className="search-refresh-group">
          <input
            type="text"
            placeholder="Search Name or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <button onClick={handleRefresh} className="refresh-button" title="Refresh">
            ↻
          </button>
        </div>
        <Filter
          label="Status"
          value={statusFilter}
          options={[
            { value: 'All', label: '-- select --' },
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
            { value: 'Testing', label: 'Testing' },
          ]}
          onChange={setStatusFilter}
        />

        <Filter
          label="Admin User"
          value={adminFilter}
          options={[
            { value: 'All', label: '-- select --' },
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
          ]}
          onChange={setAdminFilter}
        />
        <Filter
          label="Functional User"
          value={functionalFilter}
          options={[
            { value: 'All', label: '-- select --' },
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
          ]}
          onChange={setFunctionalFilter}
        />
        <Filter
          label="Block Access"
          value={blockAccessFilter}
          options={[
            { value: 'All', label: '-- select --' },
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
          ]}
          onChange={setBlockAccessFilter}
        />
      </div>

      <div className="add-user-section">
        <p>Do you want to add a new user? Please click
          <a href="/add-user" className="add-user-link">here</a>
        </p>
      </div>

      <Table
        columns={columns}
        data={sortedUsers}
        renderRow={(user, index) => (
          <>
            <td>{index+1}</td>
            <td>{user.DisplayName}</td>
            <td>{user.Email}</td>
            <td>{user.Status}</td>
            <td>{user.AdminUser ? 'Yes' : 'No'}</td>
            <td>{user.FunctionalUser ? 'Yes' : 'No'}</td>
            <td>{user.BlockAccess ? 'Yes' : 'No'}</td>
            <td>{user.MFA_Mobile}</td>
          </>
        )}
        actions={actions}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserList;
