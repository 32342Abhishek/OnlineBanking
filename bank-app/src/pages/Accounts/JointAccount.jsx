import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../../api';
import './JointAccount.css';

const JointAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Primary account holder
    primaryFirstName: '',
    primaryLastName: '',
    primaryEmail: '',
    primaryPhoneNumber: '',
    primaryAddress: '',
    primaryOccupation: '',
    primaryAnnualIncome: '',
    primaryIdProofType: '',
    primaryIdProofNumber: '',
    
    // Secondary account holder
    secondaryFirstName: '',
    secondaryLastName: '',
    secondaryEmail: '',
    secondaryPhoneNumber: '',
    secondaryAddress: '',
    secondaryOccupation: '',
    secondaryAnnualIncome: '',
    secondaryIdProofType: '',
    secondaryIdProofNumber: '',
    
    // Relationship with secondary account holder
    relationship: '',
    
    // Operation mode
    operationMode: 'EITHER_OR_SURVIVOR',
    
    // Initial deposit
    initialDeposit: 1000,
    
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep1 = () => {
    let tempErrors = {};
    
    if (!formData.primaryFirstName) tempErrors.primaryFirstName = 'First name is required';
    if (!formData.primaryLastName) tempErrors.primaryLastName = 'Last name is required';
    
    if (!formData.primaryEmail) {
      tempErrors.primaryEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.primaryEmail)) {
      tempErrors.primaryEmail = 'Email is invalid';
    }
    
    if (!formData.primaryPhoneNumber) {
      tempErrors.primaryPhoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.primaryPhoneNumber)) {
      tempErrors.primaryPhoneNumber = 'Phone number must be 10 digits';
    }
    
    if (!formData.primaryAddress) tempErrors.primaryAddress = 'Address is required';
    if (!formData.primaryOccupation) tempErrors.primaryOccupation = 'Occupation is required';
    if (!formData.primaryIdProofType) tempErrors.primaryIdProofType = 'ID proof type is required';
    if (!formData.primaryIdProofNumber) tempErrors.primaryIdProofNumber = 'ID proof number is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep2 = () => {
    let tempErrors = {};
    
    if (!formData.secondaryFirstName) tempErrors.secondaryFirstName = 'First name is required';
    if (!formData.secondaryLastName) tempErrors.secondaryLastName = 'Last name is required';
    
    if (!formData.secondaryEmail) {
      tempErrors.secondaryEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.secondaryEmail)) {
      tempErrors.secondaryEmail = 'Email is invalid';
    }
    
    if (!formData.secondaryPhoneNumber) {
      tempErrors.secondaryPhoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.secondaryPhoneNumber)) {
      tempErrors.secondaryPhoneNumber = 'Phone number must be 10 digits';
    }
    
    if (!formData.secondaryAddress) tempErrors.secondaryAddress = 'Address is required';
    if (!formData.secondaryIdProofType) tempErrors.secondaryIdProofType = 'ID proof type is required';
    if (!formData.secondaryIdProofNumber) tempErrors.secondaryIdProofNumber = 'ID proof number is required';
    if (!formData.relationship) tempErrors.relationship = 'Relationship is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep3 = () => {
    let tempErrors = {};
    
    if (!formData.operationMode) tempErrors.operationMode = 'Operation mode is required';
    if (!formData.initialDeposit || formData.initialDeposit < 1000) {
      tempErrors.initialDeposit = 'Minimum initial deposit is ₹1,000';
    }
    if (!formData.acceptTerms) tempErrors.acceptTerms = 'You must accept the terms and conditions';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep3()) {
      setLoading(true);
      
      try {
        // Prepare account creation data
        const accountData = {
          accountType: 'JOINT',
          accountHolderName: `${formData.primaryFirstName} ${formData.primaryLastName} & ${formData.secondaryFirstName} ${formData.secondaryLastName}`,
          initialBalance: formData.initialDeposit,
          additionalDetails: {
            primaryHolder: {
              firstName: formData.primaryFirstName,
              lastName: formData.primaryLastName,
              email: formData.primaryEmail,
              phoneNumber: formData.primaryPhoneNumber,
              address: formData.primaryAddress,
              occupation: formData.primaryOccupation,
              annualIncome: formData.primaryAnnualIncome,
              idProofType: formData.primaryIdProofType,
              idProofNumber: formData.primaryIdProofNumber
            },
            secondaryHolder: {
              firstName: formData.secondaryFirstName,
              lastName: formData.secondaryLastName,
              email: formData.secondaryEmail,
              phoneNumber: formData.secondaryPhoneNumber,
              address: formData.secondaryAddress,
              occupation: formData.secondaryOccupation,
              annualIncome: formData.secondaryAnnualIncome,
              idProofType: formData.secondaryIdProofType,
              idProofNumber: formData.secondaryIdProofNumber
            },
            relationship: formData.relationship,
            operationMode: formData.operationMode
          }
        };
        
        // Call API to create account
        const response = await accountService.createAccount(accountData);
        
        setSuccess('Your Joint Account application has been submitted successfully! We will review your application and get back to you shortly.');
        
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
    <div className="joint-account-container">
      <div className="page-header">
        <h1>Joint Account</h1>
        <p>Open a joint account with your family member or business partner</p>
      </div>
      
      <div className="account-benefits">
        <h2>Benefits</h2>
        <ul>
          <li>Shared access to funds between two people</li>
          <li>Flexible operation modes (Either or Survivor, Jointly, Former or Survivor)</li>
          <li>Complementary debit cards for both holders</li>
          <li>Free internet and mobile banking</li>
          <li>Lower minimum balance requirement compared to business accounts</li>
        </ul>
      </div>
      
      {success ? (
        <div className="success-message">{success}</div>
      ) : (
        <div className="application-form">
          <h2>Application Form</h2>
          {errors.submit && <div className="error-message">{errors.submit}</div>}
          
          <div className="step-progress">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>Primary Holder</div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>Secondary Holder</div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>Account Details</div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="step-content">
                <h3>Primary Account Holder Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="primaryFirstName">First Name*</label>
                    <input
                      type="text"
                      id="primaryFirstName"
                      name="primaryFirstName"
                      value={formData.primaryFirstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                    {errors.primaryFirstName && <span className="error">{errors.primaryFirstName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="primaryLastName">Last Name*</label>
                    <input
                      type="text"
                      id="primaryLastName"
                      name="primaryLastName"
                      value={formData.primaryLastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                    {errors.primaryLastName && <span className="error">{errors.primaryLastName}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="primaryEmail">Email Address*</label>
                    <input
                      type="email"
                      id="primaryEmail"
                      name="primaryEmail"
                      value={formData.primaryEmail}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                    {errors.primaryEmail && <span className="error">{errors.primaryEmail}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="primaryPhoneNumber">Phone Number*</label>
                    <input
                      type="tel"
                      id="primaryPhoneNumber"
                      name="primaryPhoneNumber"
                      value={formData.primaryPhoneNumber}
                      onChange={handleChange}
                      placeholder="Enter 10-digit phone number"
                    />
                    {errors.primaryPhoneNumber && <span className="error">{errors.primaryPhoneNumber}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="primaryAddress">Address*</label>
                  <textarea
                    id="primaryAddress"
                    name="primaryAddress"
                    value={formData.primaryAddress}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    rows="3"
                  ></textarea>
                  {errors.primaryAddress && <span className="error">{errors.primaryAddress}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="primaryOccupation">Occupation*</label>
                    <input
                      type="text"
                      id="primaryOccupation"
                      name="primaryOccupation"
                      value={formData.primaryOccupation}
                      onChange={handleChange}
                      placeholder="Enter occupation"
                    />
                    {errors.primaryOccupation && <span className="error">{errors.primaryOccupation}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="primaryAnnualIncome">Annual Income (in ₹)</label>
                    <input
                      type="number"
                      id="primaryAnnualIncome"
                      name="primaryAnnualIncome"
                      value={formData.primaryAnnualIncome}
                      onChange={handleChange}
                      placeholder="Enter annual income"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="primaryIdProofType">ID Proof Type*</label>
                    <select
                      id="primaryIdProofType"
                      name="primaryIdProofType"
                      value={formData.primaryIdProofType}
                      onChange={handleChange}
                    >
                      <option value="">Select ID Type</option>
                      <option value="PASSPORT">Passport</option>
                      <option value="DRIVING_LICENSE">Driving License</option>
                      <option value="AADHAR_CARD">Aadhar Card</option>
                      <option value="PAN_CARD">PAN Card</option>
                      <option value="VOTER_ID">Voter ID</option>
                    </select>
                    {errors.primaryIdProofType && <span className="error">{errors.primaryIdProofType}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="primaryIdProofNumber">ID Proof Number*</label>
                    <input
                      type="text"
                      id="primaryIdProofNumber"
                      name="primaryIdProofNumber"
                      value={formData.primaryIdProofNumber}
                      onChange={handleChange}
                      placeholder="Enter ID number"
                    />
                    {errors.primaryIdProofNumber && <span className="error">{errors.primaryIdProofNumber}</span>}
                  </div>
                </div>
                
                <div className="form-buttons">
                  <button type="button" className="next-button" onClick={nextStep}>
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="step-content">
                <h3>Secondary Account Holder Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="secondaryFirstName">First Name*</label>
                    <input
                      type="text"
                      id="secondaryFirstName"
                      name="secondaryFirstName"
                      value={formData.secondaryFirstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                    {errors.secondaryFirstName && <span className="error">{errors.secondaryFirstName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="secondaryLastName">Last Name*</label>
                    <input
                      type="text"
                      id="secondaryLastName"
                      name="secondaryLastName"
                      value={formData.secondaryLastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                    {errors.secondaryLastName && <span className="error">{errors.secondaryLastName}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="secondaryEmail">Email Address*</label>
                    <input
                      type="email"
                      id="secondaryEmail"
                      name="secondaryEmail"
                      value={formData.secondaryEmail}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                    {errors.secondaryEmail && <span className="error">{errors.secondaryEmail}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="secondaryPhoneNumber">Phone Number*</label>
                    <input
                      type="tel"
                      id="secondaryPhoneNumber"
                      name="secondaryPhoneNumber"
                      value={formData.secondaryPhoneNumber}
                      onChange={handleChange}
                      placeholder="Enter 10-digit phone number"
                    />
                    {errors.secondaryPhoneNumber && <span className="error">{errors.secondaryPhoneNumber}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="secondaryAddress">Address*</label>
                  <textarea
                    id="secondaryAddress"
                    name="secondaryAddress"
                    value={formData.secondaryAddress}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    rows="3"
                  ></textarea>
                  {errors.secondaryAddress && <span className="error">{errors.secondaryAddress}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="secondaryOccupation">Occupation</label>
                    <input
                      type="text"
                      id="secondaryOccupation"
                      name="secondaryOccupation"
                      value={formData.secondaryOccupation}
                      onChange={handleChange}
                      placeholder="Enter occupation"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="secondaryAnnualIncome">Annual Income (in ₹)</label>
                    <input
                      type="number"
                      id="secondaryAnnualIncome"
                      name="secondaryAnnualIncome"
                      value={formData.secondaryAnnualIncome}
                      onChange={handleChange}
                      placeholder="Enter annual income"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="secondaryIdProofType">ID Proof Type*</label>
                    <select
                      id="secondaryIdProofType"
                      name="secondaryIdProofType"
                      value={formData.secondaryIdProofType}
                      onChange={handleChange}
                    >
                      <option value="">Select ID Type</option>
                      <option value="PASSPORT">Passport</option>
                      <option value="DRIVING_LICENSE">Driving License</option>
                      <option value="AADHAR_CARD">Aadhar Card</option>
                      <option value="PAN_CARD">PAN Card</option>
                      <option value="VOTER_ID">Voter ID</option>
                    </select>
                    {errors.secondaryIdProofType && <span className="error">{errors.secondaryIdProofType}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="secondaryIdProofNumber">ID Proof Number*</label>
                    <input
                      type="text"
                      id="secondaryIdProofNumber"
                      name="secondaryIdProofNumber"
                      value={formData.secondaryIdProofNumber}
                      onChange={handleChange}
                      placeholder="Enter ID number"
                    />
                    {errors.secondaryIdProofNumber && <span className="error">{errors.secondaryIdProofNumber}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="relationship">Relationship with Primary Holder*</label>
                  <select
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                  >
                    <option value="">Select Relationship</option>
                    <option value="SPOUSE">Spouse</option>
                    <option value="PARENT">Parent</option>
                    <option value="CHILD">Child</option>
                    <option value="SIBLING">Sibling</option>
                    <option value="BUSINESS_PARTNER">Business Partner</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.relationship && <span className="error">{errors.relationship}</span>}
                </div>
                
                <div className="form-buttons">
                  <button type="button" className="back-button" onClick={prevStep}>
                    Back
                  </button>
                  <button type="button" className="next-button" onClick={nextStep}>
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="step-content">
                <h3>Account Details</h3>
                
                <div className="form-group">
                  <label htmlFor="operationMode">Operation Mode*</label>
                  <select
                    id="operationMode"
                    name="operationMode"
                    value={formData.operationMode}
                    onChange={handleChange}
                  >
                    <option value="EITHER_OR_SURVIVOR">Either or Survivor</option>
                    <option value="JOINTLY">Jointly</option>
                    <option value="FORMER_OR_SURVIVOR">Former or Survivor</option>
                  </select>
                  {errors.operationMode && <span className="error">{errors.operationMode}</span>}
                  
                  <div className="operation-mode-help">
                    <p><strong>Either or Survivor:</strong> Either account holder can operate the account independently.</p>
                    <p><strong>Jointly:</strong> Both account holders must authorize all transactions.</p>
                    <p><strong>Former or Survivor:</strong> Primary holder can operate independently, secondary holder can operate only after the primary holder.</p>
                  </div>
                </div>
                
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
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                    />
                    I accept the <a href="#" className="terms-link">terms and conditions</a>
                  </label>
                  {errors.acceptTerms && <span className="error">{errors.acceptTerms}</span>}
                </div>
                
                <div className="form-buttons">
                  <button type="button" className="back-button" onClick={prevStep}>
                    Back
                  </button>
                  <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Processing...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default JointAccount; 