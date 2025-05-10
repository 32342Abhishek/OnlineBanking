import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UtilityBills.css';

const UtilityBills = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    accountId: '',
    billType: '',
    provider: '',
    consumerId: '',
    billNumber: '',
    amount: '',
    billDate: '',
    dueDate: '',
    payNow: true
  });

  // Utility providers based on bill type
  const utilityProviders = {
    ELECTRICITY: [
      'Adani Electricity',
      'BEST',
      'Tata Power',
      'Reliance Energy',
      'MSEDCL',
      'BSES Rajdhani',
      'BSES Yamuna',
      'CESC'
    ],
    WATER: [
      'Municipal Corporation',
      'Delhi Jal Board',
      'Bangalore Water Supply',
      'Chennai Metro Water',
      'Hyderabad Metropolitan Water Supply'
    ],
    GAS: [
      'Mahanagar Gas',
      'Indraprastha Gas',
      'Gujarat Gas',
      'Adani Gas',
      'Indian Oil'
    ],
    LANDLINE: [
      'BSNL',
      'Airtel',
      'Jio',
      'MTNL',
      'Tata Teleservices'
    ],
    BROADBAND: [
      'Airtel',
      'Jio Fiber',
      'BSNL Broadband',
      'ACT Fibernet',
      'Hathway',
      'MTNL'
    ],
    INSURANCE: [
      'LIC',
      'HDFC Life',
      'ICICI Prudential',
      'SBI Life',
      'Bajaj Allianz',
      'Max Life'
    ]
  };

  // Simulate fetching user's bank accounts
  useEffect(() => {
    // This would normally be an API call to get user accounts
    setAccounts([
      { id: '1', accountNumber: '1234567890', balance: 25000, accountType: 'SAVINGS' },
      { id: '2', accountNumber: '9876543210', balance: 5000, accountType: 'CURRENT' }
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Reset provider when bill type changes
    if (name === 'billType') {
      setFormData(prevState => ({
        ...prevState,
        provider: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    setError('');

    if (!formData.accountId) {
      setError('Please select an account to pay from');
      isValid = false;
    } else if (!formData.billType) {
      setError('Please select a bill type');
      isValid = false;
    } else if (!formData.provider) {
      setError('Please select a service provider');
      isValid = false;
    } else if (!formData.consumerId) {
      setError('Please enter consumer ID/account number');
      isValid = false;
    } else if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        // This would normally be an API call to process the payment
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        setSuccess(`Payment of ₹${formData.amount} successfully processed for your ${formData.billType.toLowerCase()} bill.`);
        
        // Reset form
        setFormData({
          accountId: '',
          billType: '',
          provider: '',
          consumerId: '',
          billNumber: '',
          amount: '',
          billDate: '',
          dueDate: '',
          payNow: true
        });
        
        // Navigate to dashboard after a delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (error) {
        setError('Failed to process payment. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="utility-bills-container">
      <div className="page-header">
        <h1>Pay Utility Bills</h1>
        <p>Pay your utility bills quickly and securely</p>
      </div>
      
      {success ? (
        <div className="success-message">
          <i className="success-icon">✓</i>
          <div className="success-content">
            <h3>Payment Successful!</h3>
            <p>{success}</p>
            <p className="redirect-message">Redirecting to dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="payment-form-container">
          <div className="services-tabs">
            <button 
              className={`service-tab ${formData.billType === 'ELECTRICITY' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, billType: 'ELECTRICITY', provider: ''})}
            >
              <i className="service-icon electricity-icon">⚡</i>
              <span>Electricity</span>
            </button>
            
            <button 
              className={`service-tab ${formData.billType === 'WATER' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, billType: 'WATER', provider: ''})}
            >
              <i className="service-icon water-icon">💧</i>
              <span>Water</span>
            </button>
            
            <button 
              className={`service-tab ${formData.billType === 'GAS' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, billType: 'GAS', provider: ''})}
            >
              <i className="service-icon gas-icon">🔥</i>
              <span>Gas</span>
            </button>
            
            <button 
              className={`service-tab ${formData.billType === 'LANDLINE' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, billType: 'LANDLINE', provider: ''})}
            >
              <i className="service-icon landline-icon">☎️</i>
              <span>Landline</span>
            </button>
            
            <button 
              className={`service-tab ${formData.billType === 'BROADBAND' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, billType: 'BROADBAND', provider: ''})}
            >
              <i className="service-icon broadband-icon">🌐</i>
              <span>Broadband</span>
            </button>
            
            <button 
              className={`service-tab ${formData.billType === 'INSURANCE' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, billType: 'INSURANCE', provider: ''})}
            >
              <i className="service-icon insurance-icon">🛡️</i>
              <span>Insurance</span>
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label htmlFor="accountId">Pay from Account*</label>
              <select
                id="accountId"
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
              >
                <option value="">Select Account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - ₹{account.balance.toLocaleString()} ({account.accountType})
                  </option>
                ))}
              </select>
            </div>
            
            {formData.billType && (
              <div className="form-group">
                <label htmlFor="provider">Service Provider*</label>
                <select
                  id="provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                >
                  <option value="">Select Provider</option>
                  {utilityProviders[formData.billType].map(provider => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {formData.provider && (
              <>
                <div className="form-group">
                  <label htmlFor="consumerId">Consumer ID / Account Number*</label>
                  <input
                    type="text"
                    id="consumerId"
                    name="consumerId"
                    value={formData.consumerId}
                    onChange={handleChange}
                    placeholder="Enter your consumer ID or account number"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="billNumber">Bill Number</label>
                    <input
                      type="text"
                      id="billNumber"
                      name="billNumber"
                      value={formData.billNumber}
                      onChange={handleChange}
                      placeholder="Enter bill number (optional)"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="amount">Amount (₹)*</label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="billDate">Bill Date</label>
                    <input
                      type="date"
                      id="billDate"
                      name="billDate"
                      value={formData.billDate}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="payNow"
                      checked={formData.payNow}
                      onChange={handleChange}
                    />
                    Pay immediately (uncheck to schedule for later)
                  </label>
                </div>
                
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Processing...' : 'Pay Bill'}
                </button>
              </>
            )}
          </form>
        </div>
      )}
      
      <div className="utility-features">
        <div className="feature-card">
          <div className="feature-icon">🔔</div>
          <h3>Bill Reminders</h3>
          <p>Set up alerts to never miss a payment deadline</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🔄</div>
          <h3>Auto-Pay</h3>
          <p>Set up automatic payments for your recurring bills</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Track Expenses</h3>
          <p>Monitor your utility spending over time</p>
        </div>
      </div>
    </div>
  );
};

export default UtilityBills;