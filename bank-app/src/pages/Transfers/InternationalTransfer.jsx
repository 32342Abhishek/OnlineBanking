import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../../api';
import { useToast } from '../../hooks/useToast';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import './TransferPages.css';

const InternationalTransfer = () => {
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
    swiftCode: '',
    iban: '',
    bankName: '',
    bankAddress: '',
    country: '',
    currency: 'USD'
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
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Please enter amount';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.beneficiaryName) {
      newErrors.beneficiaryName = 'Please enter beneficiary name';
    }

    if (!formData.swiftCode) {
      newErrors.swiftCode = 'Please enter SWIFT/BIC code';
    } else if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(formData.swiftCode)) {
      newErrors.swiftCode = 'Please enter a valid SWIFT/BIC code';
    }

    if (!formData.iban) {
      newErrors.iban = 'Please enter IBAN';
    }

    if (!formData.bankName) {
      newErrors.bankName = 'Please enter bank name';
    }

    if (!formData.bankAddress) {
      newErrors.bankAddress = 'Please enter bank address';
    }

    if (!formData.country) {
      newErrors.country = 'Please select country';
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
      await transactionService.internationalTransfer({
        fromAccountNumber: formData.fromAccount,
        toAccountNumber: formData.toAccount,
        amount: parseFloat(formData.amount),
        description: formData.description || 'International Transfer',
        beneficiaryName: formData.beneficiaryName,
        swiftCode: formData.swiftCode,
        iban: formData.iban,
        bankName: formData.bankName,
        bankAddress: formData.bankAddress,
        country: formData.country,
        currency: formData.currency
      });

      showToast('Transfer initiated successfully!', 'success');
      navigate('/transfer-success', { 
        state: { 
          amount: formData.amount,
          beneficiary: formData.beneficiaryName,
          accountNumber: formData.toAccount,
          transferType: 'International',
          currency: formData.currency
        }
      });
    } catch (error) {
      showToast(error.message || 'Transfer failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'JPY', name: 'Japanese Yen' }
  ];

  const countries = [
    'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
    'Canada', 'Australia', 'Singapore', 'Japan', 'Switzerland', 'Netherlands'
  ];

  return (
    <div className="transfer-page-container">
      <button 
        className="back-button"
        onClick={() => navigate('/transfer-money')}
      >
        <FaArrowLeft /> Back
      </button>

      <div className="transfer-form-wrapper">
        <h1>International Transfer</h1>
        <p className="subtitle">Send money abroad securely</p>

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
            <label htmlFor="swiftCode">SWIFT/BIC Code</label>
            <input
              type="text"
              id="swiftCode"
              name="swiftCode"
              value={formData.swiftCode}
              onChange={handleChange}
              className={errors.swiftCode ? 'error' : ''}
              placeholder="Enter bank SWIFT/BIC code"
            />
            {errors.swiftCode && <span className="error-message">{errors.swiftCode}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="iban">IBAN</label>
            <input
              type="text"
              id="iban"
              name="iban"
              value={formData.iban}
              onChange={handleChange}
              className={errors.iban ? 'error' : ''}
              placeholder="Enter IBAN"
            />
            {errors.iban && <span className="error-message">{errors.iban}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className={errors.bankName ? 'error' : ''}
              placeholder="Enter recipient bank name"
            />
            {errors.bankName && <span className="error-message">{errors.bankName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="bankAddress">Bank Address</label>
            <textarea
              id="bankAddress"
              name="bankAddress"
              value={formData.bankAddress}
              onChange={handleChange}
              className={errors.bankAddress ? 'error' : ''}
              placeholder="Enter recipient bank address"
            />
            {errors.bankAddress && <span className="error-message">{errors.bankAddress}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={errors.country ? 'error' : ''}
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {errors.country && <span className="error-message">{errors.country}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
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
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
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

export default InternationalTransfer;
