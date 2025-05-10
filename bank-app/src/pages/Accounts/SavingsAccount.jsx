import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../../api';
import './SavingsAccount.css';

const SavingsAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    occupation: '',
    annualIncome: '',
    idProofType: '',
    idProofNumber: '',
    addressProofType: '',
    addressProofNumber: '',
    initialDeposit: 2000,
    nomineeName: '',
    nomineeRelation: '',
    uploadedIdProof: null,
    uploadedAddressProof: null,
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
    if (!formData.dateOfBirth) tempErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.occupation) tempErrors.occupation = 'Occupation is required';
    
    if (!formData.idProofType) tempErrors.idProofType = 'ID proof type is required';
    if (!formData.idProofNumber) tempErrors.idProofNumber = 'ID proof number is required';
    if (!formData.addressProofType) tempErrors.addressProofType = 'Address proof type is required';
    if (!formData.addressProofNumber) tempErrors.addressProofNumber = 'Address proof number is required';
    
    if (formData.initialDeposit < 2000) {
      tempErrors.initialDeposit = 'Minimum initial deposit is ₹2,000';
    }
    
    if (!formData.nomineeName) tempErrors.nomineeName = 'Nominee name is required';
    if (!formData.nomineeRelation) tempErrors.nomineeRelation = 'Nominee relation is required';
    
    if (!formData.uploadedIdProof) tempErrors.uploadedIdProof = 'ID proof document is required';
    if (!formData.uploadedAddressProof) tempErrors.uploadedAddressProof = 'Address proof document is required';
    
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
          accountType: 'SAVINGS',
          accountHolderName: `${formData.firstName} ${formData.lastName}`,
          initialBalance: formData.initialDeposit,
          additionalDetails: {
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            dateOfBirth: formData.dateOfBirth,
            occupation: formData.occupation,
            annualIncome: formData.annualIncome,
            idProofType: formData.idProofType,
            idProofNumber: formData.idProofNumber,
            addressProofType: formData.addressProofType,
            addressProofNumber: formData.addressProofNumber,
            nomineeName: formData.nomineeName,
            nomineeRelation: formData.nomineeRelation,
            documentsUploaded: true
          }
        };
        
        // Call API to create account
        const response = await accountService.createAccount(accountData);
        
        setSuccess('Your Savings Account application has been submitted successfully! We will process your application and send you the account details shortly.');
        
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
    <div className="savings-account-container">
      <div className="page-header">
        <h1>Savings Account</h1>
        <p>Start saving with our standard interest-bearing account</p>
      </div>
      
      <div className="account-benefits">
        <h2>Benefits</h2>
        <ul>
          <li>Competitive interest rates on your savings</li>
          <li>Free internet and mobile banking</li>
          <li>Free debit card with wide ATM network access</li>
          <li>Monthly account statements</li>
          <li>Easy fund transfers through NEFT, RTGS and IMPS</li>
          <li>Account access through branches across the country</li>
        </ul>
      </div>
      
      {success ? (
        <div className="success-message">{success}</div>
      ) : (
        <div className="application-form">
          <h2>Savings Account Application</h2>
          {errors.submit && <div className="error-message">{errors.submit}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name*</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
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
                    placeholder="Enter last name"
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
                    placeholder="Enter email"
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
                  placeholder="Enter full address"
                  rows="3"
                ></textarea>
                {errors.address && <span className="error">{errors.address}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth*</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                  {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
                </div>
                
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
              </div>
              
              <div className="form-group">
                <label htmlFor="annualIncome">Annual Income (in ₹)</label>
                <input
                  type="number"
                  id="annualIncome"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  placeholder="Enter annual income (optional)"
                  min="0"
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Identity & Address Verification</h3>
              
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
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="addressProofType">Address Proof Type*</label>
                  <select
                    id="addressProofType"
                    name="addressProofType"
                    value={formData.addressProofType}
                    onChange={handleChange}
                  >
                    <option value="">Select Address Proof Type</option>
                    <option value="UTILITY_BILL">Utility Bill</option>
                    <option value="BANK_STATEMENT">Bank Statement</option>
                    <option value="RENTAL_AGREEMENT">Rental Agreement</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                  </select>
                  {errors.addressProofType && <span className="error">{errors.addressProofType}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="addressProofNumber">Address Proof Number/Details*</label>
                  <input
                    type="text"
                    id="addressProofNumber"
                    name="addressProofNumber"
                    value={formData.addressProofNumber}
                    onChange={handleChange}
                    placeholder="Enter proof number or details"
                  />
                  {errors.addressProofNumber && <span className="error">{errors.addressProofNumber}</span>}
                </div>
              </div>
              
              <div className="form-row">
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
                  <small>Accepted formats: JPG, PNG, PDF (max 5MB)</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="uploadedAddressProof">Upload Address Proof*</label>
                  <input
                    type="file"
                    id="uploadedAddressProof"
                    name="uploadedAddressProof"
                    onChange={handleChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  {errors.uploadedAddressProof && <span className="error">{errors.uploadedAddressProof}</span>}
                  <small>Accepted formats: JPG, PNG, PDF (max 5MB)</small>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Nominee Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nomineeName">Nominee Name*</label>
                  <input
                    type="text"
                    id="nomineeName"
                    name="nomineeName"
                    value={formData.nomineeName}
                    onChange={handleChange}
                    placeholder="Enter nominee name"
                  />
                  {errors.nomineeName && <span className="error">{errors.nomineeName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="nomineeRelation">Relationship with Nominee*</label>
                  <select
                    id="nomineeRelation"
                    name="nomineeRelation"
                    value={formData.nomineeRelation}
                    onChange={handleChange}
                  >
                    <option value="">Select Relationship</option>
                    <option value="SPOUSE">Spouse</option>
                    <option value="PARENT">Parent</option>
                    <option value="CHILD">Child</option>
                    <option value="SIBLING">Sibling</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.nomineeRelation && <span className="error">{errors.nomineeRelation}</span>}
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
                  min="2000"
                />
                {errors.initialDeposit && <span className="error">{errors.initialDeposit}</span>}
                <small>Minimum initial deposit: ₹2,000</small>
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

export default SavingsAccount; 