import React, { useState } from 'react';
import './RecurringDeposit.css';

const RecurringDeposit = () => {
  const [formData, setFormData] = useState({
    monthlyDeposit: '',
    tenure: '12',
    interestRate: '5.5'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateRD = () => {
    const P = parseFloat(formData.monthlyDeposit);
    const t = parseInt(formData.tenure);
    const r = parseFloat(formData.interestRate) / 100 / 12;
    const maturityAmount = P * ((Math.pow(1 + r, t) - 1) / r);
    const totalDeposit = P * t;
    const interestEarned = maturityAmount - totalDeposit;

    setResult({
      maturityAmount: maturityAmount.toFixed(2),
      totalDeposit: totalDeposit.toFixed(2),
      interestEarned: interestEarned.toFixed(2)
    });
  };

  return (
    <div className="rd-container">
      <div className="rd-header">
        <h1>Recurring Deposit</h1>
        <p>Save regularly and earn guaranteed returns</p>
      </div>

      <div className="rd-content">
        <div className="rd-calculator">
          <h2>RD Calculator</h2>
          <div className="form-group">
            <label>Monthly Deposit Amount (₹)</label>
            <input
              type="number"
              name="monthlyDeposit"
              value={formData.monthlyDeposit}
              onChange={handleChange}
              placeholder="Enter amount"
              min="500"
            />
          </div>

          <div className="form-group">
            <label>Tenure (Months)</label>
            <select 
              name="tenure"
              value={formData.tenure}
              onChange={handleChange}
            >
              <option value="12">12 Months</option>
              <option value="24">24 Months</option>
              <option value="36">36 Months</option>
              <option value="48">48 Months</option>
              <option value="60">60 Months</option>
            </select>
          </div>

          <div className="form-group">
            <label>Interest Rate (% p.a.)</label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              step="0.1"
            />
          </div>

          <button onClick={calculateRD} className="calculate-btn">
            Calculate Returns
          </button>

          {result && (
            <div className="calculation-result">
              <h3>Maturity Details</h3>
              <div className="result-item">
                <span>Total Deposit:</span>
                <span>₹{result.totalDeposit}</span>
              </div>
              <div className="result-item">
                <span>Interest Earned:</span>
                <span>₹{result.interestEarned}</span>
              </div>
              <div className="result-item">
                <span>Maturity Amount:</span>
                <span>₹{result.maturityAmount}</span>
              </div>
            </div>
          )}
        </div>

        <div className="rd-features">
          <h2>Benefits of Recurring Deposit</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Flexible Tenure</h3>
              <p>Choose tenure from 6 months to 10 years</p>
            </div>
            <div className="feature-card">
              <h3>Guaranteed Returns</h3>
              <p>Fixed interest rates throughout the tenure</p>
            </div>
            <div className="feature-card">
              <h3>Low Investment</h3>
              <p>Start with just ₹500 per month</p>
            </div>
            <div className="feature-card">
              <h3>Safe Investment</h3>
              <p>Government guaranteed investment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringDeposit;