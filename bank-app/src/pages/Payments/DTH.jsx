import React from 'react';
import './DTH.css';

const DTH = () => {
  return (
    <div className="bill-container">
      <h1>DTH Recharge</h1>
      <p>Recharge your DTH connection quickly and easily.</p>
      <form className="bill-form">
        <label>Customer ID:</label>
        <input type="text" placeholder="Enter customer ID" />
        <label>Operator:</label>
        <select>
          <option>Tata Sky</option>
          <option>Dish TV</option>
          <option>Airtel Digital TV</option>
          <option>Sun Direct</option>
        </select>
        <label>Amount:</label>
        <input type="number" placeholder="Enter recharge amount" />
        <button type="submit">Recharge</button>
      </form>
    </div>
  );
};

export default DTH;