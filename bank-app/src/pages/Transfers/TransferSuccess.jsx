import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaHome } from 'react-icons/fa';
import './TransferSuccess.css';

const TransferSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, beneficiary, accountNumber, transferType, currency = '₹' } = location.state || {};

  const handleDownloadReceipt = () => {
    // TODO: Implement receipt download functionality
    console.log('Downloading receipt...');
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
      timeStyle: 'medium'
    }).format(date);
  };

  const transactionId = Math.random().toString(36).substring(2, 15).toUpperCase();
  const currentDate = new Date();

  return (
    <div className="transfer-success-container">
      <div className="success-card">
        <div className="success-header">
          <FaCheckCircle className="success-icon" />
          <h1>Transfer Successful!</h1>
          <p>Your money has been transferred successfully</p>
        </div>

        <div className="transaction-details">
          <div className="detail-row">
            <span className="label">Transaction ID</span>
            <span className="value">{transactionId}</span>
          </div>
          
          <div className="detail-row">
            <span className="label">Date & Time</span>
            <span className="value">{formatDate(currentDate)}</span>
          </div>
          
          <div className="detail-row">
            <span className="label">Transfer Type</span>
            <span className="value">{transferType || 'Bank Transfer'}</span>
          </div>
          
          <div className="detail-row">
            <span className="label">Beneficiary</span>
            <span className="value">{beneficiary}</span>
          </div>
          
          <div className="detail-row">
            <span className="label">Account Number</span>
            <span className="value">{accountNumber}</span>
          </div>
          
          <div className="detail-row amount">
            <span className="label">Amount</span>
            <span className="value">{currency} {parseFloat(amount).toFixed(2)}</span>
          </div>
        </div>

        <div className="success-actions">
          <button 
            className="download-receipt"
            onClick={handleDownloadReceipt}
          >
            <FaDownload /> Download Receipt
          </button>
          
          <button 
            className="go-home"
            onClick={() => navigate('/dashboard')}
          >
            <FaHome /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferSuccess; 