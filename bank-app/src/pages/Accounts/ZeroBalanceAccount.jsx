import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../../api';
import './ZeroBalanceAccount.css';

const ZeroBalanceAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    occupation: '',
    annualIncome: '',
    idProofType: '',
    idProofNumber: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    let tempErrors = {};
    
    if (!formData.firstName) tempErrors.firstName = 'First name is required';
    if (!formData.lastName) tempErrors.lastName = 'Last name is required';
    
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
    if (!formData.occupation) tempErrors.occupation = 'Occupation is required';
    
    if (!formData.idProofType) tempErrors.idProofType = 'ID proof type is required';
    if (!formData.idProofNumber) tempErrors.idProofNumber = 'ID proof number is required';
    
    if (!formData.acceptTerms) tempErrors.acceptTerms = 'You must accept the terms and conditions';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        // Prepare account creation data
        const accountData = {
          accountType: 'ZERO_BALANCE',
          accountHolderName: `${formData.firstName} ${formData.lastName}`,
          initialBalance: 0, // Zero balance account
          additionalDetails: {
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            occupation: formData.occupation,
            annualIncome: formData.annualIncome,
            idProofType: formData.idProofType,
            idProofNumber: formData.idProofNumber
          }
        };
        
        // Call API to create account
        const response = await accountService.createAccount(accountData);
        
        setSuccess('Your Zero Balance account application has been submitted successfully! We will review your application and get back to you shortly.');
        
        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          address: '',
          occupation: '',
          annualIncome: '',
          idProofType: '',
          idProofNumber: '',
          acceptTerms: false
        });
        
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
    <div className="zero-balance-container">
      <div className="page-header">
        <h1>Zero Balance Account</h1>
        <p>Open a zero balance account with no minimum balance requirements</p>
      </div>
      
      <div className="account-benefits">
        <h2>Benefits</h2>
        <ul>
          <li>No minimum balance requirement</li>
          <li>Free debit card</li>
          <li>Free internet and mobile banking</li>
          <li>5 free ATM transactions per month</li>
          <li>No maintenance charges</li>
        </ul>
      </div>
      
      {success ? (
        <div className="success-message">{success}</div>
      ) : (
        <div className="application-form">
          <h2>Application Form</h2>
          {errors.submit && <div className="error-message">{errors.submit}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name*</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <span className="error">{errors.firstName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name*</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <span className="error">{errors.lastName}</span>}
              </div>
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
                  placeholder="Enter your email"
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
              <label htmlFor="address">Address*</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                rows="3"
              ></textarea>
              {errors.address && <span className="error">{errors.address}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="occupation">Occupation*</label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Enter your occupation"
                />
                {errors.occupation && <span className="error">{errors.occupation}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="annualIncome">Annual Income (in ₹)</label>
                <input
                  type="number"
                  id="annualIncome"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  placeholder="Enter your annual income"
                  min="0"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="idProofType">ID Proof Type*</label>
                <select
                  id="idProofType"
                  name="idProofType"
                  value={formData.idProofType}
                  onChange={handleChange}
                >
                  <option value="">Select ID Type</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="DRIVING_LICENSE">Driving License</option>
                  <option value="AADHAR_CARD">Aadhar Card</option>
                  <option value="PAN_CARD">PAN Card</option>
                  <option value="VOTER_ID">Voter ID</option>
                </select>
                {errors.idProofType && <span className="error">{errors.idProofType}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="idProofNumber">ID Proof Number*</label>
                <input
                  type="text"
                  id="idProofNumber"
                  name="idProofNumber"
                  value={formData.idProofNumber}
                  onChange={handleChange}
                  placeholder="Enter ID number"
                />
                {errors.idProofNumber && <span className="error">{errors.idProofNumber}</span>}
              </div>
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                I accept the <a href="#" className="terms-link">terms and conditions</a>
              </label>
              {errors.acceptTerms && <span className="error">{errors.acceptTerms}</span>}
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

export default ZeroBalanceAccount; 