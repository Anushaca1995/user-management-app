import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UserList from './UserList';
import UserForm from './UserForm';

const App = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); 
  const handleAddOrEditUser = async (userData) => {
    const { DisplayName, Email, Status, AdminUser, FunctionalUser, BlockAccess, HierarchyMaintenance } = userData;
    try {
      // Add the user to the backend (POST request)
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          DisplayName,
          Email,
          Status,
          AdminUser,
          FunctionalUser,
          BlockAccess,
          HierarchyMaintenance,
        }),
      });

      if (response.ok) {
        // Add the user to the local state
        setUsers((prevUsers) => [...prevUsers, userData]);

        // Show success alert
        alert('User added successfully!');
         // After submitting, navigate to the user list page (2 seconds delay for a smooth transition)
      setTimeout(() => {
        navigate('/'); // Use this if you're using React Router
      }, 2000); // Delay navigation to give the user time to see the success message
      } else {
        alert('Please select all options!');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user!');
    }
  };

  return (
    <Routes>
      <Route path="/" element={<UserList users={users} />} />
      <Route
        path="/add-user"
        element={<UserForm headerTitle="Add User" onSubmit={handleAddOrEditUser} />}
      />
      <Route
        path="/edit-user/:UserID"
        element={<UserForm headerTitle="Edit User" onSubmit={handleAddOrEditUser} />}
      />
    </Routes>
  );
};

export default App;
