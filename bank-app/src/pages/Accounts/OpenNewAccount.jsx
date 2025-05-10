import React from 'react';
import { Link } from 'react-router-dom';
import './OpenNewAccount.css';

const OpenNewAccount = () => {
  return (
    <div className="open-account-container">
      <div className="page-header">
        <h1>Open a New Account</h1>
        <p>Choose from our range of accounts tailored to your needs</p>
      </div>
      
      <div className="account-types-container">
        <div className="account-type-card">
          <div className="account-icon">🌱</div>
          <h3>Zero Balance Account</h3>
          <ul className="account-features">
            <li>No minimum balance requirement</li>
            <li>Free debit card</li>
            <li>Free internet and mobile banking</li>
            <li>5 free ATM transactions per month</li>
          </ul>
          <p className="account-description">
            Perfect for students and individuals looking for a basic account without minimum balance requirements.
          </p>
          <Link to="/zero-balance-account" className="open-account-btn">Open Account</Link>
        </div>
        
        <div className="account-type-card">
          <div className="account-icon">👨‍👩‍👧</div>
          <h3>Joint Account</h3>
          <ul className="account-features">
            <li>Shared access to funds</li>
            <li>Multiple operation modes</li>
            <li>Complementary debit cards</li>
            <li>Lower minimum balance requirements</li>
          </ul>
          <p className="account-description">
            Ideal for families, couples, and business partners who want to share financial responsibilities.
          </p>
          <Link to="/joint-account" className="open-account-btn">Open Account</Link>
        </div>
        
        <div className="account-type-card">
          <div className="account-icon">📱</div>
          <h3>Digital Account</h3>
          <ul className="account-features">
            <li>100% online account opening</li>
            <li>Paperless documentation</li>
            <li>Free virtual debit card</li>
            <li>Zero maintenance charges</li>
          </ul>
          <p className="account-description">
            A modern account for digital natives that can be opened instantly with minimal paperwork.
          </p>
          <Link to="/digital-account" className="open-account-btn">Open Account</Link>
        </div>
        
        <div className="account-type-card">
          <div className="account-icon">💼</div>
          <h3>Current Account</h3>
          <ul className="account-features">
            <li>Higher transaction limits</li>
            <li>Business banking facilities</li>
            <li>Overdraft facilities</li>
            <li>Multiple signatory options</li>
          </ul>
          <p className="account-description">
            Designed for businesses and professionals with high transaction volumes and cash flow needs.
          </p>
          <Link to="/current-account" className="open-account-btn">Open Account</Link>
        </div>
        
        <div className="account-type-card">
          <div className="account-icon">💵</div>
          <h3>Savings Account</h3>
          <ul className="account-features">
            <li>Competitive interest rates</li>
            <li>Free internet and mobile banking</li>
            <li>Free debit card</li>
            <li>Monthly account statements</li>
          </ul>
          <p className="account-description">
            A standard interest-bearing account perfect for your everyday banking needs.
          </p>
          <Link to="/savings-account" className="open-account-btn">Open Account</Link>
        </div>
        
        <div className="account-type-card">
          <div className="account-icon">💰</div>
          <h3>Salary Account</h3>
          <ul className="account-features">
            <li>Zero balance maintenance</li>
            <li>Higher interest rates</li>
            <li>Free insurance coverage</li>
            <li>Preferential loan rates</li>
          </ul>
          <p className="account-description">
            Special benefits for salaried individuals, designed to maximize your monthly income.
          </p>
          <Link to="/salary-account" className="open-account-btn">Open Account</Link>
        </div>
        
        <div className="account-type-card">
          <div className="account-icon">👴</div>
          <h3>Senior Citizen Account</h3>
          <ul className="account-features">
            <li>Higher interest rates</li>
            <li>Doorstep banking</li>
            <li>Lower minimum balance</li>
            <li>Free health benefits</li>
          </ul>
          <p className="account-description">
            Specially designed for senior citizens with additional benefits and easier banking.
          </p>
          <Link to="/senior-account" className="open-account-btn">Open Account</Link>
        </div>
      </div>
      
      <div className="account-comparison">
        <h2>Account Comparison</h2>
        <div className="comparison-table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Zero Balance</th>
                <th>Joint Account</th>
                <th>Digital Account</th>
                <th>Current Account</th>
                <th>Salary Account</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Minimum Balance</td>
                <td>₹0</td>
                <td>₹1,000</td>
                <td>₹500</td>
                <td>₹10,000</td>
                <td>₹0</td>
              </tr>
              <tr>
                <td>Debit Card</td>
                <td>Free</td>
                <td>Free (2 cards)</td>
                <td>Free (Virtual)</td>
                <td>Premium</td>
                <td>Premium</td>
              </tr>
              <tr>
                <td>Internet Banking</td>
                <td>Yes</td>
                <td>Yes</td>
                <td>Yes</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Mobile Banking</td>
                <td>Yes</td>
                <td>Yes</td>
                <td>Yes</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Interest Rate</td>
                <td>3.5%</td>
                <td>3.5%</td>
                <td>4.0%</td>
                <td>0.5%</td>
                <td>4.5%</td>
              </tr>
              <tr>
                <td>Free Transactions</td>
                <td>5/month</td>
                <td>10/month</td>
                <td>Unlimited</td>
                <td>25/month</td>
                <td>Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="account-faq">
        <h2>Frequently Asked Questions</h2>
        
        <div className="faq-item">
          <h3>What documents do I need to open an account?</h3>
          <p>To open a bank account, you typically need proof of identity (such as Aadhar card, PAN card, passport), proof of address (utility bill, rental agreement), and recent passport-sized photographs.</p>
        </div>
        
        <div className="faq-item">
          <h3>How long does it take to open an account?</h3>
          <p>Our digital accounts can be opened instantly. For other account types, the process typically takes 1-3 business days after submission of all required documents.</p>
        </div>
        
        <div className="faq-item">
          <h3>Can I open an account if I'm not an Indian resident?</h3>
          <p>Yes, non-resident Indians (NRIs) can open NRE (Non-Resident External) or NRO (Non-Resident Ordinary) accounts. Please visit our NRI Banking section for more details.</p>
        </div>
        
        <div className="faq-item">
          <h3>What are the charges for maintaining an account?</h3>
          <p>Charges vary depending on the account type. Zero Balance and Salary accounts have no maintenance charges. Other accounts may have charges if the minimum balance is not maintained.</p>
        </div>
        
        <div className="faq-item">
          <h3>Can I convert my existing account to another type?</h3>
          <p>Yes, existing customers can convert their accounts to a different type by submitting a request at their branch or through net banking, subject to eligibility criteria.</p>
        </div>
      </div>
      
      <div className="account-assistance">
        <h2>Need Help Choosing?</h2>
        <p>Our banking experts are available to help you select the account that best suits your needs.</p>
        <div className="assistance-options">
          <a href="/support" className="assistance-btn">Chat with Us</a>
          <a href="tel:1800123456" className="assistance-btn">Call Us</a>
          <a href="/branch-locator" className="assistance-btn">Visit Branch</a>
        </div>
      </div>
    </div>
  );
};

export default OpenNewAccount;