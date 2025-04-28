import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';

const UserForm = ({ headerTitle, users, onSubmit }) => {
  const { UserID } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(UserID);

  const [formData, setFormData] = useState({
    DisplayName: '',
    Email: '',
    Status: '',
    AdminUser: '',
    FunctionalUser: '',
    BlockAccess: '',
    MFA_Mobile: '',
  });

  useEffect(() => {
    if (isEditing && users.length > 0) {
      const userToEdit = users.find((u) => u.UserID === parseInt(UserID));
      if (userToEdit) {
        setFormData({
          DisplayName: userToEdit.DisplayName || '',
          Email: userToEdit.Email || '',
          Status: userToEdit.Status || '',
          AdminUser: userToEdit.AdminUser ? '1' : '0',
          FunctionalUser: userToEdit.FunctionalUser ? '1' : '0',
          BlockAccess: userToEdit.BlockAccess ? '1' : '0',
          MFA_Mobile: userToEdit.MFA_Mobile || '',
        });
      }
    }
  }, [UserID, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      AdminUser: formData.AdminUser === '1' ? 1 : 0,
      FunctionalUser: formData.FunctionalUser === '1' ? 1 : 0,
      BlockAccess: formData.BlockAccess === '1' ? 1 : 0,
    };

    await onSubmit(updatedFormData, isEditing, UserID);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="form-container">
      <h2>{headerTitle}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Display Name</label>
          <input
            type="text"
            name="DisplayName"
            value={formData.DisplayName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>MFA Mobile</label>
          <input
            type="text"
            name="MFA_Mobile"
            value={formData.MFA_Mobile}
            onChange={handleChange}
          />
        </div>

        {['Status', 'AdminUser', 'FunctionalUser', 'BlockAccess'].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.replace(/([A-Z])/g, ' $1')}</label>
            <select name={field} value={formData[field]} onChange={handleChange}>
              {field === 'Status' ? (
                <>
                  <option value="">--Select Status--</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Testing">Testing</option>
                </>
              ) : (
                <>
                  <option value="">--Select--</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </>
              )}
            </select>
          </div>
        ))}

        <div className="form-buttons">
          <button type="submit" className="submit-btn">{isEditing ? 'Update' : 'Submit'}</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
