import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService, authService } from '../api';
import authDiagnostic from '../utils/authDiagnostic';
import { API_CONFIG } from '../config';
import './CreateAccount.css';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accountData, setAccountData] = useState({
    accountType: 'SAVINGS',
    initialDeposit: ''
  });

  // Run auth diagnostics when the component mounts
  useEffect(() => {
    console.log('Running authentication diagnostics on component mount...');
    
    // Check for auth issues
    const tokenStatus = authDiagnostic.checkTokenStorage();
    console.log('Token storage status:', tokenStatus);
    
    // If there's a mismatch, try to migrate the tokens
    if (tokenStatus.hasMismatch) {
      console.log('Token mismatch detected - migrating tokens...');
      const migrationResult = authDiagnostic.migrateTokens();
      console.log('Token migration result:', migrationResult);
    }
    
    // Final auth check
    const authStatus = authDiagnostic.checkAuthStatus();
    console.log('Authentication status after diagnostics:', authStatus);
    
    if (!authStatus.isAuthenticated) {
      console.error('User not authenticated after diagnostics - redirecting to login');
      setError('You must be logged in to create an account. Redirecting to login page...');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountData({
      ...accountData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!accountData.accountType) {
      setError('Please select an account type');
      return false;
    }
    
    if (!accountData.initialDeposit || 
        isNaN(accountData.initialDeposit) || 
        parseFloat(accountData.initialDeposit) < 500) {
      setError('Initial deposit must be at least ₹500');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setSuccess('');
      setError('');
      
      // Check authentication status before making the request
      const authStatus = authDiagnostic.checkAuthStatus();
      if (!authStatus.isAuthenticated) {
        throw new Error('You must be logged in to create an account. Please login first.');
      }
      
      // Log the token before making the request
      console.log('Auth token before request:', authService.getToken());
      
      // DEBUG OUTPUT - show the full API URL
      console.log('Making request to:', API_CONFIG.BASE_URL + API_CONFIG.ACCOUNTS.CREATE);
      
      const response = await accountService.createAccount({
        accountType: accountData.accountType,
        accountName: "Personal " + accountData.accountType.toLowerCase(),
        initialDeposit: parseFloat(accountData.initialDeposit),
        currency: "INR"
      });
      
      console.log('Account creation response:', response);
      
      setSuccess('Account created successfully!');
      
      // Reset form
      setAccountData({
        accountType: 'SAVINGS',
        initialDeposit: ''
      });
      
      // Navigate back to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
      console.error('Create account error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="create-account-container">
      <button className="back-button" onClick={handleBack}>← Back to Dashboard</button>
      
      <div className="create-account-form-container">
        <h1>Create New Account</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="accountType">Account Type</label>
            <select
              id="accountType"
              name="accountType"
              value={accountData.accountType}
              onChange={handleChange}
              required
            >
              <option value="SAVINGS">Savings Account</option>
              <option value="CURRENT">Current Account</option>
              <option value="FIXED_DEPOSIT">Fixed Deposit</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="initialDeposit">Initial Deposit (₹)</label>
            <input
              type="number"
              id="initialDeposit"
              name="initialDeposit"
              value={accountData.initialDeposit}
              onChange={handleChange}
              placeholder="Minimum ₹500"
              min="500"
              step="0.01"
              required
            />
            <small className="helper-text">Minimum deposit amount is ₹500</small>
          </div>
          
          <button
            type="submit"
            className="create-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount; 