import React, { useState } from 'react';
import apiTest from '../../utils/apiTest';
import accountService from '../../api/accountService';
import { API_CONFIG } from '../../config';

const ApiTestComponent = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountData, setAccountData] = useState({
    accountType: 'SAVINGS',
    accountName: 'Test Account',
    initialDeposit: 1000,
    currency: 'INR'
  });

  // Test API configuration
  const testApiConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = apiTest.testApiConfig();
      setResults(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Test health endpoint
  const testHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiTest.testHealth();
      setResults(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Test login
  const testLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiTest.testLogin();
      setResults(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Test Spring Boot paths
  const testSpringBootPaths = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiTest.testSpringBootPaths();
      setResults(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create account
  const createAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await accountService.createAccount(accountData);
      setResults({ success: true, account: result });
    } catch (err) {
      setError(err.message);
      setResults({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle account form changes
  const handleAccountDataChange = (e) => {
    const { name, value } = e.target;
    setAccountData({
      ...accountData,
      [name]: name === 'initialDeposit' ? parseFloat(value) : value
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">API Test Utility</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold">Current API Configuration</h3>
        <div className="bg-white p-3 rounded mb-2">
          <p><strong>Base URL:</strong> {API_CONFIG.BASE_URL}</p>
          <p><strong>Auth Login Path:</strong> {API_CONFIG.AUTH.LOGIN}</p>
          <p><strong>Accounts Path:</strong> {API_CONFIG.ACCOUNTS.CREATE}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={testApiConfig}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          Test API Config
        </button>
        <button
          onClick={testHealth}
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={loading}
        >
          Test Health Endpoint
        </button>
        <button
          onClick={testLogin}
          className="px-4 py-2 bg-purple-500 text-white rounded"
          disabled={loading}
        >
          Test Login
        </button>
        <button
          onClick={testSpringBootPaths}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          disabled={loading}
        >
          Test Path Conventions
        </button>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Create Account Test</h3>
        <div className="bg-white p-3 rounded">
          <div className="mb-2">
            <label className="block text-sm">Account Type</label>
            <input
              type="text"
              name="accountType"
              value={accountData.accountType}
              onChange={handleAccountDataChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-sm">Account Name</label>
            <input
              type="text"
              name="accountName"
              value={accountData.accountName}
              onChange={handleAccountDataChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-sm">Initial Deposit</label>
            <input
              type="number"
              name="initialDeposit"
              value={accountData.initialDeposit}
              onChange={handleAccountDataChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-sm">Currency</label>
            <input
              type="text"
              name="currency"
              value={accountData.currency}
              onChange={handleAccountDataChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          
          <button
            onClick={createAccount}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
            disabled={loading}
          >
            Create Account
          </button>
        </div>
      </div>
      
      {loading && <div className="text-center">Loading...</div>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {results && (
        <div className="bg-white p-3 rounded">
          <h3 className="font-semibold mb-2">Results</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent; 