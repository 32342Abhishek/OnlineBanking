import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';
import { APP_CONFIG } from '../config';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Get user data when authenticated status changes
  useEffect(() => {
    if (isAuthenticated) {
      try {
        const userStr = localStorage.getItem(APP_CONFIG.USER_KEY);
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  // Add event listener to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    setActiveDropdown(null);
    if (onLogout) {
      onLogout();
    }
    navigate('/home');
  };

  const handleDropdownToggle = (dropdown, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(prev => prev === dropdown ? null : dropdown);
  };
  
  const handleDropdownLinkClick = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    } else {
      navigate(path);
      setActiveDropdown(null);
    }
  };

  const ServicesDropdown = () => (
    <div className="dropdown-menu services-dropdown" style={{display: activeDropdown === 'services' ? 'block' : 'none'}}>
      <a href="#" onClick={(e) => handleDropdownLinkClick(e, '/transfer-money')}>Transfer Money</a>
      <a href="#" onClick={(e) => handleDropdownLinkClick(e, '/pay-bills')}>Pay Bills</a>
      <a href="#" onClick={(e) => handleDropdownLinkClick(e, '/statements')}>Account Statements</a>
      <a href="#" onClick={(e) => handleDropdownLinkClick(e, '/fixed-deposits')}>Fixed Deposits</a>
      <a href="#" onClick={(e) => handleDropdownLinkClick(e, '/mutual-funds')}>Mutual Funds</a>
      <a href="#" onClick={(e) => handleDropdownLinkClick(e, '/home-loan')}>Home Loan</a>
      <a href="#" onClick={(e) => handleDropdownLinkClick(e, '/personal-loan')}>Personal Loan</a>
    </div>
  );

  const AccountsDropdown = () => (
    <div className="dropdown-menu accounts-dropdown" style={{display: activeDropdown === 'accounts' ? 'block' : 'none'}}>
      <a href="#" onClick={(e) => handleDropdownLinkClick(e, '/open-account')}>Open New Account</a>
      <a href="#" onClick={(e) => handleDropdownLinkClick(e, '/savings-account')}>Savings Account</a>
      <a href="#" onClick={(e) => handleDropdownLinkClick(e, '/current-account')}>Current Account</a>
      <a href="#" onClick={(e) => handleDropdownLinkClick(e, '/zero-balance-account')}>Zero Balance Account</a>
      <a href="#" onClick={(e) => handleDropdownLinkClick(e, '/salary-account')}>Salary Account</a>
    </div>
  );

  return (
    <nav className={`bank-navbar ${scrolled ? 'scrolled' : ''}`} ref={dropdownRef}>
      <div className="navbar-container">
        <div className="logo-container">
          <Link to="/home" className="logo-link">
            <img 
              src="https://static.vecteezy.com/system/resources/thumbnails/013/948/616/small/bank-icon-logo-design-vector.jpg" 
              alt="Bank Logo" 
              className="navbar-logo" 
            />
            <div className="bank-text-container">
              <span className="bank-name">Apna Bank</span>
            </div>
          </Link>
        </div>

        <ul className="nav-menu">
          <li>
            <Link to="/home" className="nav-link">Home</Link>
          </li>
          
          {isAuthenticated && (
            <>
              {user?.role === 'ADMIN' && (
                <li>
                  <Link to="/admin/dashboard" className="nav-link">
                    Admin Dashboard
                  </Link>
                </li>
              )}
              
              <li className="dropdown">
                <span 
                  className="nav-link with-dropdown"
                  onClick={(e) => handleDropdownToggle('accounts', e)}
                >
                  Accounts ▼
                </span>
                <AccountsDropdown />
              </li>
              
              <li className="dropdown">
                <span 
                  className="nav-link with-dropdown"
                  onClick={(e) => handleDropdownToggle('services', e)}
                >
                  Services ▼
                </span>
                <ServicesDropdown />
              </li>

              <li>
                <Link to="/profile" className="nav-link">Profile</Link>
              </li>
            </>
          )}
          
          <li>
            <Link to="/support" className="nav-link">Support</Link>
          </li>
        </ul>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <div className="user-section">
              <span className="user-greeting">Hello, {user?.firstName || 'User'}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;