import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CheckboxField from '../../Components/CheckBoxField'; 
import './styles.scss';

const UserForm = ({ headerTitle, users, onSubmit }) => {
  const { UserID } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(UserID);

  const [formData, setFormData] = useState({
    DisplayName: '',
    Email: '',
    Status: '',
    AdminUser: false,
    FunctionalUser: false,
    BlockAccess: false,
    MFA_Mobile: '',
  });

  useEffect(() => {
    if (isEditing && users.length > 0) {
      console.log(users.length);
      const userToEdit = users.find((u) => u.UserID === parseInt(UserID));
      if (userToEdit) {
        setFormData({
          DisplayName: userToEdit.DisplayName || '',
          Email: userToEdit.Email || '',
          Status: userToEdit.Status || '',
          AdminUser: Boolean(userToEdit.AdminUser),
          FunctionalUser: Boolean(userToEdit.FunctionalUser),
          BlockAccess: Boolean(userToEdit.BlockAccess),
          MFA_Mobile: userToEdit.MFA_Mobile || '',
        });
      }
    }
  }, [UserID, users, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  const isDuplicate = users.some(user =>
    user.Email.toLowerCase() === formData.Email.toLowerCase() &&
    (!isEditing || user.UserID !== parseInt(UserID))
  );

  if (isDuplicate) {
    alert('Oops! This email is already registered. Please use a different email.');
    return;
  }

    const updatedFormData = {
      ...formData,
      AdminUser: formData.AdminUser ? 1 : 0,
      FunctionalUser: formData.FunctionalUser ? 1 : 0,
      BlockAccess: formData.BlockAccess ? 1 : 0,
    };

    try {
      await onSubmit(updatedFormData, isEditing, UserID);
      if (isEditing) {
        alert('User updated successfully!');
      } else {
        alert('User added successfully!');
      }
      navigate('/');
    } catch (error) {
      alert('Failed to submit. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/');
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
        </div>

        <div className="form-group">
          <label htmlFor="MFA_Mobile">MFA Mobile</label>
          <input
            type="text"
            id="MFA_Mobile"
            name="MFA_Mobile"
            value={formData.MFA_Mobile}
            onChange={(e) => {
              handleChange(e);
              e.target.setCustomValidity('');
            }}
            pattern="[0-9+\-]*"
            onInvalid={(e) => {
              e.target.setCustomValidity("Only digits, '+' and '-' are allowed.");
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Status">Status</label>
          <select
            id="Status"
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            required
          >
            <option value="">--Select Status--</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Testing">Testing</option>
          </select>
        </div>

        <CheckboxField
          label="Admin User"
          name="AdminUser"
          checked={formData.AdminUser}
          onChange={handleChange}
        />

        <CheckboxField
          label="Functional User"
          name="FunctionalUser"
          checked={formData.FunctionalUser}
          onChange={handleChange}
        />

        <CheckboxField
          label="Block Access"
          name="BlockAccess"
          checked={formData.BlockAccess}
          onChange={handleChange}
        />

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            {isEditing ? 'Update' : 'Submit'}
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
