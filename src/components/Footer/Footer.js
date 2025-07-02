import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <nav>
          <a href="#">Website Policies</a>
          <a href="#">Help</a>
          <a href="#">Contact Us</a>
          <a href="#">Feedback</a>
        </nav>
      </div>
      <div className="footer-middle">
        <p>Content Owned by District Administration</p>
        <p>© Deoghar, Developed and Hosted By National Informatics Centre,<br />
          Ministry Of Electronics & Information Technology, Government Of India</p>
        <p>Last Updated: <strong>Aug 21, 2024</strong></p>
      </div>
      <div className="footer-bottom">
        <img src="path-to-swaas-logo.png" alt="Powered by Swaas" />
        <img src="path-to-nic-logo.png" alt="National Informatics Centre" />
        <img src="path-to-digital-india-logo.png" alt="Digital India" />
      </div>
    </footer>
  );
}

export default Footer;
