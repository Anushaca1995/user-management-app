import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserList from './UserList';
import UserForm from './UserForm';

const App = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddOrEditUser = async (formData, isEditing, UserID) => {
    try {
      if (isEditing) {
        await fetch(`http://localhost:3000/users/${UserID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      await fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<UserList users={users} fetchUsers={fetchUsers} />} />
      <Route path="/add-user" element={<UserForm headerTitle="Add User" users={users} onSubmit={handleAddOrEditUser} />} />
      <Route path="/edit-user/:UserID" element={<UserForm headerTitle="Edit User" users={users} onSubmit={handleAddOrEditUser} />} />
    </Routes>
  );
};

export default App;
