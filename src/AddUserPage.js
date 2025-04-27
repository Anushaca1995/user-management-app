import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddUserPage() {
  const [formData, setFormData] = useState({
    UserID: '',
    DisplayName: '',
    Email: '',
    IsOSPAdmin: false,
    Status: 'Active',
    FunctionalUser: 0,
    AdminUser: 0,
    BlockAccess: 0,
    O365Email: '',
    MFA_Mobile: '',
    ColourMode: 'D',
    HierarchyMaintenance: false
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/users', formData);
    navigate('/');
  };

  return (
    <div>
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <input name="UserID" placeholder="UserID" value={formData.UserID} onChange={handleChange} required /><br />
        <input name="DisplayName" placeholder="Display Name" value={formData.DisplayName} onChange={handleChange} required /><br />
        <input name="Email" placeholder="Email" value={formData.Email} onChange={handleChange} required /><br />
        <label>
          Is OSP Admin:
          <input type="checkbox" name="IsOSPAdmin" checked={formData.IsOSPAdmin} onChange={handleChange} />
        </label><br />
        <input name="Status" placeholder="Status" value={formData.Status} onChange={handleChange} /><br />
        <input name="FunctionalUser" placeholder="Functional User" type="number" value={formData.FunctionalUser} onChange={handleChange} /><br />
        <input name="AdminUser" placeholder="Admin User" type="number" value={formData.AdminUser} onChange={handleChange} /><br />
        <input name="BlockAccess" placeholder="Block Access" type="number" value={formData.BlockAccess} onChange={handleChange} /><br />
        <input name="O365Email" placeholder="O365 Email" value={formData.O365Email} onChange={handleChange} /><br />
        <input name="MFA_Mobile" placeholder="MFA Mobile" value={formData.MFA_Mobile} onChange={handleChange} /><br />
        <input name="ColourMode" placeholder="Colour Mode" value={formData.ColourMode} onChange={handleChange} /><br />
        <label>
          Hierarchy Maintenance:
          <input type="checkbox" name="HierarchyMaintenance" checked={formData.HierarchyMaintenance} onChange={handleChange} />
        </label><br />

        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default AddUserPage;
