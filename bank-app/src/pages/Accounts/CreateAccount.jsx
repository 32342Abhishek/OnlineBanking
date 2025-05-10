import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService, authService } from '../../api';
import apiDiagnostic from '../../utils/apiDiagnostic';
import './CreateAccount.css';

const CreateAccount = () => {
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    accountType: 'SAVINGS',
    initialDeposit: '',
    currency: 'INR',
    branch: 'MAIN',
    nomineeName: '',
    nomineeRelationship: ''
  });

  // Check token validity on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const result = await authService.validateToken();
        setTokenStatus(result);
        
        if (!result.valid) {
          setError(`Authentication issue: ${result.reason}`);
        }
      } catch (err) {
        console.error('Error validating token:', err);
        setTokenStatus({ valid: false, reason: err.message });
      }
    };
    
    validateToken();
  }, []);

  const runDiagnostics = async () => {
    setError('');
    setShowDiagnostics(true);
    try {
      const results = await apiDiagnostic.testAccountEndpoints();
      setDiagnosticResults(results);
    } catch (err) {
      console.error('Error running diagnostics:', err);
      setError('Failed to run diagnostics: ' + err.message);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate token first
      const tokenValidation = await authService.validateToken();
      if (!tokenValidation.valid) {
        setError(`Authentication issue: ${tokenValidation.reason}. Please log in again.`);
        setLoading(false);
        return;
      }
      
      // Create account
      const response = await accountService.createAccount(formData);
      
      setSuccess('Account created successfully!');
      console.log('Account created:', response);
      
      // Reset form
      setFormData({
        accountType: 'SAVINGS',
        initialDeposit: '',
        currency: 'INR',
        branch: 'MAIN',
        nomineeName: '',
        nomineeRelationship: ''
      });
    } catch (err) {
      console.error('Error creating account:', err);
      setError(err.message || 'Failed to create account. Please try again.');
      
      // If token is invalid, redirect to login
      if (err.message.includes('session has expired') || 
          err.message.includes('Authentication required')) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const refreshToken = async () => {
    try {
      setLoading(true);
      const result = await authService.refreshToken();
      
      if (result.success) {
        setSuccess('Token refreshed successfully!');
        // Validate the new token
        const validation = await authService.validateToken();
        setTokenStatus(validation);
      } else {
        setError(`Failed to refresh token: ${result.reason}`);
      }
    } catch (err) {
      setError(`Error refreshing token: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-header">
        <h1>Open a New Account</h1>
        <p>Choose the account type that best suits your needs</p>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={runDiagnostics} 
            className="diagnostic-btn"
            style={{ fontSize: '0.8rem', padding: '5px 10px' }}
          >
            Run API Diagnostics
          </button>
          
          <button 
            onClick={refreshToken} 
            className="refresh-token-btn"
            style={{ fontSize: '0.8rem', padding: '5px 10px' }}
            disabled={loading}
          >
            Refresh Token
          </button>
          
          <button 
            onClick={() => navigate('/login')} 
            className="login-btn"
            style={{ fontSize: '0.8rem', padding: '5px 10px' }}
          >
            Go to Login
          </button>
        </div>
      </div>

      {/* Token status */}
      {tokenStatus && (
        <div style={{ 
          margin: '10px 0', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: tokenStatus.valid ? '#e6ffe6' : '#ffe6e6'
        }}>
          <h3>Token Status</h3>
          <p><strong>Valid:</strong> {tokenStatus.valid ? 'Yes' : 'No'}</p>
          {!tokenStatus.valid && (
            <p><strong>Reason:</strong> {tokenStatus.reason}</p>
          )}
          {tokenStatus.user && (
            <p><strong>User:</strong> {JSON.stringify(tokenStatus.user)}</p>
          )}
        </div>
      )}

      {/* Error and success messages */}
      {error && (
        <div className="error-message" style={{ 
          margin: '10px 0', 
          padding: '10px', 
          backgroundColor: '#ffe6e6',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message" style={{ 
          margin: '10px 0', 
          padding: '10px', 
          backgroundColor: '#e6ffe6',
          borderRadius: '5px'
        }}>
          {success}
        </div>
      )}

      {/* Diagnostic results */}
      {showDiagnostics && (
        <div className="diagnostic-results" style={{ 
          margin: '10px 0', 
          padding: '10px', 
          border: '1px solid #ccc', 
          borderRadius: '5px',
          backgroundColor: '#f8f8f8',
          fontSize: '0.9rem'
        }}>
          <h3>API Diagnostic Results</h3>
          {diagnosticResults ? (
            <div>
              <p><strong>Base URL:</strong> {diagnosticResults.baseUrl}</p>
              <p><strong>Success:</strong> {diagnosticResults.success ? 'Yes' : 'No'}</p>
              
              <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#eef', borderRadius: '5px' }}>
                <h4>Authentication Status</h4>
                <p><strong>Has Token:</strong> {diagnosticResults.auth?.hasToken ? 'Yes' : 'No'}</p>
                {diagnosticResults.auth?.tokenValue && (
                  <p><strong>Token:</strong> {diagnosticResults.auth.tokenValue}</p>
                )}
                {diagnosticResults.auth?.tokenExpiry && (
                  <p><strong>Token Expires:</strong> {diagnosticResults.auth.tokenExpiry.toString()}</p>
                )}
                <p><strong>Token Expired:</strong> {diagnosticResults.auth?.isExpired ? 'Yes' : 'No'}</p>
                <p><strong>User Data:</strong> {diagnosticResults.auth?.hasUser ? 'Present' : 'Missing'}</p>
                
                {(!diagnosticResults.auth?.hasToken || diagnosticResults.auth?.isExpired) && (
                  <button 
                    onClick={() => navigate('/login')}
                    style={{ 
                      backgroundColor: '#4f46e5', 
                      color: 'white', 
                      padding: '5px 10px', 
                      border: 'none', 
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Go to Login
                  </button>
                )}
              </div>
              
              {diagnosticResults.endpoints.accounts && (
                <div>
                  <p><strong>Accounts Endpoint:</strong> {diagnosticResults.endpoints.accounts.endpoint}</p>
                  <p><strong>Full URL:</strong> {diagnosticResults.endpoints.accounts.fullUrl}</p>
                  <p><strong>Normalized Endpoint:</strong> {diagnosticResults.endpoints.accounts.normalizedEndpoint}</p>
                  <p><strong>GET Status:</strong> {diagnosticResults.endpoints.accounts.getStatus || 'N/A'}</p>
                  {diagnosticResults.endpoints.accounts.getError && (
                    <p><strong>Error:</strong> {diagnosticResults.endpoints.accounts.getError}</p>
                  )}
                </div>
              )}
              
              {diagnosticResults.errors.length > 0 && (
                <div>
                  <p><strong>Errors:</strong></p>
                  <ul>
                    {diagnosticResults.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button onClick={() => setShowDiagnostics(false)} style={{ marginTop: '10px' }}>
                Hide Diagnostics
              </button>
            </div>
          ) : (
            <p>Running diagnostics...</p>
          )}
        </div>
      )}
      
      {/* Account creation form */}
      <div className="account-form-container" style={{ margin: '20px 0' }}>
        <h2>Create New Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="accountType">Account Type</label>
            <select 
              id="accountType" 
              name="accountType" 
              value={formData.accountType}
              onChange={handleChange}
              required
            >
              <option value="SAVINGS">Savings Account</option>
              <option value="CURRENT">Current Account</option>
              <option value="SALARY">Salary Account</option>
              <option value="FIXED_DEPOSIT">Fixed Deposit Account</option>
              <option value="RECURRING_DEPOSIT">Recurring Deposit Account</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="initialDeposit">Initial Deposit (₹)</label>
            <input 
              type="number" 
              id="initialDeposit" 
              name="initialDeposit" 
              value={formData.initialDeposit}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select 
              id="currency" 
              name="currency" 
              value={formData.currency}
              onChange={handleChange}
              required
            >
              <option value="INR">Indian Rupee (INR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="branch">Branch</label>
            <select 
              id="branch" 
              name="branch" 
              value={formData.branch}
              onChange={handleChange}
              required
            >
              <option value="MAIN">Main Branch</option>
              <option value="NORTH">North Branch</option>
              <option value="SOUTH">South Branch</option>
              <option value="EAST">East Branch</option>
              <option value="WEST">West Branch</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="nomineeName">Nominee Name (Optional)</label>
            <input 
              type="text" 
              id="nomineeName" 
              name="nomineeName" 
              value={formData.nomineeName}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nomineeRelationship">Nominee Relationship (Optional)</label>
            <input 
              type="text" 
              id="nomineeRelationship" 
              name="nomineeRelationship" 
              value={formData.nomineeRelationship}
              onChange={handleChange}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount; 