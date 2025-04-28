// UserList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const UserList = ({ users, fetchUsers }) => {
  const navigate = useNavigate();

  const handleDelete = async (UserID) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`http://localhost:3000/users/${UserID}`, { method: 'DELETE' });
        fetchUsers(); // Refresh list after delete
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="user-list-container">
      <h1>User Management</h1>
      <div className="add-user-section">
        <p>Do you want to add a new user? Please click
          <a href="/add-user" className="add-user-link"> here</a>
        </p>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>UserID</th>
            <th>DisplayName</th>
            <th>Email</th>
            <th>Status</th>
            <th>Admin User</th>
            <th>Functional User</th>
            <th>Block Access</th>
            <th>MFA Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.UserID}>
              <td>{user.UserID}</td>
              <td>{user.DisplayName}</td>
              <td>{user.Email}</td>
              <td>{user.Status}</td>
              <td>{user.AdminUser ? 'Yes' : 'No'}</td>
              <td>{user.FunctionalUser ? 'Yes' : 'No'}</td>
              <td>{user.BlockAccess ? 'Yes' : 'No'}</td>
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
