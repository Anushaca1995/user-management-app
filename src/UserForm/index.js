import React, { useState } from 'react';
import './styles.css';

const UserForm = ({ headerTitle, onSubmit }) => {
  const [formData, setFormData] = useState({
    DisplayName: '',
    Email: '',
    Status: 'null',
    AdminUser: 'null',
    FunctionalUser: 'null',
    BlockAccess: 'null',
    HierarchyMaintenance: 'null',
  });

  const [errors, setErrors] = useState({
    DisplayName: '',
    Email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset errors before checking
    setErrors({
      DisplayName: '',
      Email: '',
    });

    let formIsValid = true;
    const newErrors = {};

    // Validate DisplayName
    if (!formData.DisplayName.trim()) {
      formIsValid = false;
      newErrors.DisplayName = 'Display Name is required';
    }

    // Validate Email
    if (!formData.Email.trim()) {
      formIsValid = false;
      newErrors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      formIsValid = false;
      newErrors.Email = 'Email format is invalid';
    }

    // Set error messages if any
    setErrors(newErrors);

    // If form is valid, submit the data
    if (formIsValid) {
      onSubmit(formData);
    }
  };

  return (
    <div className="form-container">
      <h2>{headerTitle}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="DisplayName">Display Name</label>
          <input
            type="text"
            id="DisplayName"
            name="DisplayName"
            value={formData.DisplayName}
            onChange={handleChange}
            required
          />
          {errors.DisplayName && <div className="error">{errors.DisplayName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            id="Email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
          {errors.Email && <div className="error">{errors.Email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="Status">Status</label>
          <select
            id="Status"
            name="Status"
            value={formData.Status}
            onChange={handleChange}
          >
            <option value="null" disabled>
            -- select --
            </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="AdminUser">Admin User</label>
          <select
            id="AdminUser"
            name="AdminUser"
            value={formData.AdminUser}
            onChange={handleChange}
          >
            <option value="null" disabled>
            -- select --
            </option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="FunctionalUser">Functional User</label>
          <select
            id="FunctionalUser"
            name="FunctionalUser"
            value={formData.FunctionalUser}
            onChange={handleChange}
          >
            <option value="null" disabled>
              -- select --
            </option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="BlockAccess">Block Access</label>
          <select
            id="BlockAccess"
            name="BlockAccess"
            value={formData.BlockAccess}
            onChange={handleChange}
          >
            <option value="null" disabled>
            -- select --
            </option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="HierarchyMaintenance">Hierarchy Maintenance</label>
          <select
            id="HierarchyMaintenance"
            name="HierarchyMaintenance"
            value={formData.HierarchyMaintenance}
            onChange={handleChange}
          >
            <option value="null" disabled>
            -- select --
            </option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        <div className="form-group">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
