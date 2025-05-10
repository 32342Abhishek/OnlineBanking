import React from 'react';
import './PayBills.css';

const PayBills = () => {
  return (
    <div className="pay-bills-container">
      <div className="pay-bills-header">
        <h1>Bill Payments</h1>
        <p>Convenient and quick bill payment services</p>
      </div>
      
      <div className="bill-categories">
        <div className="bill-card">
          <h2>Utility Bills</h2>
          <p>Electricity, Water, Gas</p>
          <button>Pay Now</button>
        </div>
        
        <div className="bill-card">
          <h2>Mobile Recharge</h2>
          <p>Prepaid and Postpaid</p>
          <button>Recharge</button>
        </div>
        
        <div className="bill-card">
          <h2>DTH</h2>
          <p>TV Recharge</p>
          <button>Recharge</button>
        </div>
      </div>
    </div>
  );
};

export default PayBills;