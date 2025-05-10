import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../../api';
import './MobileRecharge.css';

const MobileRecharge = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [plans, setPlans] = useState([]);
  const [showPlans, setShowPlans] = useState(false);
  
  const [formData, setFormData] = useState({
    accountNumber: '',
    mobileNumber: '',
    operator: '',
    circle: '',
    rechargeType: 'PREPAID',
    amount: '',
    planId: '',
    saveAsFavorite: false,
    nickname: ''
  });

  // Mobile operators
  const operators = [
    'Airtel',
    'Jio',
    'Vodafone Idea',
    'BSNL',
    'MTNL'
  ];

  // Telecom circles
  const circles = [
    'Andhra Pradesh',
    'Assam',
    'Bihar & Jharkhand',
    'Chennai',
    'Delhi NCR',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu & Kashmir',
    'Karnataka',
    'Kerala',
    'Kolkata',
    'Madhya Pradesh & Chhattisgarh',
    'Maharashtra & Goa',
    'Mumbai',
    'North East',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'UP East',
    'UP West',
    'West Bengal'
  ];

  // Sample recharge plans based on operator
  const rechargePlans = {
    'Airtel': [
      { id: 'A1', price: 149, validity: '28 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'A2', price: 249, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'A3', price: 499, validity: '56 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'A4', price: 698, validity: '84 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ],
    'Jio': [
      { id: 'J1', price: 199, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'J2', price: 249, validity: '28 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'J3', price: 399, validity: '28 days', data: '3GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'J4', price: 555, validity: '84 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ],
    'Vodafone Idea': [
      { id: 'V1', price: 155, validity: '28 days', data: '2GB', description: 'Unlimited calls, 300 SMS' },
      { id: 'V2', price: 239, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'V3', price: 475, validity: '56 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'V4', price: 719, validity: '84 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ],
    'BSNL': [
      { id: 'B1', price: 118, validity: '28 days', data: '0.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'B2', price: 187, validity: '28 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'B3', price: 399, validity: '80 days', data: '1GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'B4', price: 666, validity: '110 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ],
    'MTNL': [
      { id: 'M1', price: 196, validity: '28 days', data: '1GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'M2', price: 329, validity: '45 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'M3', price: 399, validity: '56 days', data: '1GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'M4', price: 598, validity: '84 days', data: '1GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ]
  };

  // Fetch user's bank accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/v1/accounts');
        const data = await response.json();
        if (data && data.data) {
          setAccounts(data.data);
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts. Please refresh the page.');
      }
    };

    fetchAccounts();
  }, []);

  // Load plans when operator changes
  useEffect(() => {
    if (formData.operator && formData.rechargeType === 'PREPAID') {
      setPlans(rechargePlans[formData.operator] || []);
    } else {
      setPlans([]);
    }
  }, [formData.operator, formData.rechargeType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Reset plan selection when operator changes
    if (name === 'operator') {
      setFormData(prevState => ({
        ...prevState,
        planId: '',
        amount: ''
      }));
    }

    // Reset plan selection when plan type changes
    if (name === 'rechargeType') {
      setFormData(prevState => ({
        ...prevState,
        planId: '',
        amount: ''
      }));
      setShowPlans(false);
    }

    // Set amount when plan is selected
    if (name === 'planId' && value) {
      const selectedPlan = plans.find(plan => plan.id === value);
      if (selectedPlan) {
        setFormData(prevState => ({
          ...prevState,
          amount: selectedPlan.price.toString()
        }));
      }
    }
  };

  const handleViewPlans = () => {
    if (formData.operator && formData.rechargeType === 'PREPAID') {
      setShowPlans(true);
    } else {
      setError('Please select an operator first');
    }
  };

  const validateForm = () => {
    let isValid = true;
    setError('');

    if (!formData.accountNumber) {
      setError('Please select an account to pay from');
      isValid = false;
    } else if (!formData.mobileNumber || !/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9');
      isValid = false;
    } else if (!formData.operator) {
      setError('Please select a mobile operator');
      isValid = false;
    } else if (!formData.circle) {
      setError('Please select a circle/region');
      isValid = false;
    } else if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount or select a plan');
      isValid = false;
    } else if (!formData.planId && formData.rechargeType === 'PREPAID') {
      setError('Please select a plan');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      setError('');
      
      try {
        const rechargeData = {
          ...formData,
          amount: parseFloat(formData.amount)
        };
        
        const response = await paymentService.mobileRecharge(rechargeData);
        setSuccess(`Recharge of ₹${formData.amount} for ${formData.mobileNumber} (${formData.operator}) was successful.`);
        
        // Reset form
        setFormData({
          accountNumber: '',
          mobileNumber: '',
          operator: '',
          circle: '',
          rechargeType: 'PREPAID',
          amount: '',
          planId: '',
          saveAsFavorite: false,
          nickname: ''
        });
        setShowPlans(false);
        
        // Navigate to dashboard after a delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (error) {
        setError(error.message || 'Failed to process recharge. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const selectPlan = (plan) => {
    setFormData(prevState => ({
      ...prevState,
      planId: plan.id,
      amount: plan.price.toString()
    }));
    setShowPlans(false);
  };

  return (
    <div className="mobile-recharge-container">
      <div className="page-header">
        <h1>Mobile Recharge</h1>
        <p>Recharge your prepaid mobile or pay your postpaid bills</p>
      </div>
      
      {success ? (
        <div className="success-message">
          <i className="success-icon">✓</i>
          <div className="success-content">
            <h3>Recharge Successful!</h3>
            <p>{success}</p>
            <p className="redirect-message">Redirecting to dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="recharge-form-container">
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="recharge-form">
            <div className="form-group">
              <label>Select Account</label>
              <select 
                name="accountNumber" 
                value={formData.accountNumber}
                onChange={handleChange}
                required
              >
                <option value="">Select an account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.accountNumber}>
                    {account.accountNumber} - {account.accountType}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Mobile Number</label>
              <input 
                type="text" 
                name="mobileNumber" 
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength="10"
                pattern="[6-9][0-9]{9}"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Operator</label>
              <select 
                name="operator" 
                value={formData.operator}
                onChange={handleChange}
                required
              >
                <option value="">Select operator</option>
                {operators.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Circle/Region</label>
              <select 
                name="circle" 
                value={formData.circle}
                onChange={handleChange}
                required
              >
                <option value="">Select circle</option>
                {circles.map(circle => (
                  <option key={circle} value={circle}>{circle}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Recharge Type</label>
              <div className="radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="rechargeType" 
                    value="PREPAID"
                    checked={formData.rechargeType === 'PREPAID'}
                    onChange={handleChange}
                  />
                  Prepaid
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="rechargeType" 
                    value="POSTPAID"
                    checked={formData.rechargeType === 'POSTPAID'}
                    onChange={handleChange}
                  />
                  Postpaid
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="rechargeType" 
                    value="DTH"
                    checked={formData.rechargeType === 'DTH'}
                    onChange={handleChange}
                  />
                  DTH
                </label>
              </div>
            </div>
            
            {formData.rechargeType === 'PREPAID' && (
              <div className="form-group">
                <button 
                  type="button" 
                  className="view-plans-btn"
                  onClick={handleViewPlans}
                  disabled={!formData.operator}
                >
                  View Plans
                </button>
              </div>
            )}
            
            <div className="form-group">
              <label>Amount (₹)</label>
              <input 
                type="number" 
                name="amount" 
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="10"
                required
                readOnly={formData.rechargeType === 'PREPAID' && formData.planId}
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  name="saveAsFavorite" 
                  checked={formData.saveAsFavorite}
                  onChange={handleChange}
                />
                Save as favorite
              </label>
            </div>
            
            {formData.saveAsFavorite && (
              <div className="form-group">
                <label>Nickname for this recharge</label>
                <input 
                  type="text" 
                  name="nickname" 
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="E.g., My Jio"
                />
              </div>
            )}
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Recharge Now`}
            </button>
          </form>
          
          {showPlans && (
            <div className="plans-container">
              <div className="plans-header">
                <h3>{formData.operator} Plans</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowPlans(false)}
                >
                  ×
                </button>
              </div>
              <div className="plans-list">
                {plans.map(plan => (
                  <div 
                    key={plan.id} 
                    className="plan-item"
                    onClick={() => selectPlan(plan)}
                  >
                    <div className="plan-price">₹{plan.price}</div>
                    <div className="plan-details">
                      <div className="plan-validity">Validity: {plan.validity}</div>
                      <div className="plan-data">Data: {plan.data}</div>
                      <div className="plan-description">{plan.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileRecharge;