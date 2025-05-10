import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../../api';
import './DigitalAccount.css';

const DigitalAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    occupation: '',
    dob: '',
    idProofType: '',
    idProofNumber: '',
    panNumber: '',
    uploadedIdProof: null,
    uploadedSelfie: null,
    initialDeposit: 500,
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
    if (!formData.occupation) tempErrors.occupation = 'Occupation is required';
    if (!formData.dob) tempErrors.dob = 'Date of birth is required';
    
    if (!formData.idProofType) tempErrors.idProofType = 'ID proof type is required';
    if (!formData.idProofNumber) tempErrors.idProofNumber = 'ID proof number is required';
    if (!formData.panNumber) tempErrors.panNumber = 'PAN number is required';
    
    if (!formData.uploadedIdProof) tempErrors.uploadedIdProof = 'ID proof document is required';
    if (!formData.uploadedSelfie) tempErrors.uploadedSelfie = 'A selfie photo is required';
    
    if (formData.initialDeposit < 500) tempErrors.initialDeposit = 'Minimum initial deposit is ₹500';
    
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
        // For demo purposes, we'll just simulate a successful upload
        
        // Prepare account creation data
        const accountData = {
          accountType: 'DIGITAL',
          accountHolderName: `${formData.firstName} ${formData.lastName}`,
          initialBalance: formData.initialDeposit,
          additionalDetails: {
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            occupation: formData.occupation,
            dateOfBirth: formData.dob,
            idProofType: formData.idProofType,
            idProofNumber: formData.idProofNumber,
            panNumber: formData.panNumber,
            // In real app, you would include file references here
            idProofUploaded: true,
            selfieUploaded: true
          }
        };
        
        // Call API to create account
        const response = await accountService.createAccount(accountData);
        
        setSuccess('Your Digital Account application has been submitted successfully! We will review your application and get back to you shortly.');
        
        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          address: '',
          occupation: '',
          dob: '',
          idProofType: '',
          idProofNumber: '',
          panNumber: '',
          uploadedIdProof: null,
          uploadedSelfie: null,
          initialDeposit: 500,
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
    <div className="digital-account-container">
      <div className="page-header">
        <h1>Digital Account</h1>
        <p>Open a fully digital account in minutes with minimal paperwork</p>
      </div>
      
      <div className="account-benefits">
        <h2>Benefits</h2>
        <ul>
          <li>100% online account opening process</li>
          <li>Paperless documentation with e-KYC</li>
          <li>Free virtual debit card instantly</li>
          <li>Zero maintenance charges</li>
          <li>24/7 access via mobile and internet banking</li>
          <li>Open account with just ₹500 initial deposit</li>
        </ul>
      </div>
      
      {success ? (
        <div className="success-message">{success}</div>
      ) : (
        <div className="application-form">
          <h2>Application Form</h2>
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
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dob">Date of Birth*</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                  {errors.dob && <span className="error">{errors.dob}</span>}
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
            </div>
            
            <div className="form-section">
              <h3>Identity Verification</h3>
              
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
              
              <div className="form-group">
                <label htmlFor="panNumber">PAN Number*</label>
                <input
                  type="text"
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="Enter your PAN number"
                />
                {errors.panNumber && <span className="error">{errors.panNumber}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="uploadedIdProof">Upload ID Proof Document*</label>
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
                  <label htmlFor="uploadedSelfie">Upload Selfie*</label>
                  <input
                    type="file"
                    id="uploadedSelfie"
                    name="uploadedSelfie"
                    onChange={handleChange}
                    accept=".jpg,.jpeg,.png"
                  />
                  {errors.uploadedSelfie && <span className="error">{errors.uploadedSelfie}</span>}
                  <small>Accepted formats: JPG, PNG (max 5MB)</small>
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
                  min="500"
                />
                {errors.initialDeposit && <span className="error">{errors.initialDeposit}</span>}
                <small>Minimum initial deposit: ₹500</small>
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  I accept the <a href="#" className="terms-link">terms and conditions</a> and consent to digital verification of my information
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

export default DigitalAccount; 