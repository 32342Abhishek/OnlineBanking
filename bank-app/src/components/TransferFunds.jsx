import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService, transactionService, authService } from '../api';
import './TransferFunds.css';

const TransferFunds = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transferData, setTransferData] = useState({
    fromAccountNumber: '',
    toAccountNumber: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    // Check if user is logged in
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    fetchAccounts();
  }, [navigate]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountService.getAllAccounts();
      setAccounts(response.data || []);
      
      // Set the first account as the default 'from' account if available
      if (response.data && response.data.length > 0) {
        setTransferData(prev => ({
          ...prev,
          fromAccountNumber: response.data[0].accountNumber
        }));
      }
    } catch (err) {
      setError('Failed to fetch your accounts. Please try again later.');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransferData({
      ...transferData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!transferData.fromAccountNumber) {
      setError('Please select a source account');
      return false;
    }
    
    if (!transferData.toAccountNumber) {
      setError('Please enter a destination account number');
      return false;
    }
    
    if (transferData.fromAccountNumber === transferData.toAccountNumber) {
      setError('Source and destination accounts cannot be the same');
      return false;
    }
    
    if (!transferData.amount || isNaN(transferData.amount) || parseFloat(transferData.amount) <= 0) {
      setError('Please enter a valid amount greater than zero');
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
      setSubmitting(true);
      setSuccess('');
      setError('');
      
      const response = await transactionService.transferFunds({
        fromAccountNumber: transferData.fromAccountNumber,
        toAccountNumber: transferData.toAccountNumber,
        amount: parseFloat(transferData.amount),
        description: transferData.description || 'Transfer'
      });
      
      setSuccess('Transfer completed successfully!');
      
      // Reset form except fromAccountNumber
      setTransferData({
        fromAccountNumber: transferData.fromAccountNumber,
        toAccountNumber: '',
        amount: '',
        description: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed. Please try again.');
      console.error('Transfer error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="loading-container">Loading your accounts...</div>;
  }

  return (
    <div className="transfer-container">
      <button className="back-button" onClick={handleBack}>← Back to Dashboard</button>
      
      <div className="transfer-form-container">
        <h1>Transfer Funds</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fromAccountNumber">From Account</label>
            <select
              id="fromAccountNumber"
              name="fromAccountNumber"
              value={transferData.fromAccountNumber}
              onChange={handleChange}
              required
            >
              <option value="">Select an account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.accountNumber}>
                  {account.accountType} - {account.accountNumber} (₹{account.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="toAccountNumber">To Account Number</label>
            <input
              type="text"
              id="toAccountNumber"
              name="toAccountNumber"
              value={transferData.toAccountNumber}
              onChange={handleChange}
              placeholder="Enter destination account number"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={transferData.amount}
              onChange={handleChange}
              placeholder="Enter amount to transfer"
              min="1"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <input
              type="text"
              id="description"
              name="description"
              value={transferData.description}
              onChange={handleChange}
              placeholder="Enter a description for this transfer"
            />
          </div>
          
          <button
            type="submit"
            className="transfer-button"
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Transfer Funds'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferFunds; 