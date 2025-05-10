import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../../api';
import './SeniorCitizenAccount.css';

const SeniorCitizenAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    retirementDetails: '',
    idProofType: '',
    idProofNumber: '',
    ageProofType: '',
    ageProofNumber: '',
    initialDeposit: 1000,
    nomineeName: '',
    nomineeRelation: '',
    doorstepBanking: false,
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
    
    if (!formData.dateOfBirth) {
      tempErrors.dateOfBirth = 'Date of birth is required';
    } else {
      // Check if age is at least 60 years
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 60) {
        tempErrors.dateOfBirth = 'You must be at least 60 years old to open a Senior Citizen Account';
      }
    }
    
    if (!formData.idProofType) tempErrors.idProofType = 'ID proof type is required';
    if (!formData.idProofNumber) tempErrors.idProofNumber = 'ID proof number is required';
    if (!formData.ageProofType) tempErrors.ageProofType = 'Age proof type is required';
    if (!formData.ageProofNumber) tempErrors.ageProofNumber = 'Age proof number is required';
    
    if (formData.initialDeposit < 1000) {
      tempErrors.initialDeposit = 'Minimum initial deposit is ₹1,000';
    }
    
    if (!formData.nomineeName) tempErrors.nomineeName = 'Nominee name is required';
    if (!formData.nomineeRelation) tempErrors.nomineeRelation = 'Nominee relation is required';
    
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
          accountType: 'SENIOR_CITIZEN',
          accountHolderName: `${formData.firstName} ${formData.lastName}`,
          initialBalance: formData.initialDeposit,
          additionalDetails: {
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            dateOfBirth: formData.dateOfBirth,
            retirementDetails: formData.retirementDetails,
            idProofType: formData.idProofType,
            idProofNumber: formData.idProofNumber,
            ageProofType: formData.ageProofType,
            ageProofNumber: formData.ageProofNumber,
            nomineeName: formData.nomineeName,
            nomineeRelation: formData.nomineeRelation,
            doorstepBanking: formData.doorstepBanking
          }
        };
        
        // Call API to create account
        const response = await accountService.createAccount(accountData);
        
        setSuccess('Your Senior Citizen Account application has been submitted successfully! We will review your application and get back to you shortly.');
        
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
    <div className="senior-account-container">
      <div className="page-header">
        <h1>Senior Citizen Account</h1>
        <p>Enjoy exclusive benefits and personalized banking services designed for senior citizens</p>
      </div>
      
      <div className="account-benefits">
        <h2>Benefits</h2>
        <ul>
          <li>Higher interest rates than regular savings accounts</li>
          <li>Optional doorstep banking services</li>
          <li>Zero or low minimum balance requirement</li>
          <li>Free health check-up once a year at partner hospitals</li>
          <li>Priority service at branches</li>
          <li>Special discounts on locker services</li>
        </ul>
      </div>
      
      {success ? (
        <div className="success-message">{success}</div>
      ) : (
        <div className="application-form">
          <h2>Senior Citizen Account Application</h2>
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
                  <label htmlFor="retirementDetails">Retirement Details</label>
                  <input
                    type="text"
                    id="retirementDetails"
                    name="retirementDetails"
                    value={formData.retirementDetails}
                    onChange={handleChange}
                    placeholder="Enter retirement details (optional)"
                  />
                </div>
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
                  <label htmlFor="ageProofType">Age Proof Type*</label>
                  <select
                    id="ageProofType"
                    name="ageProofType"
                    value={formData.ageProofType}
                    onChange={handleChange}
                  >
                    <option value="">Select Age Proof Type</option>
                    <option value="BIRTH_CERTIFICATE">Birth Certificate</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="PENSION_BOOK">Pension Book</option>
                    <option value="AADHAR_CARD">Aadhar Card</option>
                  </select>
                  {errors.ageProofType && <span className="error">{errors.ageProofType}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="ageProofNumber">Age Proof Number*</label>
                  <input
                    type="text"
                    id="ageProofNumber"
                    name="ageProofNumber"
                    value={formData.ageProofNumber}
                    onChange={handleChange}
                    placeholder="Enter age proof number"
                  />
                  {errors.ageProofNumber && <span className="error">{errors.ageProofNumber}</span>}
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
                    <option value="CHILD">Child</option>
                    <option value="GRANDCHILD">Grandchild</option>
                    <option value="SIBLING">Sibling</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.nomineeRelation && <span className="error">{errors.nomineeRelation}</span>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Account Preferences</h3>
              
              <div className="form-group">
                <label htmlFor="initialDeposit">Initial Deposit Amount (in ₹)*</label>
                <input
                  type="number"
                  id="initialDeposit"
                  name="initialDeposit"
                  value={formData.initialDeposit}
                  onChange={handleChange}
                  placeholder="Enter initial deposit"
                  min="1000"
                />
                {errors.initialDeposit && <span className="error">{errors.initialDeposit}</span>}
                <small>Minimum initial deposit: ₹1,000</small>
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="doorstepBanking"
                    checked={formData.doorstepBanking}
                    onChange={handleChange}
                  />
                  I want to opt for doorstep banking services
                </label>
                <small>Our representatives will visit your home for basic banking transactions</small>
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

export default SeniorCitizenAccount; 