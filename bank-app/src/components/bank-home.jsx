import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './bank-home.css';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [loaded, setLoaded] = useState(false);

  // Bank features data
  const features = [
    {
      id: 1,
      icon: "🔒",
      title: "Secure Banking",
      description: "Advanced encryption and multi-factor authentication for your security"
    },
    {
      id: 2,
      icon: "📱",
      title: "Mobile Banking",
      description: "Bank anytime, anywhere with our award-winning mobile app"
    },
    {
      id: 3,
      icon: "💸",
      title: "Zero Fees",
      description: "No hidden charges with our transparent banking policies"
    },
    {
      id: 4,
      icon: "🚀",
      title: "Instant Transfers",
      description: "Send money instantly to anyone, anywhere within seconds"
    }
  ];

  // Trust indicators
  const trustIndicators = [
    { id: 1, label: "RBI Regulated" },
    { id: 2, label: "ISO 27001 Certified" },
    { id: 3, label: "5 Star Banking Award" },
    { id: 4, label: "1M+ Satisfied Customers" },
    { id: 5, label: "24/7 Customer Support" }
  ];

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={`home-container ${loaded ? 'loaded' : ''}`}>
      {/* Minimal Hero Section */}
      <section className="simple-hero">
        <div className="hero-content">
          <span className="welcome-text">Welcome to</span>
          <h1>Apna Bank</h1>
          <p>Simple, Secure Banking Solution</p>
          
          <div className="buttons-container">
            {isAuthenticated ? (
              <Link to="/dashboard" className="main-button">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="main-button">Login</Link>
                <Link to="/register" className="alt-button">Register</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose ApnaBank</h2>
        <div className="features-grid">
          {features.map(feature => (
            <div className="feature-card" key={feature.id}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="trust-section">
        <h2>Trusted & Secure</h2>
        <div className="trust-badges">
          {trustIndicators.map(indicator => (
            <div className="trust-badge" key={indicator.id}>
              <span className="checkmark">✓</span>
              <span className="trust-label">{indicator.label}</span>
            </div>
          ))}
        </div>
        <div className="trust-message">
          <p>Your security is our top priority. We use industry-leading technology to keep your money and data safe.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
