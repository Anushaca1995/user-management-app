import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const UserList = ({ users, fetchUsers }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [adminFilter, setAdminFilter] = useState('All');
  const [functionalFilter, setFunctionalFilter] = useState('All');
  const [blockAccessFilter, setBlockAccessFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const handleDelete = async (UserID) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`http://localhost:3000/users/${UserID}`, { method: 'DELETE' });
        fetchUsers();
      } catch (error) {
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
      (adminFilter === 'yes' && user.AdminUser) ||
      (adminFilter === 'no' && !user.AdminUser);

    const functionalMatch =
      functionalFilter === 'All' ||
      (functionalFilter === 'yes' && user.FunctionalUser) ||
      (functionalFilter === 'no' && !user.FunctionalUser);

    const blockAccessMatch =
      blockAccessFilter === 'All' ||
      (blockAccessFilter === 'yes' && user.BlockAccess) ||
      (blockAccessFilter === 'no' && !user.BlockAccess);

    return searchMatch && adminMatch && functionalMatch && blockAccessMatch;
  });

  // Sorting users
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
};


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

  <div className="filter-group">
    <label className="filter-label">Admin User:</label>
    <select value={adminFilter} onChange={(e) => setAdminFilter(e.target.value)} className="filter-dropdown">
      <option value="all">-- select --</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  </div>

  <div className="filter-group">
    <label className="filter-label">Functional User:</label>
    <select value={functionalFilter} onChange={(e) => setFunctionalFilter(e.target.value)} className="filter-dropdown">
      <option value="all">-- select --</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  </div>

  <div className="filter-group">
    <label className="filter-label">Block Access:</label>
    <select value={blockAccessFilter} onChange={(e) => setBlockAccessFilter(e.target.value)} className="filter-dropdown">
      <option value="all">-- select --</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  </div>
</div>


      <div className="add-user-section">
        <p>Do you want to add a new user? Please click
          <a href="/add-user" className="add-user-link"> here</a>
        </p>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th onClick={() => handleSort('DisplayName')} className="sortable-header">
              Display Name {sortConfig.key === 'DisplayName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('Email')} className="sortable-header">
              Email {sortConfig.key === 'Email' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
            </th>
            <th>Status</th>
            <th>Admin User</th>
            <th>Functional User</th>
            <th>Block Access</th>
            <th>MFA Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => (
            <tr key={user.UserID}>
              <td>{index + 1}</td>
              <td>{user.DisplayName}</td>
              <td>{user.Email}</td>
              <td>{user.Status}</td>
              <td>{user.AdminUser ? 'yes' : 'no'}</td>
              <td>{user.FunctionalUser ? 'yes' : 'no'}</td>
              <td>{user.BlockAccess ? 'yes' : 'no'}</td>
              <td>{user.MFA_Mobile}</td>
              <td>
                <button className="edit-btn" onClick={() => navigate(`/edit-user/${user.UserID}`)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(user.UserID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
