import React, { useState } from 'react';
import './AccountStatement.css';

const AccountStatement = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  const [statements] = useState([
    {
      date: '2025-02-10',
      description: 'ATM Withdrawal',
      amount: -500,
      balance: 24500
    },
    {
      date: '2025-02-09',
      description: 'Salary Credit',
      amount: 25000,
      balance: 25000
    },
    {
      date: '2025-02-08',
      description: 'Online Transfer',
      amount: -1000,
      balance: 23000
    }
  ]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="statement-container">
      <h1>Account Statement</h1>
      
      <div className="statement-filters">
        <div className="date-filter">
          <label>
            From:
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </label>
          <label>
            To:
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </label>
        </div>
        <button className="download-btn">Download Statement</button>
      </div>

      <div className="statement-table-container">
        <table className="statement-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {statements.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td className={transaction.amount < 0 ? 'debit' : 'credit'}>
                  {transaction.amount < 0 ? '-₹' : '₹'}{Math.abs(transaction.amount)}
                </td>
                <td>₹{transaction.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountStatement;