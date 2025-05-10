import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../../api';
import { useToast } from '../../hooks/useToast';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import './TransferPages.css';

const InstantTransfer = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    beneficiaryName: '',
    ifscCode: '',
    transferType: 'IMPS'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUserAccounts();
  }, []);

  const fetchUserAccounts = async () => {
    try {
      const response = await transactionService.getUserAccounts();
      setAccounts(response.data || []);
      if (response.data?.length > 0) {
        setFormData(prev => ({ ...prev, fromAccount: response.data[0].accountNumber }));
      }
    } catch (error) {
      showToast('Failed to fetch accounts', 'error');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fromAccount) {
      newErrors.fromAccount = 'Please select your account';
    }
    
    if (!formData.toAccount) {
      newErrors.toAccount = 'Please enter recipient account number';
    } else if (formData.toAccount === formData.fromAccount) {
      newErrors.toAccount = 'Cannot transfer to the same account';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Please enter amount';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.beneficiaryName) {
      newErrors.beneficiaryName = 'Please enter beneficiary name';
    }

    if (!formData.ifscCode) {
      newErrors.ifscCode = 'Please enter IFSC code';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = 'Please enter a valid IFSC code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await transactionService.instantTransfer({
        fromAccountNumber: formData.fromAccount,
        toAccountNumber: formData.toAccount,
        amount: parseFloat(formData.amount),
        description: formData.description || 'Instant Transfer',
        beneficiaryName: formData.beneficiaryName,
        ifscCode: formData.ifscCode,
        transferType: formData.transferType
      });

      showToast('Transfer completed successfully!', 'success');
      navigate('/transfer-success', { 
        state: { 
          amount: formData.amount,
          beneficiary: formData.beneficiaryName,
          accountNumber: formData.toAccount,
          transferType: formData.transferType
        }
      });
    } catch (error) {
      showToast(error.message || 'Transfer failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-page-container">
      <button 
        className="back-button"
        onClick={() => navigate('/transfer-money')}
      >
        <FaArrowLeft /> Back
      </button>

      <div className="transfer-form-wrapper">
        <h1>Instant Transfer</h1>
        <p className="subtitle">Quick transfers to other banks via IMPS/NEFT</p>

        <form onSubmit={handleSubmit} className="transfer-form">
          <div className="form-group">
            <label htmlFor="fromAccount">From Account</label>
            <select
              id="fromAccount"
              name="fromAccount"
              value={formData.fromAccount}
              onChange={handleChange}
              className={errors.fromAccount ? 'error' : ''}
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account.accountNumber} value={account.accountNumber}>
                  {account.accountType} - {account.accountNumber} (₹{account.balance.toFixed(2)})
                </option>
              ))}
            </select>
            {errors.fromAccount && <span className="error-message">{errors.fromAccount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="transferType">Transfer Type</label>
            <select
              id="transferType"
              name="transferType"
              value={formData.transferType}
              onChange={handleChange}
            >
              <option value="IMPS">IMPS - Immediate Payment Service</option>
              <option value="NEFT">NEFT - National Electronic Funds Transfer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="beneficiaryName">Beneficiary Name</label>
            <input
              type="text"
              id="beneficiaryName"
              name="beneficiaryName"
              value={formData.beneficiaryName}
              onChange={handleChange}
              className={errors.beneficiaryName ? 'error' : ''}
              placeholder="Enter beneficiary name"
            />
            {errors.beneficiaryName && <span className="error-message">{errors.beneficiaryName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="toAccount">To Account</label>
            <input
              type="text"
              id="toAccount"
              name="toAccount"
              value={formData.toAccount}
              onChange={handleChange}
              className={errors.toAccount ? 'error' : ''}
              placeholder="Enter recipient account number"
            />
            {errors.toAccount && <span className="error-message">{errors.toAccount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ifscCode">IFSC Code</label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              className={errors.ifscCode ? 'error' : ''}
              placeholder="Enter bank IFSC code"
            />
            {errors.ifscCode && <span className="error-message">{errors.ifscCode}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={errors.amount ? 'error' : ''}
              placeholder="Enter amount"
              min="1"
              step="0.01"
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter transfer description"
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Processing...
              </>
            ) : (
              'Transfer Money'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InstantTransfer;