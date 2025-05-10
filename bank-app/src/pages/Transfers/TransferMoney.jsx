import React from 'react';
import { Link } from 'react-router-dom';
import { FaExchangeAlt, FaBolt, FaGlobe, FaClock, FaHistory } from 'react-icons/fa';
import './TransferMoney.css';

const TransferMoney = () => {
  const transferOptions = [
    {
      title: 'Bank Transfer',
      description: 'Transfer money to accounts within the same bank',
      icon: <FaExchangeAlt className="transfer-icon" />,
      path: '/bank-transfer',
      color: '#4f46e5'
    },
    {
      title: 'Instant Transfer',
      description: 'Quick transfers to other banks via IMPS/NEFT',
      icon: <FaBolt className="transfer-icon" />,
      path: '/instant-transfer',
      color: '#10b981'
    },
    {
      title: 'International Transfer',
      description: 'Send money abroad securely',
      icon: <FaGlobe className="transfer-icon" />,
      path: '/international-transfer',
      color: '#f97316'
    },
    {
      title: 'Scheduled Transfer',
      description: 'Schedule future transfers',
      icon: <FaClock className="transfer-icon" />,
      path: '/scheduled-transfer',
      color: '#8b5cf6'
    },
    {
      title: 'Transfer History',
      description: 'View all your past transfers',
      icon: <FaHistory className="transfer-icon" />,
      path: '/transfer-history',
      color: '#6366f1'
    }
  ];

  return (
    <div className="transfer-money-container">
      <div className="transfer-header">
        <h1>Transfer Money</h1>
        <p>Choose a transfer type to proceed</p>
      </div>
      
      <div className="transfer-options">
        {transferOptions.map((option, index) => (
          <Link 
            to={option.path} 
            className="transfer-card" 
            key={index}
            style={{'--card-color': option.color}}
          >
            <div className="card-icon" style={{ backgroundColor: option.color }}>
              {option.icon}
            </div>
            <h2>{option.title}</h2>
            <p>{option.description}</p>
            <button className="proceed-btn">Proceed</button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TransferMoney;
