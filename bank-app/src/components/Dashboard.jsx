import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { APP_CONFIG } from '../config';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [activeTab, setActiveTab] = useState('accounts');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [transactionPeriod, setTransactionPeriod] = useState('1month');
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  
  // Format helper functions wrapped with useCallback to maintain reference equality
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  }, []);

  const formatDate = useCallback((date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  }, []);

  const formatTime = useCallback((date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }, []);

  const getUnreadNotificationsCount = useCallback(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // Load user data only once on mount with proper cleanup
  useEffect(() => {
    // If not authenticated, set loading to false and let the render handle the redirect
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    // Flag to prevent state updates if component unmounts
    let isMounted = true;

    const loadUserData = async () => {
      try {
        // Use currentUser from context if available, otherwise try to get from localStorage
        let userData = currentUser;
        
        if (!userData) {
          const userStr = localStorage.getItem(APP_CONFIG.USER_KEY);
          if (!userStr && isMounted) {
            console.error('No user data found in localStorage');
            setLoading(false);
            return;
          }
          
          try {
            userData = JSON.parse(userStr);
          } catch (e) {
            console.error('Error parsing user data:', e);
            if (isMounted) {
              setLoading(false);
            }
            return;
          }
        }
        
        // Mock account data - enhanced with more SBI-like details
        const mockAccounts = [
          {
            id: 'acc1',
            type: 'Savings Account',
            number: 'XXXX7890',
            balance: 12458.32,
            currency: 'INR',
            branch: 'Mumbai Main',
            branchCode: '00456',
            ifscCode: 'APNB0001234',
            accountOpenDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 2), // 2 years ago
            nomineeName: 'Rahul Sharma',
            accountStatus: 'Active',
            lastUpdated: new Date(),
            lastLogin: new Date(Date.now() - 1000 * 60 * 60),
            minimumBalance: 5000,
            interestRate: '3.5%',
            availableLoanLimit: 200000,
            quickActions: ['Transfer', 'Pay Bills', 'Statement', 'Cheque Book']
          },
          {
            id: 'acc2',
            type: 'Current Account',
            number: 'XXXX2345',
            balance: 45980.75,
            currency: 'INR',
            branch: 'Delhi Corporate',
            branchCode: '00328',
            ifscCode: 'APNB0005678',
            accountOpenDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180), // 6 months ago
            nomineeName: 'Priya Sharma',
            accountStatus: 'Active',
            lastUpdated: new Date(),
            lastLogin: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
            minimumBalance: 10000,
            overdraftLimit: 100000,
            quickActions: ['Transfer', 'Pay Bills', 'Statement', 'Overdraft']
          },
          {
            id: 'acc3',
            type: 'Fixed Deposit',
            number: 'FD12345678',
            balance: 100000.00,
            currency: 'INR',
            branch: 'Mumbai Main',
            branchCode: '00456',
            ifscCode: 'APNB0001234',
            accountOpenDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
            interestRate: '6.5%',
            interestEarned: 542.23,
            maturityDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
            maturityAmount: 106500.00,
            prematureWithdrawalAllowed: true,
            lastUpdated: new Date(),
            quickActions: ['View Details', 'Renew', 'Loan Against FD']
          }
        ];
        
        // Mock transaction data
        const mockTransactions = [
          {
            id: 'tx1',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24),
            description: 'Salary Credit',
            amount: 50000,
            type: 'credit',
            merchant: 'XYZ Company',
            accountNumber: 'XXXX7890',
            transactionId: 'TXN123456789',
            category: 'Income',
            balanceAfter: 62458.32
          },
          {
            id: 'tx2',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            description: 'Rent Payment',
            amount: 15000,
            type: 'debit',
            merchant: 'Property Owner',
            accountNumber: 'XXXX7890',
            transactionId: 'TXN123456790',
            category: 'Housing',
            balanceAfter: 12458.32
          },
          {
            id: 'tx3',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            description: 'Grocery Shopping',
            amount: 2560.50,
            type: 'debit',
            merchant: 'SuperMart',
            accountNumber: 'XXXX7890',
            transactionId: 'TXN123456791',
            category: 'Groceries',
            balanceAfter: 27458.32
          },
          {
            id: 'tx4',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
            description: 'Mobile Bill',
            amount: 999,
            type: 'debit',
            merchant: 'Airtel',
            accountNumber: 'XXXX7890',
            transactionId: 'TXN123456792',
            category: 'Utilities',
            balanceAfter: 30018.82
          },
          {
            id: 'tx5',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            description: 'Interest Credit',
            amount: 125.80,
            type: 'credit',
            merchant: 'Apna Bank',
            accountNumber: 'XXXX7890',
            transactionId: 'TXN123456793',
            category: 'Interest',
            balanceAfter: 31017.82
          }
        ];

        // Mock notifications
        const mockNotifications = [
          {
            id: 'notif1',
            title: 'KYC Update Required',
            message: 'Please update your KYC documents by 30th June, 2023.',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            isRead: false,
            importance: 'high',
            actionRequired: true,
            actionLink: '/profile/kyc'
          },
          {
            id: 'notif2',
            title: 'EMI Due',
            message: 'Your home loan EMI of ₹12,500 is due on 5th May, 2023.',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            isRead: true,
            importance: 'medium',
            actionRequired: true,
            actionLink: '/pay-bills'
          },
          {
            id: 'notif3',
            title: 'New Feature Available',
            message: 'Try our new UPI AutoPay feature for recurring payments.',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
            isRead: false,
            importance: 'low',
            actionRequired: false
          }
        ];

        // Mock offers
        const mockOffers = [
          {
            id: 'offer1',
            title: 'Personal Loan',
            description: 'Pre-approved personal loan up to ₹5,00,000 at 10.5% interest rate.',
            validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            actionLink: '/personal-loan',
            actionText: 'Apply Now',
            imageUrl: 'https://via.placeholder.com/80',
            tag: 'Pre-approved'
          },
          {
            id: 'offer2',
            title: 'Credit Card',
            description: 'Get our premium credit card with 2% cashback on all purchases.',
            validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
            actionLink: '/credit-card',
            actionText: 'Apply Now',
            imageUrl: 'https://via.placeholder.com/80',
            tag: 'Limited Time'
          },
          {
            id: 'offer3',
            title: 'Special FD Rate',
            description: 'Enjoy 7.5% interest on fixed deposits for senior citizens.',
            validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
            actionLink: '/fixed-deposits',
            actionText: 'Invest Now',
            imageUrl: 'https://via.placeholder.com/80',
            tag: 'Senior Citizen'
          }
        ];

        // Only update state if component is still mounted
        if (isMounted) {
          setUser(userData);
          setAccounts(mockAccounts);
          setTransactions(mockTransactions);
          setNotifications(mockNotifications);
          setOffers(mockOffers);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Load user data immediately
    loadUserData();

    // Clean up function
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, currentUser]); // Add dependencies to avoid stale data

  // Event handlers with useCallback to maintain reference equality
  const handleActionClick = useCallback((e, path) => {
    e.preventDefault();
    navigate(path);
  }, [navigate]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? {...notif, isRead: true} : notif
      )
    );
  }, []);

  const handleAccountSelect = useCallback((accountNumber) => {
    setSelectedAccount(accountNumber);
    setTransactionFilter('all');
  }, []);

  const handleTransactionPeriodChange = useCallback((period) => {
    setTransactionPeriod(period);
  }, []);

  const handleTransactionFilterChange = useCallback((filter) => {
    setTransactionFilter(filter);
  }, []);

  // If not authenticated, redirect to login
  if (!isAuthenticated && !loading) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Check if user data exists to prevent null reference errors
  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  // Memoize total balance calculation to avoid recalculation on every render
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, {user.firstName || user.name || user.email.split('@')[0]}</h1>
          <p className="dashboard-date">
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="last-login">Last login: {formatDate(new Date(Date.now() - 1000 * 60 * 60 * 24))} at {formatTime(new Date(Date.now() - 1000 * 60 * 60 * 24))}</span>
          </p>
        </div>
        <div className="profile-section">
          <div className="account-summary">
            <div className="total-balance">
              <span className="label">Total Balance</span>
              <span className="amount">{formatCurrency(totalBalance)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'accounts' ? 'active' : ''}`} 
          onClick={(e) => handleTabChange('accounts')}
        >
          <i className="tab-icon">💳</i>
          Accounts
        </button>
        <button 
          className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`} 
          onClick={(e) => handleTabChange('transactions')}
        >
          <i className="tab-icon">📊</i>
          Transactions
        </button>
        <button 
          className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`} 
          onClick={(e) => handleTabChange('notifications')}
        >
          <i className="tab-icon">🔔</i>
          Notifications
          {getUnreadNotificationsCount() > 0 && (
            <span className="notification-badge">{getUnreadNotificationsCount()}</span>
          )}
        </button>
        <button 
          className={`tab-button ${activeTab === 'offers' ? 'active' : ''}`} 
          onClick={(e) => handleTabChange('offers')}
        >
          <i className="tab-icon">🎁</i>
          Offers
        </button>
      </div>

      {activeTab === 'accounts' && (
        <>
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Your Accounts</h2>
              <Link to="/open-account" className="section-link">
                <i className="action-icon">+</i>
                Open New Account
              </Link>
            </div>
            
            <div className="accounts-list">
              {accounts.length > 0 ? (
                accounts.map(account => (
                  <div className="account-card" key={account.id}>
                    <div className="account-header">
                      <div className="account-type-info">
                        <i className={`account-icon ${account.type === 'Savings Account' ? 'savings' : 
                                               account.type === 'Current Account' ? 'current' : 'fd'}`}>
                          {account.type === 'Savings Account' ? '💰' : 
                           account.type === 'Current Account' ? '💼' : '📈'}
                        </i>
                        <div>
                          <h3>{account.type}</h3>
                          <span className="account-number">{account.number}</span>
                        </div>
                      </div>
                      <div className="account-status-badge">
                        <span className={`status-indicator ${account.accountStatus.toLowerCase()}`}></span>
                        {account.accountStatus}
                      </div>
                    </div>
                    
                    <div className="account-info">
                      <div className="account-details">
                        <div className="detail-row">
                          <span className="detail-label">Branch:</span>
                          <span className="detail-value">{account.branch} ({account.branchCode})</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">IFSC:</span>
                          <span className="detail-value">{account.ifscCode}</span>
                        </div>
                        {account.interestRate && (
                          <div className="detail-row">
                            <span className="detail-label">Interest Rate:</span>
                            <span className="detail-value">{account.interestRate}</span>
                          </div>
                        )}
                        {account.maturityDate && (
                          <div className="detail-row">
                            <span className="detail-label">Maturity:</span>
                            <span className="detail-value">{formatDate(account.maturityDate)}</span>
                          </div>
                        )}
                        {account.maturityAmount && (
                          <div className="detail-row">
                            <span className="detail-label">Maturity Amount:</span>
                            <span className="detail-value">{formatCurrency(account.maturityAmount)}</span>
                          </div>
                        )}
                        {account.minimumBalance && (
                          <div className="detail-row">
                            <span className="detail-label">Min Balance:</span>
                            <span className="detail-value">{formatCurrency(account.minimumBalance)}</span>
                          </div>
                        )}
                      </div>
                      <div className="account-balance">
                        <span className="balance-amount">{formatCurrency(account.balance)}</span>
                        <span className="balance-label">Available Balance</span>
                        <span className="last-updated">Updated: {formatTime(account.lastUpdated)}</span>
                      </div>
                    </div>
                    
                    <div className="account-quick-actions">
                      {account.quickActions && account.quickActions.map((action, index) => (
                        <Link 
                          key={index}
                          to={`/${action.toLowerCase().replace(' ', '-')}`} 
                          className="quick-action-btn"
                        >
                          {action}
                        </Link>
                      ))}
                      <Link to={`/account/${account.id}`} className="quick-action-view-details">
                        <i className="action-icon">👁️</i>
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-accounts">
                  <p>You don't have any accounts yet.</p>
                  <Link to="/open-account" className="btn btn-primary">Open Account</Link>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <a href="#" onClick={(e) => handleActionClick(e, '/transfer-money')} className="action-button">
                <span className="action-icon">↗</span>
                <span className="action-text">Transfer Money</span>
              </a>
              <a href="#" onClick={(e) => handleActionClick(e, '/pay-bills')} className="action-button">
                <span className="action-icon">📄</span>
                <span className="action-text">Pay Bills</span>
              </a>
              <a href="#" onClick={(e) => handleActionClick(e, '/mobile-recharge')} className="action-button">
                <span className="action-icon">📱</span>
                <span className="action-text">Mobile Recharge</span>
              </a>
              <a href="#" onClick={(e) => handleActionClick(e, '/statements')} className="action-button">
                <span className="action-icon">📊</span>
                <span className="action-text">View Statements</span>
              </a>
              <a href="#" onClick={(e) => handleActionClick(e, '/fixed-deposits')} className="action-button">
                <span className="action-icon">💰</span>
                <span className="action-text">Fixed Deposits</span>
              </a>
              <a href="#" onClick={(e) => handleActionClick(e, '/personal-loan')} className="action-button">
                <span className="action-icon">💸</span>
                <span className="action-text">Apply for Loan</span>
              </a>
              <a href="#" onClick={(e) => handleActionClick(e, '/mutual-funds')} className="action-button">
                <span className="action-icon">📈</span>
                <span className="action-text">Investments</span>
              </a>
              <a href="#" onClick={(e) => handleActionClick(e, '/profile')} className="action-button">
                <span className="action-icon">👤</span>
                <span className="action-text">My Profile</span>
              </a>
            </div>
          </div>
        </>
      )}

      {activeTab === 'transactions' && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <Link to="/statements" className="section-link">
              <i className="action-icon">📋</i>
              View All Transactions
            </Link>
          </div>

          <div className="transaction-filters">
            <div className="filter-group">
              <label htmlFor="accountSelect">Account:</label>
              <select 
                id="accountSelect" 
                className="account-select"
                value={selectedAccount || 'all'}
                onChange={(e) => handleAccountSelect(e.target.value)}
              >
                <option value="all">All Accounts</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.number}>{acc.type} - {acc.number}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="periodSelect">Period:</label>
              <select 
                id="periodSelect" 
                className="period-select"
                value={transactionPeriod}
                onChange={(e) => handleTransactionPeriodChange(e.target.value)}
              >
                <option value="7days">Last 7 days</option>
                <option value="15days">Last 15 days</option>
                <option value="1month">Last 1 month</option>
                <option value="3months">Last 3 months</option>
                <option value="custom">Custom period</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="typeSelect">Type:</label>
              <select 
                id="typeSelect" 
                className="type-select"
                value={transactionFilter}
                onChange={(e) => handleTransactionFilterChange(e.target.value)}
              >
                <option value="all">All Transactions</option>
                <option value="credit">Credits Only</option>
                <option value="debit">Debits Only</option>
              </select>
            </div>
            
            <button className="filter-button">
              <i className="filter-icon">🔍</i>
              Search
            </button>
            
            <button className="download-button">
              <i className="download-icon">📥</i>
              Download
            </button>
          </div>
          
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Description</th>
                  <th>Account</th>
                  <th>Reference</th>
                  <th>Amount</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions
                    .filter(tx => selectedAccount ? tx.accountNumber === selectedAccount : true)
                    .filter(tx => transactionFilter === 'all' ? true : tx.type === transactionFilter)
                    .map(transaction => (
                      <tr key={transaction.id} className={transaction.type}>
                        <td>
                          <div className="transaction-date">
                            <div className="tx-date">{formatDate(transaction.date)}</div>
                            <div className="tx-time">{formatTime(transaction.date)}</div>
                          </div>
                        </td>
                        <td>
                          <div className="transaction-description">
                            <div className="tx-desc-main">{transaction.description}</div>
                            <div className="tx-category">{transaction.category}</div>
                          </div>
                        </td>
                        <td>{transaction.accountNumber}</td>
                        <td className="tx-ref">{transaction.transactionId}</td>
                        <td className={`amount ${transaction.type}`}>
                          <span className="tx-type-indicator">{transaction.type === 'credit' ? '+ ' : '- '}</span>
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="balance-after">{formatCurrency(transaction.balanceAfter)}</td>
                        <td className="transaction-actions">
                          <button className="tx-action-btn" title="View Details">
                            <i className="tx-action-icon">👁️</i>
                          </button>
                          <button className="tx-action-btn" title="Download Receipt">
                            <i className="tx-action-icon">📄</i>
                          </button>
                          <button className="tx-action-btn" title="Dispute Transaction">
                            <i className="tx-action-icon">⚠️</i>
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No recent transactions</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="transaction-pagination">
            <button className="pagination-btn" disabled>Previous</button>
            <span className="pagination-info">Page 1 of 1</span>
            <button className="pagination-btn" disabled>Next</button>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Notifications</h2>
            <div className="notification-actions">
              <button className="mark-all-read">
                <i className="action-icon">✓</i>
                Mark All as Read
              </button>
              <Link to="/notifications/settings" className="notification-settings">
                <i className="action-icon">⚙️</i>
                Notification Settings
              </Link>
            </div>
          </div>
          
          <div className="notification-filters">
            <button className={`notif-filter-btn active`}>All</button>
            <button className="notif-filter-btn">Unread</button>
            <button className="notif-filter-btn">Alerts</button>
            <button className="notif-filter-btn">Updates</button>
            <button className="notif-filter-btn">Promotions</button>
          </div>
          
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'} importance-${notification.importance}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="notification-priority-indicator"></div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <h3 className="notification-title">
                        {notification.importance === 'high' && <i className="priority-icon">🔴</i>}
                        {notification.importance === 'medium' && <i className="priority-icon">🟠</i>}
                        {notification.importance === 'low' && <i className="priority-icon">🟢</i>}
                        {notification.title}
                      </h3>
                      <span className="notification-date">{formatDate(notification.date)}</span>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    {notification.actionRequired && (
                      <div className="notification-action">
                        <Link to={notification.actionLink} className="notification-action-btn">
                          <i className="action-icon">→</i>
                          Take Action
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="notification-status">
                    {!notification.isRead && <span className="unread-indicator"></span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <div className="empty-state-icon">🔔</div>
                <p>You don't have any notifications</p>
              </div>
            )}
          </div>
          
          <div className="notification-controls">
            <button className="load-more-btn">
              Load More Notifications
            </button>
          </div>
        </div>
      )}

      {activeTab === 'offers' && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Offers & Promotions</h2>
            <Link to="/offers/all" className="section-link">
              <i className="action-icon">🎁</i>
              View All Offers
            </Link>
          </div>
          
          <div className="offers-categories">
            <button className="offer-category-btn active">All Offers</button>
            <button className="offer-category-btn">Loans</button>
            <button className="offer-category-btn">Cards</button>
            <button className="offer-category-btn">Investments</button>
            <button className="offer-category-btn">Insurance</button>
          </div>
          
          <div className="offers-list">
            {offers.length > 0 ? (
              offers.map(offer => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-tag">{offer.tag}</div>
                  <div className="offer-image">
                    <img src={offer.imageUrl} alt={offer.title} />
                  </div>
                  <div className="offer-content">
                    <h3 className="offer-title">{offer.title}</h3>
                    <p className="offer-description">{offer.description}</p>
                    <p className="offer-validity">Valid until: {formatDate(offer.validUntil)}</p>
                  </div>
                  <div className="offer-action">
                    <Link to={offer.actionLink} className="offer-button">{offer.actionText}</Link>
                    <button className="offer-details-btn">View Details</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-offers">
                <div className="empty-state-icon">🎁</div>
                <p>No special offers available currently</p>
                <button className="check-eligibility-btn">Check Eligibility</button>
              </div>
            )}
          </div>
          
          <div className="promotional-banner">
            <div className="promo-content">
              <h3>Upgrade Your Banking Experience</h3>
              <p>Upgrade to our Premium Banking services and enjoy exclusive benefits!</p>
            </div>
            <button className="promo-action-btn">Learn More</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 