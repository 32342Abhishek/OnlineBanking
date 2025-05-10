import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { Toaster } from 'react-hot-toast';
import "./App.css";
import Navbar from "./components/navbar";
import Home from "./components/bank-home";
import Services from "./components/services";
import Footer from "./components/footer";
import PayBills from "./pages/Payments/PayBills";
import TransferMoney from "./pages/Transfers/TransferMoney";
import Login from "./components/Login";
import Register from "./components/Register";
import Support from "./components/Support";
import OpenNewAccount from "./pages/Accounts/OpenNewAccount";
import AccountStatement from "./pages/Accounts/AccountStatement";
import FixedDeposit from "./pages/Investments/FixedDeposit";
import RecurringDeposit from "./pages/Investments/RecurringDeposit";
import MutualFunds from "./pages/Investments/MutualFunds";
import CarLoan from "./pages/Loans/CarLoan";
import HomeLoan from "./pages/Loans/HomeLoan";
import PersonalLoan from "./pages/Loans/PersonalLoan";
import AdminDashboard from "./components/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

import BankTransfer from "./pages/Transfers/BankTransfer";
import InstantTransfer from "./pages/Transfers/InstantTransfer";
import InternationalTransfer from "./pages/Transfers/InternationalTransfer";
import UtilityBills from "./pages/Payments/UtilityBills";
import MobileRecharge from "./pages/Payments/MobileRecharge";
import DTH from "./pages/Payments/DTH";

// Import our new components
import TransferFunds from "./components/TransferFunds";
import CreateAccount from "./components/CreateAccount";
import AccountDetails from "./components/AccountDetails";
import Profile from "./components/Profile";

// Import account components
import ZeroBalanceAccount from "./pages/Accounts/ZeroBalanceAccount";
import JointAccount from "./pages/Accounts/JointAccount";
import DigitalAccount from "./pages/Accounts/DigitalAccount";
import CurrentAccount from "./pages/Accounts/CurrentAccount";
import SeniorCitizenAccount from "./pages/Accounts/SeniorCitizenAccount";
import SalaryAccount from "./pages/Accounts/SalaryAccount";
import SavingsAccount from "./pages/Accounts/SavingsAccount";

// Import the config constants and auth provider
import { APP_CONFIG } from "./config";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Import the auth test component
import AuthTestComponent from "./components/tests/AuthTestComponent";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Store the attempted URL to redirect back after login
    sessionStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route component - redirects authenticated users away from login/register
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If user is authenticated and tries to access login/register, redirect to home or stored redirect URL
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    const redirectUrl = sessionStorage.getItem('redirectUrl') || '/home';
    sessionStorage.removeItem('redirectUrl'); // Clear stored URL after use
    return <Navigate to={redirectUrl} replace />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
        <div className="content">
          <Routes>
            {/* Public routes */}
            <Route path="/home" element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/support" element={<Support />} />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            {/* Protected routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/transfer-money" element={
              <ProtectedRoute>
                <TransferMoney />
              </ProtectedRoute>
            } />
            <Route path="/pay-bills" element={
              <ProtectedRoute>
                <PayBills />
              </ProtectedRoute>
            } />
            <Route path="/statements" element={
              <ProtectedRoute>
                <AccountStatement />
              </ProtectedRoute>
            } />
            <Route path="/fixed-deposits" element={
              <ProtectedRoute>
                <FixedDeposit />
              </ProtectedRoute>
            } />
            <Route path="/recurring-deposits" element={
              <ProtectedRoute>
                <RecurringDeposit />
              </ProtectedRoute>
            } />
            <Route path="/mutual-funds" element={
              <ProtectedRoute>
                <MutualFunds />
              </ProtectedRoute>
            } />
            <Route path="/car-loan" element={
              <ProtectedRoute>
                <CarLoan />
              </ProtectedRoute>
            } />
            <Route path="/home-loan" element={
              <ProtectedRoute>
                <HomeLoan />
              </ProtectedRoute>
            } />
            <Route path="/personal-loan" element={
              <ProtectedRoute>
                <PersonalLoan />
              </ProtectedRoute>
            } />
            <Route path="/open-account" element={
              <ProtectedRoute>
                <OpenNewAccount />
              </ProtectedRoute>
            } />
            <Route path="/bank-transfer" element={<ProtectedRoute><BankTransfer /></ProtectedRoute>} />
            <Route path="/instant-transfer" element={<ProtectedRoute><InstantTransfer /></ProtectedRoute>} />
            <Route path="/international-transfer" element={<ProtectedRoute><InternationalTransfer /></ProtectedRoute>} />
            <Route path="/utility-bills" element={<ProtectedRoute><UtilityBills /></ProtectedRoute>} />
            <Route path="/mobile-recharge" element={<ProtectedRoute><MobileRecharge /></ProtectedRoute>} />
            <Route path="/dth" element={<ProtectedRoute><DTH /></ProtectedRoute>} />
            <Route path="/zero-balance-account" element={<ProtectedRoute><ZeroBalanceAccount /></ProtectedRoute>} />
            <Route path="/joint-account" element={<ProtectedRoute><JointAccount /></ProtectedRoute>} />
            <Route path="/digital-account" element={<ProtectedRoute><DigitalAccount /></ProtectedRoute>} />
            <Route path="/current-account" element={<ProtectedRoute><CurrentAccount /></ProtectedRoute>} />
            <Route path="/senior-account" element={<ProtectedRoute><SeniorCitizenAccount /></ProtectedRoute>} />
            <Route path="/salary-account" element={<ProtectedRoute><SalaryAccount /></ProtectedRoute>} />
            <Route path="/savings-account" element={<ProtectedRoute><SavingsAccount /></ProtectedRoute>} />
            <Route path="/auth-test" element={<AuthTestComponent />} />
            
            {/* Default routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

// Use React.memo to prevent unnecessary re-renders of the entire app
const App = React.memo(() => {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
});

export default App;
