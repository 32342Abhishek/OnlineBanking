import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../config';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${APP_CONFIG.API_BASE_URL}/api/v1/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
            localStorage.removeItem(APP_CONFIG.USER_KEY);
            navigate('/login');
            throw new Error('Session expired. Please login again.');
          }
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')}>Return to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Profile</h1>
        {profileData?.role === 'ADMIN' ? (
          // Admin Profile View
          <div className="profile-details">
            <div className="profile-field">
              <label>Full Name:</label>
              <span>{profileData.firstName} {profileData.lastName}</span>
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <span>{profileData.email}</span>
            </div>
            <div className="profile-field">
              <label>Role:</label>
              <span className="role-badge">{profileData.role}</span>
            </div>
          </div>
        ) : (
          // User Profile View
          <div className="profile-details">
            <div className="profile-field">
              <label>Full Name:</label>
              <span>{profileData.firstName} {profileData.lastName}</span>
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <span>{profileData.email}</span>
            </div>
            <div className="profile-field">
              <label>Phone Number:</label>
              <span>{profileData.phoneNumber || 'Not provided'}</span>
            </div>
            <div className="profile-field">
              <label>Address:</label>
              <span>{profileData.address || 'Not provided'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 