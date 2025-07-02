import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Sign.css';
import Header from '../Header/Header';

function Sign() {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState({});
  const [flashMessage, setFlashMessage] = useState(null);
  const navigate = useNavigate();

  function removeFlashMessage() {
    setFlashMessage(null);
  }

  function handleSubmit(fields) {
    setUser(fields);
    console.log(fields);
    fetch('http://127.0.0.1:8000/api/signup/', {
      method: 'POST',
      body: JSON.stringify(fields),
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          document.getElementById('signForm').reset();
          setFlashMessage('Registration successful!');
          setTimeout(removeFlashMessage, 1000);
          navigate('/');
        } else if (res.status === 401) {
          console.log('Unauthorized request');
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function Reset() {
    document.getElementById('signForm').reset();
    setUser((prevState) => ({ ...prevState, Date_of_Birth: '' }));
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="login-container">
        <Header />
        <div className="login-content">
          <div className="form-container">
            <div className="information">
              <h2>Important Informations</h2>
              <ol>
                <li style={{ padding: '12px' }}> प्रज्ञा केंद्र  </li>
              </ol>
              <div style={{ width: '300px', color: 'red', textAlign: 'justify' }}>
                <p>
                  नोट:- प्रज्ञा केंद्र संचालक अपना रजिस्ट्रेशन करते समय CSC ID को दोबारा जाँच ले उसके बाद आवेदन को सबमिट करे |
                </p>
              </div>
            </div>
            <div className="form-content">
              <div className="content">
                <div className="signForm" style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <h1>Sign Up</h1>
                  <p style={{ color: 'red', textAlign: 'center', marginBottom: '' }}>
                    नोट:- कृपया अपना नाम, मोबाइल नंबर, ईमेल व अन्य विवरणों को अत्यंत सावधानी पूर्वक भरें।
                    भविष्य में परिवर्तन / संशोधन का कोई भी अनुरोध विचारणीय नहीं होगा।
                  </p>
                  <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>
                    Note:- Please fill your name, mobile number, email and other details very carefully.
                    No request for change/modification will be entertained in future.
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
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string().required('Name is required'),
                    email: Yup.string().email('Email is invalid').required('Email is required'),
                    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
                    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
                    username: Yup.string().min(6, 'Username must be at least 6 characters').required('username is required'),
                    mobile_number: Yup.number().required('Mobile Number is required'),
                    panchyat: Yup.string().required('Panchyat Name is required'),
                    village: Yup.string().required('Village Name is required'),
                  })}
                  onSubmit={(fields) => handleSubmit(fields)}
                >
                  {({ errors, status, touched }) => (
                    <section className="">
                      {flashMessage && (
                        <div className="flash-message container">
                          {flashMessage}
                        </div>
                      )}
                      <Form id="signForm">
                        <div className="mb-3 form-control-group">
                          <label className="form-label" htmlFor="name">
                            Name
                          </label>
                          <Field
                            name="name"
                            type="text"
                            onInput={(e) => {
                              user.name = e.target.value;
                              setUser(user);
                            }}
                            className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')}
                          />
                          <ErrorMessage name="name" component="div" className="invalid-feedback" />
                        </div>
                        <div className="mb-3 form-control-group">
                          <label className="form-label" htmlFor="name">
                            Panchyat / Nagar Panchyat
                          </label>
                          <Field
                            name="panchyat"
                            type="text"
                            onInput={(e) => {
                              user.name = e.target.value;
                              setUser(user);
                            }}
                            className={'form-control' + (errors.panchyat && touched.panchyat ? ' is-invalid' : '')}
                          />
                          <ErrorMessage name="name" component="div" className="invalid-feedback" />
                        </div>
                        <div className="mb-3 form-control-group">
                          <label className="form-label" htmlFor="name">
                            Village
                          </label>
                          <Field
                            name="village"
                            type="text"
                            onInput={(e) => {
                              user.name = e.target.value;
                              setUser(user);
                            }}
                            className={'form-control' + (errors.village && touched.village ? ' is-invalid' : '')}
                          />
                          <ErrorMessage name="name" component="div" className="invalid-feedback" />
                        </div>
                        <div className="mb-3 form-control-group">
                          <label className="form-label" htmlFor="email">
                            Email
                          </label>
                          <Field
                            name="email"
                            type="text"
                            onInput={(e) => {
                              user.email = e.target.value;
                              setUser(user);
                            }}
                            className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')}
                          />
                          <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                        <div className="mb-3 form-control-group">
                          <label className="form-label" htmlFor="username">
                            User Name
                          </label>
                          <Field
                            name="username"
                            type="text"
                            onInput={(e) => {
                              user.username = e.target.value;
                              setUser(user);
                            }}
                            className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')}
                          />
                          <ErrorMessage name="username" component="div" className="invalid-feedback" />
                        </div>
                        <div className="mb-3 form-control-group">
                          <label className="form-label" htmlFor="username">
                            Mobile Number
                          </label>
                          <Field
                            name="mobile_number"
                            type="number"
                            onInput={(e) => {
                              user.mobile_number = e.target.value;
                              setUser(user);
                            }}
                            className={'form-control' + (errors.mobile_number && touched.mobile_number ? ' is-invalid' : '')}
                          />
                          <ErrorMessage name="mobile_number" component="div" className="invalid-feedback" />
                        </div>
                        <div className="mb-3 form-control-group password-container">
                          <label className="form-label" htmlFor="password">
                            Password
                          </label>
                          <div className="password-input">
                            <div className="input-wrapper">
                              <Field
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')}
                              />
                              <p
                                type="button"
                                className="eye-button"
                                onClick={togglePasswordVisibility}
                              >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                              </p>
                            </div>
                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                          </div>


                        </div>
                        <div className="mb-3 form-control-group password-container">
                          <label className="form-label" htmlFor="confirmPassword">
                            Confirm Password
                          </label>
                          <Field
                            name="confirmPassword"
                            type="password"
                            onInput={(e) => {
                              user.password = e.target.value;
                              setUser(user);
                            }}
                            className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')}
                          />
                          <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                        </div>
                        <div className="mb-3 form-control-group">
                          <button
                            type="submit"
                            className="loginbutton"
                            style={{ textDecoration: 'none', textAlign: 'center', width: '100%' }}
                          >
                            Register
                          </button>
                        </div>
                        <div style={{ display: 'flex', textDecoration: 'none' }}>
                          Have already an account?
                          <Link
                            to="/"
                            style={{ display: 'flex', textDecoration: 'none', fontWeight: 'bold', color: 'black', cursor: 'pointer' }}
                          >
                            Login here
                          </Link>
                        </div>
                      </Form>
                    </section>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sign;
