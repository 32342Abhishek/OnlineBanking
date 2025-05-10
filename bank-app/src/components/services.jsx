import React from 'react';
import { Link } from 'react-router-dom';
import './services.css';
import { useAuth } from '../contexts/AuthContext';

const Services = () => {
  const { isAuthenticated } = useAuth();
  
  // Services data
  const services = [
    {
      id: 1,
      title: "Personal Banking",
      description: "Manage your day-to-day finances with our comprehensive personal banking solutions including savings, current accounts, and more.",
      icon: "👤",
      link: isAuthenticated ? "/dashboard" : "/login",
      linkText: "Explore Personal Banking"
    },
    {
      id: 2,
      title: "Digital Banking",
      description: "Experience the convenience of banking anytime, anywhere with our secure and user-friendly online and mobile banking platforms.",
      icon: "📱",
      link: isAuthenticated ? "/dashboard" : "/login",
      linkText: "Try Digital Banking"
    },
    {
      id: 3,
      title: "Loans & Mortgages",
      description: "Realize your dreams with our flexible loan options including home loans, personal loans, and car loans at competitive interest rates.",
      icon: "🏠",
      link: "/home-loan",
      linkText: "View Loan Options"
    },
    {
      id: 4,
      title: "Investment Solutions",
      description: "Grow your wealth with our range of investment products including fixed deposits, mutual funds, and other wealth management services.",
      icon: "📈",
      link: "/mutual-funds",
      linkText: "Start Investing"
    },
    {
      id: 5,
      title: "Insurance Services",
      description: "Protect what matters most with our comprehensive insurance solutions for life, health, home, and more.",
      icon: "🛡️",
      link: "/insurance",
      linkText: "Get Protection"
    },
    {
      id: 6,
      title: "Business Banking",
      description: "Empower your business with our specialized banking solutions designed for startups, SMEs, and large corporations.",
      icon: "💼",
      link: "/business-banking",
      linkText: "Grow Your Business"
    }
  ];
  
  // Categories data
  const categories = [
    { title: "Accounts", icon: "💰", count: "8 Types" },
    { title: "Loans", icon: "💸", count: "5 Options" },
    { title: "Cards", icon: "💳", count: "7 Varieties" },
    { title: "Investments", icon: "📊", count: "10+ Products" },
    { title: "Insurance", icon: "🛡️", count: "4 Categories" },
    { title: "International", icon: "🌍", count: "6 Services" }
  ];

  return (
    <div className="services-container">
      <div className="services-header">
        <h2 className="services-title">Our Banking Services</h2>
        <p className="services-subtitle">
          Discover our comprehensive range of financial services designed to meet your every banking need
        </p>
      </div>
      
      <div className="services-grid">
        {services.map(service => (
          <div className="service-card" key={service.id}>
            <div className="service-icon-container">
              <div className="service-icon-bg"></div>
              <span className="service-icon">{service.icon}</span>
            </div>
            <div className="service-content">
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <Link to={service.link} className="service-link">
                {service.linkText} <span className="service-link-icon">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="service-categories">
        <h3 className="categories-title">Browse by Category</h3>
        <div className="categories-container">
          {categories.map((category, index) => (
            <div className="category-card" key={index}>
              <span className="category-icon">{category.icon}</span>
              <h4 className="category-title">{category.title}</h4>
              <span className="category-count">{category.count}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="featured-service">
        <div className="featured-content">
          <span className="featured-label">Featured Service</span>
          <h3 className="featured-title">SBI YONO Super App</h3>
          <p className="featured-description">
            Experience the power of banking, shopping, investments, and bill payments — all in one app. 
            Our award-winning super app brings the entire banking ecosystem to your fingertips with a 
            seamless, secure, and personalized experience.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/register"} className="featured-cta">
            Get Started Now →
          </Link>
        </div>
        <div className="featured-image">
          <img src="https://www.onlinesbi.sbi/sbijava/images/promo-yono.png" alt="SBI YONO App" />
        </div>
      </div>
    </div>
  );
};

export default Services;