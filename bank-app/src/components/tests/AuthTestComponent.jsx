import React, { useState, useEffect } from 'react';
import { authService } from '../../api';
import authDiagnostic from '../../utils/authDiagnostic';
import { APP_CONFIG } from '../../config';

const AuthTestComponent = () => {
  const [authStatus, setAuthStatus] = useState(null);
  const [tokenStatus, setTokenStatus] = useState(null);
  const [loginResult, setLoginResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: 'test@example.com',
    password: 'password123'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const status = authDiagnostic.checkAuthStatus();
    setAuthStatus(status);

    const tokens = authDiagnostic.checkTokenStorage();
    setTokenStatus(tokens);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleTestLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const result = await authDiagnostic.testLogin(credentials);
      setLoginResult(result);
      
      if (result.success) {
        setSuccess('Login successful!');
      } else {
        setError(result.error || 'Login failed');
      }
      
      // Re-check auth status
      setTimeout(checkAuth, 500);
    } catch (err) {
      setError(err.message);
      console.error('Login test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMigrateTokens = () => {
    setError('');
    setSuccess('');
    
    try {
      const result = authDiagnostic.migrateTokens();
      
      if (result.success) {
        setSuccess('Token migration successful');
      } else {
        setError(result.message);
      }
      
      // Re-check auth status
      setTimeout(checkAuth, 100);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClearAuth = () => {
    setError('');
    setSuccess('');
    
    try {
      const result = authDiagnostic.clearAuth();
      setSuccess('Authentication data cleared');
      
      // Re-check auth status
      setTimeout(checkAuth, 100);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-5 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Authentication Test Tool</h2>
      
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-2">Current Authentication Status</h3>
        <div className="bg-white p-3 rounded">
          {authStatus ? (
            <div>
              <p><strong>Is Authenticated:</strong> {authStatus.isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Has User Data:</strong> {authStatus.hasUserData ? 'Yes' : 'No'}</p>
              {authStatus.token && <p><strong>Token:</strong> {authStatus.token}</p>}
            </div>
          ) : (
            <p>Loading authentication status...</p>
          )}
        </div>
      </div>
      
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-2">Token Storage Status</h3>
        <div className="bg-white p-3 rounded">
          {tokenStatus ? (
            <div>
              <p><strong>Config Token Key:</strong> {tokenStatus.configTokenKey}</p>
              <p><strong>Has Config Token:</strong> {tokenStatus.hasConfigToken ? 'Yes' : 'No'}</p>
              <p><strong>Has Hardcoded Token:</strong> {tokenStatus.hasHardcodedToken ? 'Yes' : 'No'}</p>
              <p><strong>Token Mismatch:</strong> {tokenStatus.hasMismatch ? 'Yes - ISSUE DETECTED' : 'No'}</p>
            </div>
          ) : (
            <p>Loading token status...</p>
          )}
        </div>
      </div>
      
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-2">Test Login</h3>
        <div className="bg-white p-3 rounded">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
        </div>
      </div>
      
      <div className="flex space-x-4 mb-5">
        <button
          onClick={handleMigrateTokens}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Migrate Tokens
        </button>
        
        <button
          onClick={handleClearAuth}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Auth Data
        </button>
        
        <button
          onClick={checkAuth}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Refresh Status
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong>Success:</strong> {success}
        </div>
      )}
      
      {loginResult && (
        <div className="mt-5">
          <h3 className="text-lg font-semibold mb-2">Login Result</h3>
          <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
            {JSON.stringify(loginResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuthTestComponent; 