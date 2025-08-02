import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css'
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  // State variables to store input values and error messages
  const [user, setUser] = useState({
    username: "",
    password: "",
    
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  let navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/api/signin/", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",

      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json(); // Parse response as JSON
        } else if (res.status === 400) {
          console.log("Unauthorized request");
          alert("Login Error");
          throw new Error("Unauthorized request");
        } else {
          console.log("Something went wrong");
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        console.log(data);
        const { user, access } = data;
        localStorage.setItem("token", data.access);
        localStorage.setItem("tokenExpiration", data.access);
        localStorage.setItem("user_details", JSON.stringify(user));
        const users = JSON.parse(localStorage.getItem('user_details'));
        const is_superuser = users && users.is_superuser;
        const is_staff = users && users.is_staff;
        if (is_superuser || is_staff) {
          //    navigate("/form");
          navigate("/admindasboard");
        }
        else {

          console.log("Unauthorized request");
          alert("Unauthorized Username Or Password");
          navigate("/admin");
        }

      })
      .catch((err) => {
        alert("Check your Username Or Password");
        console.log(err);
      });

  }

  return (
    <>
      <Header />
      <div className="logincontainer1"
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(239, 68, 68, 0.1) 100%)',
          padding: '1.5rem 0'
        }}
      >
        <div className="loginform loginform1">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '2rem',
              color: '#2563eb',
            }}
            onClick={() => navigate('/')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/60/Firefox_Home_-_logo.png"
              style={{ width: '80px' }} alt="logo" />
          </div>
          <h2>Visitor Monitoring System</h2>
          <h2>Officer Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="User Name"
              name="username"
              onChange={handleChange}
              value={user.username}
            />
            <input
              type='password'
              placeholder="password"
              name="password"
              id="password"
              onChange={handleChange}
              value={user.password}
              className="form-control"
            />
            <div className="forgot-password-link" style={{ marginTop: '10px', textAlign: 'right' }}>
              <Link to="/forgot-password" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" >Login</button>

          </form>

        </div>

      </div>

    </>
  );
};

export default AdminLogin;
