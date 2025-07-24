import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomeNew.css";
import { useNavigate } from 'react-router-dom';
import AdminDefaultDashboard from "../AdminDefaultDashboard/AdminDefaultDashboard";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
// Simple icon components (you would replace these with actual icon library or SVGs)
const Icon = ({ name, className = "icon" }) => {
  const icons = {
    shield: "🛡️",
    home: "🏠",
    login: "🔑",
    chevronDown: "▼",
    user: "👤",
    settings: "⚙️",
    userCheck: "✅",
    search: "🔍",
    qrCode: "📱",
    calendar: "📅",
    clock: "⏰",
    fileText: "📄",
    shieldCheck: "🛡️",
    building: "🏢",
    checkCircle: "✓",
    phone: "📞",
    mail: "✉️",
    mapPin: "📍",
    globe: "🌐",
    reception: "💁",
  };

  return <span className={className}>{icons[name] || "•"}</span>;
};

const HomeNew = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };


  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-container">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jharkhand_Rajakiya_Chihna.svg/1200px-Jharkhand_Rajakiya_Chihna.svg.png"
                  alt="Jharkhand Government Emblem"
                  className="logo-image"
                />
              </div>
              <div className="logo-text">
                <h1>जिला प्रशासन जामताड़ा </h1>
                <p>District Administration Jamtara</p>
              </div>
            </div>

            <nav className="nav">
              <button className="nav-button"
                onClick={() => {
                  
                  navigate('/');
                }}
              >
                <Icon name="home" className="icon" />
                Home
              </button>
              <button className="nav-button">Services</button>
              <button className="nav-button" 
              onClick={() => {
                  
                  navigate('/register');
                }}
              >Register</button>
              <button className="nav-button">हिंदी</button>

              <div className={`dropdown ${dropdownOpen ? "open" : ""}`}>
                <button className="nav-button primary" onClick={toggleDropdown}>
                  <Icon name="login" className="icon" />
                  Login
                  <Icon name="chevronDown" className="icon" />
                </button>
                <div className="dropdown-content">
                  <div className="dropdown-label">Login as</div>
                  <div className="dropdown-item" onClick={closeDropdown}>
                    <Icon name="reception" className="icon" />
                    <div className="dropdown-item-content" onClick={() => {
                        closeDropdown();
                        navigate('/reception');
                      }}>
                      <span className="dropdown-item-title" 
                      >Reception User</span>
                      <span className="dropdown-item-desc">
                        Visitor registration & tracking
                      </span>
                    </div>
                  </div>
                  <div className="dropdown-item" onClick={closeDropdown}>
                    <Icon name="user" className="icon" />
                    <div className="dropdown-item-content" onClick={() => {
                        closeDropdown();
                        navigate('/public');
                      }}>
                      <span className="dropdown-item-title" >Public User</span>
                      <span className="dropdown-item-desc">
                        Visitor registration & tracking
                      </span>
                    </div>
                  </div>
                  <div className="dropdown-item" onClick={closeDropdown}>

                    <Icon name="shield" className="icon" />
                    <div className="dropdown-item-content" onClick={() => {
                        closeDropdown();
                        navigate('/officer');
                      }}>
                      <span className="dropdown-item-title" >Officer Login</span>
                      <span className="dropdown-item-desc">
                        Manage visitor Request/ Query
                      </span>
                    </div>
                  </div>
                  <div className="dropdown-item" onClick={closeDropdown}>
                    <Icon name="settings" className="icon" />
                    <div className="dropdown-item-content">
                      <span className="dropdown-item-title">Admin Login</span>
                      <span className="dropdown-item-desc">
                        System administration
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="features">
          <ImageCarousel/>
            
       </div>
      <section className="hero"
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(239, 68, 68, 0.1) 100%)',
          padding: '1.5rem 0'
        }}
      >
        <div className="container">
          <div className="hero-content">
            {/* <div className="badge">
              <Icon name="shield" className="icon" />
              Secure & Efficient
            </div> */}
            <h1 className="hero-title">
              Visitor Management System
              <span className="primary-text">Jamtara</span>
            </h1>
            <p className="hero-description">
              A modern, secure, and efficient digital solution for managing
              visitors to Government offices and facilities in Jamtara District.
            </p>
            {/* <div className="hero-buttons">
              <button className="button large primary">
                <Icon name="userCheck" className="icon" />
                Visitor Registration
              </button>
              <button className="button large outline">
                <Icon name="search" className="icon" />
                Check Status
              </button>
            </div> */}
          </div>
        </div>
        
      </section>
              
      {/* Features Section */}
      {/* <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Key Features</h2>
            <p className="section-description">
              Our comprehensive visitor management system ensures security,
              efficiency, and compliance with government protocols.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card primary">
              <div className="feature-icon primary">
                <Icon name="qrCode" className="icon large" />
              </div>
              <h3 className="feature-title">Digital Check-in</h3>
              <p className="feature-description">
                Quick QR code-based entry system for pre-registered visitors
              </p>
              <ul className="feature-list">
                <li className="feature-list-item">
                  <Icon name="checkCircle" className="check-icon" />
                  Contactless entry
                </li>
                <li className="feature-list-item">
                  <Icon name="checkCircle" className="check-icon" />
                  Real-time verification
                </li>
              </ul>
            </div>

            <div className="feature-card secondary">
              <div className="feature-icon secondary">
                <Icon name="shieldCheck" className="icon large" />
              </div>
              <h3 className="feature-title">Security Screening</h3>
              <p className="feature-description">
                Comprehensive background verification and security protocols
              </p>
              <ul className="feature-list">
                <li className="feature-list-item">
                  <Icon name="checkCircle" className="check-icon" />
                  ID verification
                </li>
                <li className="feature-list-item">
                  <Icon name="checkCircle" className="check-icon" />
                  Photo capture
                </li>
              </ul>
            </div>

            <div className="feature-card accent">
              <div className="feature-icon accent">
                <Icon name="calendar" className="icon large" />
              </div>
              <h3 className="feature-title">Appointment Scheduling</h3>
              <p className="feature-description">
                Pre-book visits and manage appointments efficiently
              </p>
              <ul className="feature-list">
                <li className="feature-list-item">
                  <Icon name="checkCircle" className="check-icon" />
                  Calendar integration
                </li>
                <li className="feature-list-item">
                  <Icon name="checkCircle" className="check-icon" />
                  SMS notifications
                </li>
              </ul>
            </div>

            <div className="feature-card primary">
              <div className="feature-icon primary">
                <Icon name="fileText" className="icon large" />
              </div>
              <h3 className="feature-title">Digital Records</h3>
              <p className="feature-description">
                Maintain comprehensive digital logs of all visitor activities
              </p>
              <ul className="feature-list">
                <li className="feature-list-item">
                  <Icon name="checkCircle" className="check-icon" />
                  Audit trails
                </li>
                <li className="feature-list-item">
                  <Icon name="checkCircle" className="check-icon" />
                  Report generation
                </li>
              </ul>
            </div>

            <div className="feature-card secondary">
              <div className="feature-icon secondary">
                <Icon name="clock" className="icon large" />
              </div>
              <h3 className="feature-title">Real-time Tracking</h3>
              <p className="feature-description">
                Monitor visitor flow and manage capacity in real-time
              </p>
              <ul className="feature-list">
                <li className="feature-list-item">
                  <Icon name="checkCircle" className="check-icon" />
                  Live dashboard
                </li>
                <li className="feature-list-item">
                  <Icon name="checkCircle" className="check-icon" />
                  Capacity alerts
                </li>
              </ul>
            </div>

            <div className="feature-card accent">
              <div className="feature-icon accent">
                <Icon name="building" className="icon large" />
              </div>
              <h3 className="feature-title">Multi-Location Support</h3>
              <p className="feature-description">
                Unified system across all government offices and facilities
              </p>
              <ul className="feature-list">
                <li className="feature-list-item">
                  <Icon name="checkCircle" className="check-icon" />
                  Centralized management
                </li>
                <li className="feature-list-item">
                  <Icon name="checkCircle" className="check-icon" />
                  Cross-location access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section> */}
      {/* Features Section */}
      
      {/* Quick Actions Section */}
      <section className="quick-actions">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
            <p className="section-description">
              Get started with our visitor management system
            </p>
          </div>

          <div className="actions-grid">
            <button className="action-button" onClick={() => navigate('/register')}>
              <Icon name="userCheck" className="action-icon xl" />
              <div className="action-content" >
                <div className="action-title" >New Registration</div>
                <div className="action-desc">Register for visit</div>
              </div>
            </button>

            <button className="action-button secondary" onClick={() => navigate('/public')}>
              <Icon name="search" className="action-icon secondary xl" />
              <div className="action-content" >
                <div className="action-title">Check Status</div>
                <div className="action-desc">Track your visit</div>
              </div>
            </button>

            <button className="action-button accent" >
              <Icon name="calendar" className="action-icon accent xl" />
              <div className="action-content">
                <div className="action-title">Holiday List</div>
                <div className="action-desc"
                  onClick={() => {
                    window.open('https://cdn.s3waas.gov.in/s313f320e7b5ead1024ac95c3b208610db/uploads/2025/01/2025010487.pdf', '_blank');
                  }}

                >Click here to view </div>
              </div>
            </button>

            <button className="action-button">
              <div
                className="mapouter"
                style={{
                  position: 'relative',
                  textAlign: 'right',
                  width: '200px',
                  height: '200px'
                }}
              >
                <div
                  className="gmap_canvas"
                  style={{
                    overflow: 'hidden',
                    background: 'none',
                    width: '200px',
                    height: '200px'
                  }}
                >
                  <iframe
                    width="200px"
                    height="200px"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.241399531003!2d86.8237118!3d23.9832267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f6d6cdccf416db%3A0xde04621951e9373b!2sCombined%20Building%2C%20Jamtara!5e0!3m2!1sen!2sin!4v1719216578321!5m2!1sen!2sin"
                  ></iframe>
                </div>

                {/* Optional credit link, hidden with CSS */}
                <a
                  href="https://norsumediagroup.com/embed-google-map-website-free"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gme-generated-link"
                  style={{
                    display: 'none'
                  }}
                >
                  Embed Map on Website for Free
                </a>
              </div>

              {/* <Icon name="qrCode" className="action-icon xl" />
              <div className="action-content">
                <div className="action-title">QR Check-in</div>
                <div className="action-desc">Quick entry</div>
              </div> */}
            </button>
          </div>
        </div>
      </section>

      {/* Contact & Info Section */}
      <section className="contact">
        <div className="container">
          <div className="contact-grid">
            <div>
              <h3 className="contact-title">Contact Information</h3>
              <div className="contact-list">
                <div className="contact-item">
                  <Icon name="mapPin" className="contact-icon medium" />
                  <div className="contact-info">
                    <h4>Address</h4>
                    <p>
                      Combined Building Jamtara
                      <br />
                      Jamtara - 815351
                      <br />
                      Jharkhand, India
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <Icon name="phone" className="contact-icon medium" />
                  <div className="contact-info">
                    <h4>Phone</h4>
                    <p>+91-9431130960</p>
                  </div>
                </div>

                <div className="contact-item">
                  <Icon name="mail" className="contact-icon medium" />
                  <div className="contact-info">
                    <h4>Email</h4>
                    <p>dc-jam@nic.in</p>
                  </div>
                </div>

                <div className="contact-item">
                  <Icon name="globe" className="contact-icon medium" />
                  <div className="contact-info">
                    <h4>Website</h4>
                    <p>www.jamtara.nic.in</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="contact-title">Important Guidelines</h3>
              <div>
                <div className="guideline-card primary">
                  <h4 className="guideline-title primary">
                    Security Requirements
                  </h4>
                  <p className="guideline-text">
                    All visitors must carry valid government-issued photo ID and
                    complete security screening before entry.
                  </p>
                </div>

                <div className="guideline-card secondary">
                  <h4 className="guideline-title secondary">
                    Registration
                  </h4>
                  <p className="guideline-text">
                    Registration must be completed at Reception Counter.
                  </p>
                </div>

                <div className="guideline-card accent">
                  <h4 className="guideline-title accent">Office Hours</h4>
                  <p className="guideline-text">
                    Monday to Saturday: 10:00 AM - 5:00 PM
                    <br></br>
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <div className="footer-logo-container">
                 <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jharkhand_Rajakiya_Chihna.svg/1200px-Jharkhand_Rajakiya_Chihna.svg.png"
                  alt="Jharkhand Government Emblem"
                  className="logo-image"
                />
                </div>
                <div className="footer-logo-text">
                  <h3>जिला प्रशासन जामताड़ा</h3>
                  <p>District Administration Jamtara</p>
                </div>
              </div>
              <p className="footer-description">
                A digital initiative to modernize visitor management across
                government facilities in Jamtara.
              </p>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Register Visit</a>
                </li>
                <li>
                  <a href="#">Check Status</a>
                </li>
                <li>
                  <a href="#">Guidelines</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Government Links</h4>
              <ul className="footer-links">
                <li>
                  <a href="#">Jharkhand Portal</a>
                </li>
                <li>
                  <a href="#">Digital India</a>
                </li>
                <li>
                  <a href="#">MyGov</a>
                </li>
                <li>
                  <a href="#">India.gov.in</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 District Administration Jamtara. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeNew;
