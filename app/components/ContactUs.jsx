"use client"
// ContactUs.jsx
import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    contactType: 'general'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeContact, setActiveContact] = useState('phone');

  const contactTypes = [
    { id: 'general', label: 'General Inquiry', icon: '📧' },
    { id: 'tournament', label: 'Tournament Registration', icon: '🏆' },
    { id: 'booking', label: 'Facility Booking', icon: '🎮' },
    { id: 'technical', label: 'Technical Support', icon: '🔧' },
    { id: 'partnership', label: 'Partnership', icon: '🤝' },
    { id: 'career', label: 'Career Opportunities', icon: '💼' },
  ];

  const contactMethods = [
    {
      id: 'phone',
      title: 'Call Us',
      icon: '📞',
      details: ['+91 8095240976', '+91 7999348733'],
      description: 'Available 11 AM - 11 PM IST',
      color: '#00ff88'
    },
    {
      id: 'email',
      title: 'Email',
      icon: '✉️',
      details: ['imogamingarena@gmail.com', 'imogamingarena@gmail.com'],
      description: 'Response within 24 hours',
      color: '#00a3ff'
    },
    {
      id: 'address',
      title: 'Visit Us',
      icon: '📍',
      details: ['IMO Gaming Arena', 'Gurudatta A5', 'PUNE, Mahalunge baner near Godrej opp to VTP sale Office, 411045'],
      description: 'Open 24/7 for members',
      color: '#ffaa00'
    },
    {
      id: 'discord',
      title: 'Discord',
      icon: '🎮',
      details: ['discord.gg/imogaming'],
      description: 'Live community support',
      color: '#7289da'
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to a backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        contactType: 'general'
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleContactClick = (method) => {
    setActiveContact(method);
    
    // Handle actual contact actions
    switch(method) {
      case 'phone':
        window.location.href = 'tel:+918095240976';
        break;
      case 'email':
        window.location.href = 'mailto:info@imogaming.com';
        break;
      case 'discord':
        window.open('https://discord.gg/imogaming', '_blank');
        break;
      default:
        break;
    }
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+918095240976');
    // You could add a toast notification here
    alert('Phone number copied to clipboard!');
  };

  return (
    <div className="contact-container">
      {/* Header Section */}
      <div className="contact-header">
        <div className="contact-header-bg">
          <div className="circuit-pattern"></div>
          <div className="glow-effect"></div>
        </div>
        <h1 className="contact-title">CONTACT US</h1>
        <p className="contact-subtitle">Reach Out to IMO Gaming Arena</p>
        <div className="header-tagline">
          <span className="tagline-item">⚡ Quick Response</span>
          <span className="tagline-item">🎯 24/7 Support</span>
          <span className="tagline-item">🏆 Gaming Experts</span>
        </div>
      </div>

      <div className="contact-content">
        {/* Left Side - Contact Methods */}
        <div className="contact-methods-section">
          <h2 className="section-title">Quick Connect</h2>
          <p className="section-description">
            Choose your preferred method to reach our gaming support team
          </p>
          
          <div className="contact-methods-grid">
            {contactMethods.map((method) => (
              <div 
                key={method.id}
                className={`contact-method-card ${activeContact === method.id ? 'active' : ''}`}
                onClick={() => handleContactClick(method.id)}
                style={{ '--method-color': method.color }}
              >
                <div className="method-icon" style={{ backgroundColor: `${method.color}20` }}>
                  <span className="icon-emoji">{method.icon}</span>
                  <div className="icon-glow" style={{ backgroundColor: method.color }}></div>
                </div>
                <div className="method-content">
                  <h3>{method.title}</h3>
                  <div className="method-details">
                    {method.details.map((detail, index) => (
                      <p key={index} className="detail-item">
                        {detail}
                        {method.id === 'phone' && index === 0 && (
                          <button 
                            className="copy-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyPhone();
                            }}
                            title="Copy number"
                          >
                            📋
                          </button>
                        )}
                      </p>
                    ))}
                  </div>
                  <p className="method-description">{method.description}</p>
                </div>
                <div className="method-action">
                  <span className="action-arrow">→</span>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Contact Banner */}
          <div className="emergency-contact">
            <div className="emergency-icon">🚨</div>
            <div className="emergency-content">
              <h4>Urgent Tournament Issues?</h4>
              <p>Call our Tournament Hotline</p>
              <div className="emergency-phone">
                <span>+91 8095240976</span>
                <button 
                  className="emergency-call-btn"
                  onClick={() => window.location.href = 'tel:+918095240976'}
                >
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="contact-form-section">
          <div className="form-header">
            <h2 className="section-title">Send Us a Message</h2>
            <p className="section-description">
              Fill out the form below and our team will get back to you ASAP
            </p>
          </div>

          {isSubmitted ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Message Sent Successfully!</h3>
              <p>Our team will contact you within 24 hours. You can also reach us directly at +91 8095240976</p>
              <button 
                className="success-call-btn"
                onClick={() => window.location.href = 'tel:+918095240976'}
              >
                📞 Call Now
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              {/* Inquiry Type Selection */}
              <div className="inquiry-types">
                <p className="type-label">What are you contacting us about?</p>
                <div className="type-grid">
                  {contactTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      className={`type-option ${formData.contactType === type.id ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, contactType: type.id }))}
                    >
                      <span className="type-icon">{type.icon}</span>
                      <span className="type-text">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    onChange={handleChange}
                    placeholder="+91 0000000000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief description of your inquiry"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide details about your inquiry..."
                  rows="6"
                  required
                />
              </div>

              <div className="form-footer">
                <p className="privacy-notice">
                  By submitting this form, you agree to our privacy policy. We'll never share your contact details.
                </p>
                <button type="submit" className="submit-btn">
                  <span className="btn-text">Send Message</span>
                  <span className="btn-icon">🚀</span>
                </button>
              </div>
            </form>
          )}

          {/* Alternative Contact Info */}
          <div className="alt-contact-info">
            <div className="alt-contact-item">
              <span className="alt-icon">⏰</span>
              <div>
                <h4>Operating Hours</h4>
                <p>Mon-Sun: 10:00 AM - 10:00 PM IST</p>
                <p>Tournaments: 24/7 as scheduled</p>
              </div>
            </div>
            <div className="alt-contact-item">
              <span className="alt-icon">💬</span>
              <div>
                <h4>Live Chat</h4>
                <p>Available on Discord & Website</p>
                <p>Average response: <strong>5 minutes</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>📞 What's the best way to contact for tournament queries?</h4>
            <p>Call <strong>+91 8095240976</strong> for immediate tournament-related assistance. For registrations, use our website portal.</p>
          </div>
          <div className="faq-item">
            <h4>🕐 What are your response times?</h4>
            <p>Phone calls are answered immediately during operating hours. Emails receive responses within 24 hours.</p>
          </div>
          <div className="faq-item">
            <h4>🎮 Can I visit without booking?</h4>
            <p>Yes! Walk-ins are welcome. For guaranteed station access during peak hours, we recommend booking online.</p>
          </div>
          <div className="faq-item">
            <h4>🏆 How do I register for tournaments?</h4>
            <p>Visit our Events page or call +91 8095240976 for tournament registration and queries.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;