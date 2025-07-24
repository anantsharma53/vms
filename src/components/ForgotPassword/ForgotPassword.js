import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './ForgotPassword.css'; // We will create this CSS file next
import Header from '../Header/Header'; // Assuming your Header is in a parent directory

function ForgotPassword() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Validation schema for the email field
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });

  // Handle form submission
  async function handleSubmit(values, { setSubmitting, resetForm }) {
    setMessage('');
    setError('');
    
    // This is a placeholder for your backend API endpoint
    // You need to replace 'http://127.0.0.1:8000/api/request-password-reset/' with your actual endpoint
    try {
      const response = await fetch('http://127.0.0.1:8000/api/request-password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      if (response.ok) {
        // For security reasons, show a generic success message
        // This prevents attackers from checking which emails are registered.
        setMessage('If an account with that email exists, a password reset link has been sent.');
        resetForm();
      } else {
        const data = await response.json();
        setError(data.detail || 'An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Password reset request failed:', err);
      setError('Failed to connect to the server. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <div className="forgot-password-page-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <h1>Reset Password</h1>
            <p>Enter your email address and we will send you a link to reset your password.</p>
          </div>

          {/* Display Success or Error Messages */}
          {message && <div className="flash-message success">{message}</div>}
          {error && <div className="flash-message error">{error}</div>}

          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <Field
                    name="email"
                    type="email"
                    className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')}
                    placeholder="you@example.com"
                  />
                  <ErrorMessage name="email" component="div" className="invalid-feedback" />
                </div>

                <div className="form-group">
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>

                <div className="back-to-login">
                  <Link to="/">Back to Login</Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
