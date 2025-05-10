import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { accountService, transactionService, authService } from '../api';
import './AccountDetails.css';

const AccountDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    fetchAccountDetails();
  }, [id, navigate]);

  useEffect(() => {
    if (account) {
      fetchTransactions();
    }
  }, [account, page]);

  const fetchAccountDetails = async () => {
    try {
      setLoading(true);
      const response = await accountService.getAccountById(id);
      setAccount(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch account details. Please try again later.');
      console.error('Error fetching account details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getAccountTransactions(
        account.accountNumber,
        page,
        pageSize
      );
      setTransactions(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setError('');
    } catch (err) {
      setError('Failed to fetch transactions. Please try again later.');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  const handleTransfer = () => {
    navigate('/transfer');
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading && !account) {
    return <div className="loading-container">Loading account details...</div>;
  }

  return (
    <div className="account-details-container">
      <button className="back-button" onClick={handleBack}>← Back to Home</button>
      
      {error && <div className="error-message">{error}</div>}
      
      {account && (
        <div className="account-info-section">
          <h1>Account Details</h1>
          
          <div className="account-info-card">
            <div className="account-header">
              <div>
                <div className="account-type">{account.accountType}</div>
                <div className="account-number">{account.accountNumber}</div>
              </div>
              <div className="account-status">
                <span className={`status-indicator ${account.status.toLowerCase()}`}></span>
                {account.status}
              </div>
            </div>
            
            <div className="account-balance-section">
              <div className="balance-label">Current Balance</div>
              <div className="balance-amount">₹{account.balance.toFixed(2)}</div>
            </div>
            
            <div className="account-details-row">
              <div className="detail-item">
                <span className="detail-label">Account Name</span>
                <span className="detail-value">{account.accountName || 'Primary Account'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created On</span>
                <span className="detail-value">{formatDate(account.createdAt)}</span>
              </div>
            </div>
            
            <div className="account-actions">
              <button className="action-btn transfer-btn" onClick={handleTransfer}>
                Transfer Funds
              </button>
              <button className="action-btn statement-btn" onClick={() => console.log('Download statement')}>
                Download Statement
              </button>
            </div>
          </div>
          
          <div className="transactions-section">
            <h2>Recent Transactions</h2>
            
            {loading ? (
              <div className="loading">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="no-transactions">
                <p>No transactions found for this account.</p>
              </div>
            ) : (
              <>
                <div className="transactions-table">
                  <div className="table-header">
                    <div className="col date">Date & Time</div>
                    <div className="col description">Description</div>
                    <div className="col type">Type</div>
                    <div className="col amount">Amount</div>
                  </div>
                  
                  <div className="table-body">
                    {transactions.map((transaction) => (
                      <div className="table-row" key={transaction.id}>
                        <div className="col date">{formatDate(transaction.timestamp)}</div>
                        <div className="col description">{transaction.description}</div>
                        <div className="col type">
                          {transaction.type === 'CREDIT' ? 'Credit' : 'Debit'}
                        </div>
                        <div className={`col amount ${transaction.type.toLowerCase()}`}>
                          {transaction.type === 'CREDIT' ? '+' : '-'}
                          ₹{transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pagination">
                  <button 
                    className="pagination-btn" 
                    onClick={handlePrevPage} 
                    disabled={page === 0}
                  >
                    Previous
                  </button>
                  <span className="page-info">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button 
                    className="pagination-btn" 
                    onClick={handleNextPage} 
                    disabled={page >= totalPages - 1}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails; 