import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanService } from '../../api';
import './PersonalLoan.css';

const PersonalLoan = () => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [emi, setEmi] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form inputs for loan application
  const [formData, setFormData] = useState({
    accountNumber: '',
    amount: '',
    tenureMonths: '',
    purpose: '',
    monthlyIncome: '',
    employmentType: 'SALARIED',
    existingEmi: '0',
    hasHealthInsurance: false
  });

  // Fetch user accounts on component mount
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
      }
    };

    fetchAccounts();
  }, []);

  const calculateEMI = (e) => {
    e.preventDefault();
    const principal = parseFloat(loanAmount);
    const rateOfInterest = 10.5; // 10.5% p.a.
    const monthlyRate = rateOfInterest / 12 / 100;
    const tenureMonths = parseInt(tenure) * 12;
    
    const emiAmount = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                     (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    setEmi(emiAmount.toFixed(2));
    
    // Update form data with calculated values
    setFormData({
      ...formData,
      amount: principal.toString(),
      tenureMonths: tenureMonths.toString()
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Convert amounts to numeric values
      const loanData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tenureMonths: parseInt(formData.tenureMonths),
        monthlyIncome: parseFloat(formData.monthlyIncome),
        existingEmi: parseFloat(formData.existingEmi) || 0
      };
      
      const response = await loanService.applyForPersonalLoan(loanData);
      setSuccess('Your personal loan application has been submitted successfully!');
      setLoading(false);
      
      // Reset form after successful submission
      setFormData({
        accountNumber: '',
        amount: '',
        tenureMonths: '',
        purpose: '',
        monthlyIncome: '',
        employmentType: 'SALARIED',
        existingEmi: '0',
        hasHealthInsurance: false
      });
      
      // Redirect to loan status page after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to submit loan application. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="loan-container">
      <div className="loan-header">
        <h1>Personal Loan</h1>
        <p>Quick and hassle-free personal loans for all your needs</p>
      </div>

      <div className="loan-content">
        <div className="loan-card">
          <h2>Salaried Individuals</h2>
          <ul className="feature-list">
            <li>Interest rates starting at 10.5% p.a.</li>
            <li>Loan amount up to ₹25 lakhs</li>
            <li>Flexible tenure up to 5 years</li>
            <li>Minimal documentation</li>
            <li>No collateral required</li>
          </ul>
          <button className="loan-cta" onClick={() => document.getElementById('loan-application-form').scrollIntoView({ behavior: 'smooth' })}>Apply Now</button>
        </div>

        <div className="loan-card">
          <h2>Self-Employed</h2>
          <ul className="feature-list">
            <li>Competitive interest rates from 11.5% p.a.</li>
            <li>Loan amount up to ₹20 lakhs</li>
            <li>Flexible repayment options</li>
            <li>Quick processing</li>
            <li>Business-friendly terms</li>
          </ul>
          <button className="loan-cta" onClick={() => document.getElementById('loan-application-form').scrollIntoView({ behavior: 'smooth' })}>Apply Now</button>
        </div>
      </div>

      <div className="loan-calculator">
        <h2>EMI Calculator</h2>
        <form onSubmit={calculateEMI} className="calculator-form">
          <div className="form-group">
            <label>Loan Amount (₹)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Loan Tenure (Years)</label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="loan-cta">Calculate EMI</button>
        </form>
        {emi && (
          <div className="result-section">
            <p>Your Estimated Monthly EMI: ₹{emi}</p>
          </div>
        )}
      </div>

      <div id="loan-application-form" className="loan-application-section">
        <h2>Apply for Personal Loan</h2>
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="loan-application-form">
          <div className="form-group">
            <label>Select Account</label>
            <select 
              name="accountNumber" 
              value={formData.accountNumber} 
              onChange={handleInputChange}
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
            <label>Loan Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="10000"
              max="1000000"
            />
            <small>Min: ₹10,000 | Max: ₹10,00,000</small>
          </div>
          
          <div className="form-group">
            <label>Tenure (Months)</label>
            <input
              type="number"
              name="tenureMonths"
              value={formData.tenureMonths}
              onChange={handleInputChange}
              required
              min="6"
              max="60"
            />
            <small>Min: 6 months | Max: 60 months (5 years)</small>
          </div>
          
          <div className="form-group">
            <label>Purpose</label>
            <select name="purpose" value={formData.purpose} onChange={handleInputChange} required>
              <option value="">Select purpose</option>
              <option value="HOME_RENOVATION">Home Renovation</option>
              <option value="MEDICAL">Medical Expenses</option>
              <option value="EDUCATION">Education</option>
              <option value="WEDDING">Wedding</option>
              <option value="TRAVEL">Travel</option>
              <option value="DEBT_CONSOLIDATION">Debt Consolidation</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Monthly Income (₹)</label>
            <input
              type="number"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleInputChange}
              required
              min="25000"
            />
            <small>Minimum income required: ₹25,000</small>
          </div>
          
          <div className="form-group">
            <label>Employment Type</label>
            <select name="employmentType" value={formData.employmentType} onChange={handleInputChange} required>
              <option value="SALARIED">Salaried</option>
              <option value="SELF_EMPLOYED">Self-Employed</option>
              <option value="BUSINESS">Business Owner</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Existing EMI Obligations (₹)</label>
            <input
              type="number"
              name="existingEmi"
              value={formData.existingEmi}
              onChange={handleInputChange}
              min="0"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="hasHealthInsurance"
                checked={formData.hasHealthInsurance}
                onChange={handleInputChange}
              />
              I have an active health insurance policy
            </label>
          </div>
          
          <button type="submit" className="loan-cta" disabled={loading}>
            {loading ? 'Processing...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalLoan;