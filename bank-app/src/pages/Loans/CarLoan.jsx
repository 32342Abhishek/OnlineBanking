import React, { useState } from 'react';
import './CarLoan.css';

const CarLoan = () => {
  const [isEligible, setIsEligible] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [income, setIncome] = useState('');
  const [creditScore, setCreditScore] = useState('');

  const checkEligibility = (e) => {
    e.preventDefault();
    setIsEligible(true);
  };

  const carLoanTypes = [
    {
      title: "New Car Loan",
      interest: "8.90% p.a.",
      features: [
        "Loan up to 90% of car value",
        "Quick approval in 24 hours",
        "Flexible tenure up to 7 years",
        "No hidden charges"
      ]
    },
    {
      title: "Pre-Owned Car",
      interest: "11.25% p.a.",
      features: [
        "Loan up to 80% of car value",
        "Extended tenure options",
        "Simple documentation",
        "Fast processing"
      ]
    },
    {
      title: "Luxury Car Loan",
      interest: "9.50% p.a.",
      features: [
        "Higher loan amounts",
        "Premium customer service",
        "Special interest rates",
        "Dedicated relationship manager"
      ]
    }
  ];

  return (
    <div className="carloan-container">
      <div className="carloan-hero">
        <h1>Drive Your Dream Car Today</h1>
        <p>Get instant car loans with competitive interest rates</p>
      </div>

      <div className="carloan-eligibility">
        <div className="eligibility-form">
          <h2>Check Your Eligibility</h2>
          <form onSubmit={checkEligibility}>
            <div className="form-group">
              <label>Required Loan Amount (₹)</label>
              <input 
                type="number" 
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="form-group">
              <label>Monthly Income (₹)</label>
              <input 
                type="number" 
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter monthly income"
              />
            </div>
            <div className="form-group">
              <label>Credit Score</label>
              <input 
                type="number" 
                value={creditScore}
                onChange={(e) => setCreditScore(e.target.value)}
                placeholder="Enter credit score"
              />
            </div>
            <button type="submit" className="check-btn">Check Eligibility</button>
          </form>
          {isEligible && (
            <div className="eligibility-result">
              <p>Congratulations! You are eligible for a car loan.</p>
              <button className="apply-btn">Apply Now</button>
            </div>
          )}
        </div>
      </div>

      <div className="carloan-types">
        <h2>Our Car Loan Options</h2>
        <div className="loan-cards">
          {carLoanTypes.map((loan, index) => (
            <div key={index} className="loan-card">
              <h3>{loan.title}</h3>
              <div className="interest-rate">{loan.interest}</div>
              <ul className="feature-list">
                {loan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button className="apply-now">Apply Now</button>
            </div>
          ))}
        </div>
      </div>

      <div className="carloan-benefits">
        <h2>Why Choose Our Car Loans?</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <h3>Quick Processing</h3>
            <p>Get your loan approved within 24 hours</p>
          </div>
          <div className="benefit-item">
            <h3>Competitive Rates</h3>
            <p>Enjoy interest rates starting from 8.90% p.a.</p>
          </div>
          <div className="benefit-item">
            <h3>Flexible Tenure</h3>
            <p>Choose loan tenure up to 7 years</p>
          </div>
          <div className="benefit-item">
            <h3>Minimal Documents</h3>
            <p>Simple documentation process</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarLoan;