import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Sign.css'; // Make sure to use the new CSS below
import Header from '../Header/Header';

function Sign() {
  const [flashMessage, setFlashMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaImage, setCaptchaImage] = useState('');
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    username: Yup.string()
      .min(6, 'Username must be at least 6 characters')
      .required('Username is required'),
    mobile_number: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
      .required('Mobile Number is required'),
    panchyat: Yup.string().required('Panchyat Name is required'),
    village: Yup.string().required('Village Name is required'),
    captcha: Yup.string().required('Captcha is required'),
  });
  const fetchCaptcha = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/generate-captcha/', {
        credentials: 'include', // required for session to work
      });
      const data = await res.json();
      setCaptchaImage(data.captcha_image);
    } catch (err) {
      console.error("Captcha fetch failed", err);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);



  function handleSubmit(values, { setSubmitting, resetForm }) {
    console.log(values);
    fetch('http://localhost:8000/api/signup/', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const responseData = await res.json();

        if (res.status === 201) {
          resetForm();
          setFlashMessage('Registration successful! Redirecting...');
          setTimeout(() => {
            setFlashMessage(null);
            navigate('/');
          }, 2000);
        } else {
          if (responseData.detail === "Invalid CAPTCHA") {
            setFlashMessage("❌ Invalid CAPTCHA entered. Please try again.");
            fetchCaptcha(); // Refresh CAPTCHA on failure
          } else {
            // Display a more specific error message from the backend if available
            setFlashMessage(responseData.detail || 'Registration failed. Please try again.');
          }

          setTimeout(() => setFlashMessage(null), 3000);
        }
      })
      .catch((err) => {
        console.error(err);
        setFlashMessage('An error occurred. Please check the console.');
        setTimeout(() => setFlashMessage(null), 3000);
      })
      .finally(() => {
        setSubmitting(false);
      });

  }

  return (
    <>
      <Header />
      <div className="signup-page-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1>Create Account</h1>
            <p>Please fill in the details to register.</p>
          </div>

          {flashMessage && (
            <div className={`flash-message ${flashMessage.includes('successful') ? 'success' : 'error'}`}>
              {flashMessage}
            </div>
          )}

          <div className="important-notes">
            <p>
              <strong>नोट:</strong> कृपया अपना नाम, मोबाइल नंबर, ईमेल व अन्य विवरणों को अत्यंत सावधानी पूर्वक भरें। भविष्य में परिवर्तन का कोई भी अनुरोध विचारणीय नहीं होगा।
            </p>
          </div>

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              mobile_number: '',
              username: '',
              panchyat: '',
              village: '',
              captcha: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="form-grid">
                  {/* Name Field */}
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <Field
                      name="name"
                      type="text"
                      className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')}
                    />
                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                  </div>

                  {/* Username Field */}
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <Field
                      name="username"
                      type="text"
                      className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')}
                    />
                    <ErrorMessage name="username" component="div" className="invalid-feedback" />
                  </div>

                  {/* Email Field */}
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <Field
                      name="email"
                      type="email"
                      className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')}
                    />
                    <ErrorMessage name="email" component="div" className="invalid-feedback" />
                  </div>

                  {/* Mobile Number Field */}
                  <div className="form-group">
                    <label htmlFor="mobile_number">Mobile Number</label>
                    <Field
                      name="mobile_number"
                      type="text"
                      className={'form-control' + (errors.mobile_number && touched.mobile_number ? ' is-invalid' : '')}
                    />
                    <ErrorMessage name="mobile_number" component="div" className="invalid-feedback" />
                  </div>

                  {/* Panchayat Field */}
                  <div className="form-group">
                    <label htmlFor="panchyat">Panchayat / City</label>
                    <Field
                      name="panchyat"
                      type="text"
                      className={'form-control' + (errors.panchyat && touched.panchyat ? ' is-invalid' : '')}
                    />
                    <ErrorMessage name="panchyat" component="div" className="invalid-feedback" />
                  </div>

                  {/* Village Field */}
                  <div className="form-group">
                    <label htmlFor="village">Village</label>
                    <Field
                      name="village"
                      type="text"
                      className={'form-control' + (errors.village && touched.village ? ' is-invalid' : '')}
                    />
                    <ErrorMessage name="village" component="div" className="invalid-feedback" />
                  </div>

                  {/* Password Field */}
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                      <Field
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')}
                      />
                      <span onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </span>
                    </div>
                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <Field
                      name="confirmPassword"
                      type="password"
                      className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')}
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                  </div>
                </div>
                <div className="form-group captcha-group">
                  <label htmlFor="captcha">Enter CAPTCHA</label>
                  <div className="captcha-wrapper">
                    <Field
                      name="captcha"
                      type="text"
                      className={'form-control' + (errors.captcha && touched.captcha ? ' is-invalid' : '')}
                    />
                    <img
                      src={captchaImage}
                      alt="Captcha"
                      className="captcha-img"
                      onClick={fetchCaptcha}
                      title="Click to refresh"
                    />
                    <div style={{ textAlign: "center" }}>
                      <button type="button"
                      className="refresh-captcha"
                      onClick={fetchCaptcha}>
                      🔄 Refresh CAPTCHA
                    </button>
                    </div>
                    
                  </div>
                  <ErrorMessage name="captcha" component="div" className="invalid-feedback" />
                </div>
                <div className="form-group">
                  <button type="submit" className="signup-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>

                <div className="login-link">
                  <span>Have an account? </span>
                  <Link to="/">Login here</Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Sign;