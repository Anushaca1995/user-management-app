import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (UserID) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`http://localhost:3000/users/${UserID}`, {
          method: 'DELETE',
        });
        fetchUsers(); // Refresh list after delete
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const mapYesNo = (value) => (value === 1 ? 'Yes' : 'No');

  return (
    <div className="user-list-container">
      <h1>User Management</h1>
      <button className="add-btn" onClick={() => navigate('/add-user')}>
        Add New User
      </button>
      <table className="user-table">
        <thead>
          <tr>
            <th>UserID</th>
            <th>DisplayName</th>
            <th>Email</th>
            <th>Status</th>
            <th>AdminUser</th>
            <th>FunctionalUser</th>
            <th>BlockAccess</th>
            <th>HierarchyMaintenance</th>
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
              <td>{mapYesNo(user.AdminUser)}</td>
              <td>{mapYesNo(user.FunctionalUser)}</td>
              <td>{mapYesNo(user.BlockAccess)}</td>
              <td>{mapYesNo(user.HierarchyMaintenance)}</td>
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
