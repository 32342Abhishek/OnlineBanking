import React, { useState } from 'react';
import './MutualFunds.css';

const MutualFunds = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fundCategories = [
    { id: 'all', name: 'All Funds' },
    { id: 'equity', name: 'Equity' },
    { id: 'debt', name: 'Debt' },
    { id: 'hybrid', name: 'Hybrid' },
    { id: 'index', name: 'Index Funds' }
  ];

  const funds = [
    {
      name: 'Growth Fund',
      category: 'equity',
      nav: '45.67',
      oneYearReturn: '15.8',
      threeYearReturn: '12.5',
      riskLevel: 'High',
      minInvestment: '5000'
    },
    {
      name: 'Debt Fund',
      category: 'debt',
      nav: '28.92',
      oneYearReturn: '7.2',
      threeYearReturn: '6.8',
      riskLevel: 'Low',
      minInvestment: '10000'
    },
    {
      name: 'Balanced Fund',
      category: 'hybrid',
      nav: '35.45',
      oneYearReturn: '11.5',
      threeYearReturn: '9.7',
      riskLevel: 'Moderate',
      minInvestment: '5000'
    },
    {
      name: 'Index Fund',
      category: 'index',
      nav: '125.30',
      oneYearReturn: '13.2',
      threeYearReturn: '11.9',
      riskLevel: 'Moderate',
      minInvestment: '1000'
    }
  ];

  const filteredFunds = selectedCategory === 'all' 
    ? funds 
    : funds.filter(fund => fund.category === selectedCategory);

  return (
    <div className="mf-container">
      <div className="mf-header">
        <h1>Mutual Funds Investment</h1>
        <p>Start your wealth creation journey with our mutual funds</p>
      </div>

      <div className="category-tabs">
        {fundCategories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="funds-grid">
        {filteredFunds.map((fund, index) => (
          <div key={index} className="fund-card">
            <div className="fund-header">
              <h3>{fund.name}</h3>
              <span className={`risk-badge ${fund.riskLevel.toLowerCase()}`}>
                {fund.riskLevel} Risk
              </span>
            </div>

            <div className="fund-details">
              <div className="detail-row">
                <span>NAV:</span>
                <span>₹{fund.nav}</span>
              </div>
              <div className="detail-row">
                <span>1Y Returns:</span>
                <span className={fund.oneYearReturn > 0 ? 'positive' : 'negative'}>
                  {fund.oneYearReturn}%
                </span>
              </div>
              <div className="detail-row">
                <span>3Y Returns:</span>
                <span className={fund.threeYearReturn > 0 ? 'positive' : 'negative'}>
                  {fund.threeYearReturn}%
                </span>
              </div>
              <div className="detail-row">
                <span>Min Investment:</span>
                <span>₹{fund.minInvestment}</span>
              </div>
            </div>

            <div className="fund-actions">
              <button className="invest-btn">Invest Now</button>
              <button className="details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MutualFunds;