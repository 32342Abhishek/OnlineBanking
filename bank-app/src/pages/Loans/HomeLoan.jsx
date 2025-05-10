import React, { useState } from 'react';
import './HomeLoan.css';

const HomeLoan = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [emi, setEmi] = useState(null);

  const calculateEMI = (e) => {
    e.preventDefault();
    const principal = parseFloat(loanAmount);
    const rateOfInterest = 7.5; // 7.5% p.a.
    const monthlyRate = rateOfInterest / 12 / 100;
    const tenureMonths = parseInt(tenure) * 12;
    
    const emiAmount = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                     (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    setEmi(emiAmount.toFixed(2));
  };

  return (
    <div className="loan-container">
      <div className="loan-header">
        <h1>Home Loan</h1>
        <p>Make your dream home a reality with our affordable home loans</p>
      </div>

      <div className="loan-content">
        <div className="loan-card">
          <h2>New Home Loan</h2>
          <ul className="feature-list">
            <li>Interest rates starting at 7.5% p.a.</li>
            <li>Loan amount up to ₹5 crores</li>
            <li>Tenure up to 30 years</li>
            <li>Quick approval process</li>
            <li>Zero prepayment charges</li>
          </ul>
          <button className="loan-cta">Apply Now</button>
        </div>

        <div className="loan-card">
          <h2>Balance Transfer</h2>
          <ul className="feature-list">
            <li>Lower interest rates than your existing loan</li>
            <li>Additional top-up loan available</li>
            <li>Flexible tenure options</li>
            <li>Minimal documentation</li>
            <li>Dedicated relationship manager</li>
          </ul>
          <button className="loan-cta">Apply Now</button>
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
    </div>
  );
};

export default HomeLoan;