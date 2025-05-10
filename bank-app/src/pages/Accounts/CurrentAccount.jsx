import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../../api';
import './CurrentAccount.css';

const CurrentAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    registrationNumber: '',
    taxId: '',
    ownerName: '',
    email: '',
    phoneNumber: '',
    address: '',
    initialDeposit: 10000,
    uploadedBusinessProof: null,
    uploadedIdProof: null,
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData(prevState => ({
        ...prevState,
        [name]: files[0]
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    
    if (!formData.businessName) tempErrors.businessName = 'Business name is required';
    if (!formData.businessType) tempErrors.businessType = 'Business type is required';
    if (!formData.registrationNumber) tempErrors.registrationNumber = 'Registration number is required';
    if (!formData.taxId) tempErrors.taxId = 'Tax ID is required';
    if (!formData.ownerName) tempErrors.ownerName = 'Owner name is required';
    
    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid';
    }
    
    if (!formData.phoneNumber) {
      tempErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    
    if (!formData.address) tempErrors.address = 'Address is required';
    
    if (formData.initialDeposit < 10000) {
      tempErrors.initialDeposit = 'Minimum initial deposit is ₹10,000';
    }
    
    if (!formData.uploadedBusinessProof) tempErrors.uploadedBusinessProof = 'Business proof document is required';
    if (!formData.uploadedIdProof) tempErrors.uploadedIdProof = 'ID proof document is required';
    
    if (!formData.acceptTerms) tempErrors.acceptTerms = 'You must accept the terms and conditions';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        // In a real app, you would upload the files to a server here
        
        // Prepare account creation data
        const accountData = {
          accountType: 'CURRENT',
          accountHolderName: formData.businessName,
          initialBalance: formData.initialDeposit,
          additionalDetails: {
            businessType: formData.businessType,
            registrationNumber: formData.registrationNumber,
            taxId: formData.taxId,
            ownerName: formData.ownerName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            documentsUploaded: true
          }
        };
        
        // Call API to create account
        const response = await accountService.createAccount(accountData);
        
        setSuccess('Your Current Account application has been submitted successfully! We will review your application and get back to you shortly.');
        
        // Navigate to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
        
      } catch (error) {
        setErrors({
          submit: error.response?.data?.message || 'Failed to submit application. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="current-account-container">
      <div className="page-header">
        <h1>Current Account</h1>
        <p>The perfect banking solution for your business needs</p>
      </div>
      
      <div className="account-benefits">
        <h2>Benefits</h2>
        <ul>
          <li>Higher transaction limits for business operations</li>
          <li>Multiple signatory options for authorized personnel</li>
          <li>Overdraft facilities to manage cash flow</li>
          <li>Dedicated relationship manager</li>
          <li>Business banking facilities including POS, payment gateway integration</li>
          <li>Cash management services</li>
        </ul>
      </div>
      
      {success ? (
        <div className="success-message">{success}</div>
      ) : (
        <div className="application-form">
          <h2>Business Account Application</h2>
          {errors.submit && <div className="error-message">{errors.submit}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Business Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="businessName">Business Name*</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter business name"
                  />
                  {errors.businessName && <span className="error">{errors.businessName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="businessType">Business Type*</label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                  >
                    <option value="">Select Business Type</option>
                    <option value="SOLE_PROPRIETORSHIP">Sole Proprietorship</option>
                    <option value="PARTNERSHIP">Partnership</option>
                    <option value="PRIVATE_LIMITED">Private Limited</option>
                    <option value="PUBLIC_LIMITED">Public Limited</option>
                    <option value="LLP">Limited Liability Partnership</option>
                    <option value="OPC">One Person Company</option>
                  </select>
                  {errors.businessType && <span className="error">{errors.businessType}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="registrationNumber">Registration Number*</label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="Enter registration number"
                  />
                  {errors.registrationNumber && <span className="error">{errors.registrationNumber}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="taxId">Tax ID/GST Number*</label>
                  <input
                    type="text"
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="Enter tax ID or GST number"
                  />
                  {errors.taxId && <span className="error">{errors.taxId}</span>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Contact Information</h3>
              
              <div className="form-group">
                <label htmlFor="ownerName">Business Owner/Director Name*</label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Enter owner's name"
                />
                {errors.ownerName && <span className="error">{errors.ownerName}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter business email"
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number*</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                  />
                  {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Business Address*</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter business address"
                  rows="3"
                ></textarea>
                {errors.address && <span className="error">{errors.address}</span>}
              </div>
            </div>
            
            <div className="form-section">
              <h3>Documentation</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="uploadedBusinessProof">Upload Business Proof*</label>
                  <input
                    type="file"
                    id="uploadedBusinessProof"
                    name="uploadedBusinessProof"
                    onChange={handleChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  {errors.uploadedBusinessProof && <span className="error">{errors.uploadedBusinessProof}</span>}
                  <small>Upload registration certificate, partnership deed, etc. (max 5MB)</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="uploadedIdProof">Upload ID Proof*</label>
                  <input
                    type="file"
                    id="uploadedIdProof"
                    name="uploadedIdProof"
                    onChange={handleChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  {errors.uploadedIdProof && <span className="error">{errors.uploadedIdProof}</span>}
                  <small>Upload director's/owner's ID proof (max 5MB)</small>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Account Details</h3>
              
              <div className="form-group">
                <label htmlFor="initialDeposit">Initial Deposit Amount (in ₹)*</label>
                <input
                  type="number"
                  id="initialDeposit"
                  name="initialDeposit"
                  value={formData.initialDeposit}
                  onChange={handleChange}
                  placeholder="Enter initial deposit"
                  min="10000"
                />
                {errors.initialDeposit && <span className="error">{errors.initialDeposit}</span>}
                <small>Minimum initial deposit: ₹10,000</small>
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  I accept the <a href="#" className="terms-link">terms and conditions</a> for business accounts
                </label>
                {errors.acceptTerms && <span className="error">{errors.acceptTerms}</span>}
              </div>
            </div>
            
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Processing...' : 'Submit Application'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CurrentAccount; 