import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../../api';
import './SalaryAccount.css';

const SalaryAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    employerName: '',
    employeeId: '',
    designation: '',
    monthlySalary: '',
    joiningDate: '',
    idProofType: '',
    idProofNumber: '',
    employmentProofType: '',
    uploadedIdProof: null,
    uploadedEmployerLetter: null,
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
    if (!formData.employerName) tempErrors.employerName = 'Employer name is required';
    if (!formData.employeeId) tempErrors.employeeId = 'Employee ID is required';
    if (!formData.designation) tempErrors.designation = 'Designation is required';
    if (!formData.monthlySalary) tempErrors.monthlySalary = 'Monthly salary is required';
    if (!formData.joiningDate) tempErrors.joiningDate = 'Joining date is required';
    
    if (!formData.idProofType) tempErrors.idProofType = 'ID proof type is required';
    if (!formData.idProofNumber) tempErrors.idProofNumber = 'ID proof number is required';
    if (!formData.employmentProofType) tempErrors.employmentProofType = 'Employment proof type is required';
    
    if (!formData.uploadedIdProof) tempErrors.uploadedIdProof = 'ID proof document is required';
    if (!formData.uploadedEmployerLetter) tempErrors.uploadedEmployerLetter = 'Employer letter is required';
    
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
          accountType: 'SALARY',
          accountHolderName: `${formData.firstName} ${formData.lastName}`,
          initialBalance: 0,
          additionalDetails: {
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            employerName: formData.employerName,
            employeeId: formData.employeeId,
            designation: formData.designation,
            monthlySalary: formData.monthlySalary,
            joiningDate: formData.joiningDate,
            idProofType: formData.idProofType,
            idProofNumber: formData.idProofNumber,
            employmentProofType: formData.employmentProofType,
            documentsUploaded: true
          }
        };
        
        // Call API to create account
        const response = await accountService.createAccount(accountData);
        
        setSuccess('Your Salary Account application has been submitted successfully! We will verify your employment details and activate your account shortly.');
        
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
    <div className="salary-account-container">
      <div className="page-header">
        <h1>Salary Account</h1>
        <p>Enjoy zero-balance maintenance and exclusive benefits for salaried professionals</p>
      </div>
      
      <div className="account-benefits">
        <h2>Benefits</h2>
        <ul>
          <li>Zero balance maintenance requirement</li>
          <li>Higher interest rates on savings</li>
          <li>Free premium debit card</li>
          <li>Complimentary accident insurance coverage up to ₹5 Lakhs</li>
          <li>Preferential rates on loans and credit cards</li>
          <li>Free unlimited ATM transactions</li>
        </ul>
      </div>
      
      {success ? (
        <div className="success-message">{success}</div>
      ) : (
        <div className="application-form">
          <h2>Salary Account Application</h2>
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
            </div>
            
            <div className="form-section">
              <h3>Employment Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="employerName">Employer/Company Name*</label>
                  <input
                    type="text"
                    id="employerName"
                    name="employerName"
                    value={formData.employerName}
                    onChange={handleChange}
                    placeholder="Enter employer name"
                  />
                  {errors.employerName && <span className="error">{errors.employerName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="employeeId">Employee ID*</label>
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="Enter employee ID"
                  />
                  {errors.employeeId && <span className="error">{errors.employeeId}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="designation">Designation*</label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter your designation"
                  />
                  {errors.designation && <span className="error">{errors.designation}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="monthlySalary">Monthly Salary (in ₹)*</label>
                  <input
                    type="number"
                    id="monthlySalary"
                    name="monthlySalary"
                    value={formData.monthlySalary}
                    onChange={handleChange}
                    placeholder="Enter monthly salary"
                    min="1"
                  />
                  {errors.monthlySalary && <span className="error">{errors.monthlySalary}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="joiningDate">Date of Joining*</label>
                <input
                  type="date"
                  id="joiningDate"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                />
                {errors.joiningDate && <span className="error">{errors.joiningDate}</span>}
              </div>
            </div>
            
            <div className="form-section">
              <h3>Identity & Documentation</h3>
              
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
              
              <div className="form-group">
                <label htmlFor="employmentProofType">Employment Proof Type*</label>
                <select
                  id="employmentProofType"
                  name="employmentProofType"
                  value={formData.employmentProofType}
                  onChange={handleChange}
                >
                  <option value="">Select Proof Type</option>
                  <option value="SALARY_SLIP">Salary Slip</option>
                  <option value="APPOINTMENT_LETTER">Appointment Letter</option>
                  <option value="EMPLOYMENT_CONTRACT">Employment Contract</option>
                  <option value="EMPLOYMENT_ID_CARD">Employment ID Card</option>
                </select>
                {errors.employmentProofType && <span className="error">{errors.employmentProofType}</span>}
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
                  <label htmlFor="uploadedEmployerLetter">Upload Employer Letter/Salary Slip*</label>
                  <input
                    type="file"
                    id="uploadedEmployerLetter"
                    name="uploadedEmployerLetter"
                    onChange={handleChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  {errors.uploadedEmployerLetter && <span className="error">{errors.uploadedEmployerLetter}</span>}
                  <small>Accepted formats: JPG, PNG, PDF (max 5MB)</small>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Terms & Conditions</h3>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  I accept the <a href="#" className="terms-link">terms and conditions</a> and authorize the bank to verify my employment details
                </label>
                {errors.acceptTerms && <span className="error">{errors.acceptTerms}</span>}
              </div>
              
              <div className="salary-account-info">
                <p>Note: Salary accounts require salary credits to be received within 60 days of account opening. Account will be converted to a regular savings account if no salary credit is received.</p>
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

export default SalaryAccount; 