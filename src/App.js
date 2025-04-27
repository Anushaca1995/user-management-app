import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Importing the CSS file

const App = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', accessLevel: '' });
  const [editUser, setEditUser] = useState(null);

  // Fetch users from the backend
  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Add a new user
  const addUser = () => {
    axios.post('http://localhost:3000/users', newUser)
      .then(response => {
        setUsers([...users, response.data]); // Add the newly added user
        setNewUser({ name: '', email: '', accessLevel: '' }); // Clear form after adding
      })
      .catch(error => console.error('Error adding user:', error));
  };

  // Edit an existing user
  const editUserHandler = (id) => {
    const userToEdit = users.find(user => user.UserID === id);
    setEditUser(userToEdit);
  };

  const updateUser = () => {
    axios.put(`http://localhost:3000/users/${editUser.UserID}`, editUser)
      .then(response => {
        setUsers(users.map(user => user.UserID === editUser.UserID ? response.data : user));
        setEditUser(null); // Reset the form after update
      })
      .catch(error => console.error('Error updating user:', error));
  };

 // Delete a user
const deleteUser = async (UserID) => {
  try {
    // Make the delete request to the backend
    await axios.delete(`http://localhost:3000/users/${UserID}`);
    
    // Update the state to remove the deleted user from the list
    setUsers(users.filter(user => user.UserID !== UserID));  // Remove the deleted user from the UI
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};


  const getAccessLevel = (user) => {
    if (user.AdminUser === 1 && user.FunctionalUser > 0) {
      return 'Admin & Functional User';
    } else if (user.AdminUser === 1) {
      return 'Admin';
    } else if (user.FunctionalUser > 0) {
      return `Functional User (${user.FunctionalUser})`;
    } else {
      return 'Standard User';
    }
  };

  return (
    <div className="container">
      <h1>User Management</h1>

      {/* Add New User Form */}
      <div className="form-container">
        <h2>Add New User</h2>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="input"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="input"
        />
        <input
          type="text"
          placeholder="Access Level"
          value={newUser.accessLevel}
          onChange={(e) => setNewUser({ ...newUser, accessLevel: e.target.value })}
          className="input"
        />
        <button onClick={addUser} className="button">Add User</button>
      </div>

      {/* User Table */}
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Access Level</th>
            <th>Block Access</th>
            <th>Hierarchy Maintenance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.UserID}>
              <td>{user.DisplayName}</td>
              <td>{user.Email}</td>
              <td>{user.Status}</td>
              <td>{getAccessLevel(user)}</td>
                <td>{user.BlockAccess === 1 ? 'Blocked' : 'Allowed'}</td>
                <td>{user.HierarchyMaintenance ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => editUserHandler(user.UserID)}>Edit</button>
                <button onClick={() => deleteUser(user.UserID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Form */}
      {editUser && (
        <div className="edit-form">
          <h2>Edit User</h2>
          <input
            type="text"
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            className="input"
          />
          <input
            type="email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            className="input"
          />
          <input
            type="text"
            value={editUser.accessLevel}
            onChange={(e) => setEditUser({ ...editUser, accessLevel: e.target.value })}
            className="input"
          />
          <button onClick={updateUser} className="button">Update User</button>
        </div>
      )}
    </div>
  );
};

export default App;
