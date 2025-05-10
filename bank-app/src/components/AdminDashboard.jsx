import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { API_CONFIG } from '../config';
import './AdminDashboard.css';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch pending accounts on component mount
  useEffect(() => {
    if (currentUser?.role !== 'ADMIN') {
      navigate('/home');
      return;
    }
    fetchPendingAccounts();
  }, [currentUser, navigate]);

  const fetchPendingAccounts = async () => {
    try {
      const response = await axiosInstance.get(API_CONFIG.ACCOUNTS.PENDING);
      setPendingAccounts(response.data.data);
    } catch (error) {
      console.error('Error fetching pending accounts:', error);
      toast.error('Failed to fetch pending accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (accountId) => {
    try {
      await axiosInstance.post(`${API_CONFIG.ACCOUNTS.BASE}/${accountId}/approve`);
      toast.success('Account approved successfully');
      fetchPendingAccounts(); // Refresh the list
    } catch (error) {
      console.error('Error approving account:', error);
      toast.error('Failed to approve account');
    }
  };

  const handleReject = async (accountId) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await axiosInstance.post(
        `${API_CONFIG.ACCOUNTS.BASE}/${accountId}/reject`,
        { reason: rejectionReason }
      );
      toast.success('Account rejected successfully');
      setRejectionReason('');
      setSelectedAccount(null);
      fetchPendingAccounts(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting account:', error);
      toast.error('Failed to reject account');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage Account Approvals</p>
      </div>

      <div className="pending-accounts-section">
        <h2>Pending Account Requests</h2>
        {pendingAccounts.length === 0 ? (
          <div className="no-pending-accounts">
            <p>No pending account requests</p>
          </div>
        ) : (
          <div className="accounts-list">
            {pendingAccounts.map((account) => (
              <div key={account.id} className="account-card">
                <div className="account-info">
                  <h3>{account.accountHolderName}</h3>
                  <p>Account Number: {account.accountNumber}</p>
                  <p>Account Type: {account.accountType}</p>
                  <p>Initial Balance: ₹{account.balance}</p>
                  <p>Created: {new Date(account.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="account-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(account.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => setSelectedAccount(account)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {selectedAccount && (
        <div className="rejection-modal">
          <div className="modal-content">
            <h3>Reject Account</h3>
            <p>Account Holder: {selectedAccount.accountHolderName}</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection"
              rows="4"
            />
            <div className="modal-actions">
              <button
                className="confirm-reject-btn"
                onClick={() => handleReject(selectedAccount.id)}
              >
                Confirm Rejection
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setSelectedAccount(null);
                  setRejectionReason('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 