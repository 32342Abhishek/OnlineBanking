import React from 'react';
import './Support.css';
import { 
  HelpCircle, 
  CreditCard, 
  Lock, 
  Shield, 
  Phone, 
  MessageCircle 
} from 'lucide-react';

const Support = () => {
  const supportOptions = [
    {
      icon: <CreditCard />,
      title: "Card Services",
      description: "Manage your bank card, report lost cards, and request replacements"
    },
    {
      icon: <Lock />,
      title: "Account Security",
      description: "Protect your account with advanced security features"
    },
    {
      icon: <Shield />,
      title: "Fraud Protection",
      description: "24/7 monitoring and instant alerts for suspicious activities"
    }
  ];

  const contactMethods = [
    {
      icon: <Phone />,
      title: "Phone Support",
      number: "9142552982",
      hours: "8am - 10pm EST"
    },
    {
      icon: <MessageCircle />,
      title: "Live Chat",
      description: "Instant support through our mobile app",
      availability: "24/7 Available"
    }
  ];

  return (
    <div className="support-page">
      <div className="support-container">
        <header className="support-header">
          <HelpCircle className="header-icon" />
          <h1>Customer Support</h1>
        </header>

        <section className="support-options">
          <h2>How Can We Help You?</h2>
          <div className="options-grid">
            {supportOptions.map((option, index) => (
              <div key={index} className="support-card">
                <div className="card-icon">{option.icon}</div>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-methods">
          <h2>Contact Us</h2>
          <div className="contact-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="contact-card">
                <div className="contact-header">
                  {method.icon}
                  <h3>{method.title}</h3>
                </div>
                {method.number && <p>Call: {method.number}</p>}
                {method.hours && <p>Hours: {method.hours}</p>}
                {method.description && <p>{method.description}</p>}
                {method.availability && <p>{method.availability}</p>}
              </div>
            ))}
          </div>
        </section>

        <footer className="support-footer">
          <p>Email: ak7667042@gmail.com | Emergency Line: 9142552982</p>
        </footer>
      </div>
    </div>
  );
};

export default Support;