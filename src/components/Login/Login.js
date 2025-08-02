// import './Login.css'
// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Link } from 'react-router-dom';
// import Header from '../Header/Header';
// import AdmitCardSearchForm from '../AdmitCardSearch/AdmitCardSearch';
// const Icon = ({ name, className = "icon" }) => {
//     const icons = {
//         shield: "🛡️",
//         home: "🏠",
//         login: "🔑",
//         chevronDown: "▼",
//         user: "👤",
//         settings: "⚙️",
//         userCheck: "✅",
//         search: "🔍",
//         qrCode: "📱",
//         calendar: "📅",
//         clock: "⏰",
//         fileText: "📄",
//         shieldCheck: "🛡️",
//         building: "🏢",
//         checkCircle: "✓",
//         phone: "📞",
//         mail: "✉️",
//         mapPin: "📍",
//         globe: "🌐",
//     };

//     return <span className={className}>{icons[name] || "•"}</span>;
// };
// function Login() {
//     const [user, setUser] = useState({
//         username: "",
//         password: "",
//         captcha: "",
//     });
//     const [showPassword, setShowPassword] = useState(false);
//     const [showSignup, setShowSignup] = useState(false);
//     const [captchaImg, setCaptchaImg] = useState('');
//     const [captcha, setCaptcha] = useState('');
//     const fetchCaptcha = async () => {
//         const res = await fetch('http://localhost:8000/api/generate-captcha/', {
//             // credentials: 'include' // Important to use session-based CAPTCHA
//         });
//         const data = await res.json();
//         setCaptchaImg(data.captcha_image);
//     };

//     useEffect(() => {
//         fetchCaptcha();
//     }, []);
//     let navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUser({
//             ...user,
//             [name]: value,
//         });
//     };

//     // const handleRegistration = () => {
//     //     navigate('/register');
//     // };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const toggleSignupVisibility = () => {
//         setShowSignup(!showSignup);
//     };
// useEffect(() => {
//     fetchCaptcha();
//   }, []);
//     const handleSubmit = (e) => {
//         console.log(user)
//         e.preventDefault();
//         fetch("http://127.0.0.1:8000/api/signin/", {
//             method: "POST",
//             body: JSON.stringify(user),
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         })
//             .then((res) => {
//                 if (res.ok) {
//                     return res.json();
//                 } else if (res.status === 400) {
//                     alert("Login Error");
//                     throw new Error("Unauthorized request");
//                     fetchCaptcha();
//                 } else {
//                     throw new Error("Something went wrong");
//                 }
//             })
//             .then((data) => {
//                 const { user, access } = data;
//                 localStorage.setItem("token", access);
//                 localStorage.setItem("tokenExpiration", access);
//                 localStorage.setItem("user_details", JSON.stringify(user));
//                 const users = JSON.parse(localStorage.getItem("user_details"));
//                 const iscandiate = users?.is_candiate;
//                 const isreception = users?.is_recptionstaff;
//                 if (isreception) {
//                     navigate("/reception-dashboard");
//                 } else if (iscandiate) {
//                     navigate("/public-dashboard");
//                 } else {
//                     navigate("/");
//                 }
//             })
//             .catch((err) => {
//                 alert("Check your Username Or Password");
//                 console.error(err);
//             });
//     };

//     return (
//         <>
//             <div className="login-container" >

//                 <Header />

//                 <h2>Visitor Monitoring System</h2>
//                 {/* <h2>Reception Login</h2> */}
//                 <div className="login-content">


//                     <div className="form-container"
//                         style={{
//                             background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(239, 68, 68, 0.1) 100%)',
//                             padding: '1.5rem 0'
//                         }}
//                     >
//                         <div
//                             style={{
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 cursor: 'pointer',
//                                 fontSize: '2rem',
//                                 color: '#2563eb',
//                             }}
//                             onClick={() => navigate('/')}
//                         >
//                             <img src="https://upload.wikimedia.org/wikipedia/commons/6/60/Firefox_Home_-_logo.png"
//                                 style={{ width: '80px' }} alt="logo" />
//                         </div>
//                         {/* <div className="information">
//                             <h2>Important Informations</h2>
//                             <ol>
//                                 <li style={{ padding: "12px" }}> नागरिक अनुभाग </li>
//                             </ol>
//                             <div style={{ width: "300px", color: "red", textAlign: "justify" }}>
//                                 <p>
//                                     नोट:-  लॉगिन करने के लिए नागरिक अपना रजिस्ट्रेशन करे ।
//                                 </p>
//                                 <button onClick={handleRegistration} style={styles.button}>
//                                     Click Here To Register
//                                 </button>
//                             </div>
//                         </div> */}

//                         <div className="admitcard">

//                             <form onSubmit={handleSubmit} style={styles.form}>
//                                 <div style={styles.formGroup}>
//                                     <label htmlFor="username">User Name:</label>
//                                     <input
//                                         type="text"
//                                         id="username"
//                                         name="username"
//                                         value={user.username}
//                                         onChange={handleChange}
//                                         required
//                                         style={styles.input}
//                                     />
//                                 </div>
//                                 <div style={styles.formGroup}>
//                                     <label htmlFor="password">Password:</label>
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         id="password"
//                                         name="password"
//                                         value={user.password}
//                                         onChange={handleChange}
//                                         required
//                                         style={styles.input}
//                                     />
//                                 </div>
//                                 <div className="forgot-password-link" style={{ marginTop: '10px', textAlign: 'right' }}>
//                                     <Link to="/forgot-password" style={{ color: '#2563eb', textDecoration: 'underline' }}>
//                                         Forgot Password?
//                                     </Link>
//                                 </div>
//                                 {captchaImg && (
//                                     <img src={captchaImg} alt="CAPTCHA" style={{ marginBottom: '10px' }} />
//                                 )}<br />

//                                 <input
//                                     placeholder="Enter CAPTCHA"
//                                     value={captcha}
//                                     onChange={(e) => setCaptcha(e.target.value)}
//                                     required
//                                 /><br />

//                                 <button type="submit" style={styles.button}>
//                                     Log In
//                                 </button>
//                             </form>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }
// const styles = {
//     form: {
//         maxWidth: '400px',
//         margin: '0 auto',
//         padding: '20px',
//         // border: '1px solid #ccc',
//         // borderRadius: '5px',
//         // backgroundColor: '#f9f9f9',
//     },
//     formGroup: {
//         marginBottom: '15px',
//     },
//     label: {
//         display: 'block',
//         marginBottom: '5px',
//         fontWeight: 'bold',
//     },
//     input: {
//         width: '100%',
//         padding: '8px',
//         boxSizing: 'border-box',
//         borderRadius: '4px',
//         border: '1px solid #ccc',
//     },
//     button: {
//         width: '100%',
//         padding: '10px',
//         border: 'none',
//         borderRadius: '4px',
//         backgroundColor: '#007bff',
//         color: '#fff',
//         fontSize: '16px',
//         cursor: 'pointer',
//     },
// };
// export default Login;
// import './Login.css';
// import { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import Header from '../Header/Header';

// function Login() {
//     const [user, setUser] = useState({
//         username: "",
//         password: "",
//         captcha: "",
//     });
//     const [showPassword, setShowPassword] = useState(false);
//     const [captchaImg, setCaptchaImg] = useState('');
//     const navigate = useNavigate();

//     // Fetch captcha image
//     const fetchCaptcha = async () => {
//         try {
//             const res = await fetch('http://localhost:8000/api/generate-captcha/',
//                 {credentials: 'include',}
//             );

//             const data = await res.json();
//             setCaptchaImg(data.captcha_image);
//         } catch (error) {
//             console.error("Error fetching CAPTCHA:", error);
//         }
//     };

//     useEffect(() => {
//         fetchCaptcha();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUser((prevUser) => ({
//             ...prevUser,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         fetch("http://localhost:8000/api/signin/", {
//             method: "POST",
//             credentials: 'include',
//             body: JSON.stringify(user),
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         })
//         .then((res) => {
//             if (!res.ok) {
//                 throw new Error("Invalid credentials");
//             }
//             return res.json();
//         })
//         .then((data) => {
//             const { user, access } = data;
//             localStorage.setItem("token", access);
//             localStorage.setItem("user_details", JSON.stringify(user));

//             const isReception = user?.is_recptionstaff;
//             const isCandidate = user?.is_candiate;

//             if (isReception) {
//                 navigate("/reception-dashboard");
//             } else if (isCandidate) {
//                 navigate("/public-dashboard");
//             } else {
//                 navigate("/");
//             }
//         })
//         .catch(() => {
//             alert("Check your Username or Password");
//             fetchCaptcha(); // Reload CAPTCHA on error
//         });
//     };

//     return (
//         <div className="login-container">
//             <Header />

//             <h2>Visitor Monitoring System</h2>

//             <div className="login-content">
//                 <div className="form-container">
//                     <div className="logo-wrapper" onClick={() => navigate('/')}>
//                         <img
//                             src="https://upload.wikimedia.org/wikipedia/commons/6/60/Firefox_Home_-_logo.png"
//                             alt="logo"
//                             className="login-logo"
//                         />
//                     </div>

//                     <div className="admitcard">
//                         <form onSubmit={handleSubmit} className="login-form">
//                             <div className="form-group">
//                                 <label htmlFor="username">User Name:</label>
//                                 <input
//                                     type="text"
//                                     id="username"
//                                     name="username"
//                                     value={user.username}
//                                     onChange={handleChange}
//                                     required
//                                     className="input-field"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="password">Password:</label>
//                                 <input
//                                     type={showPassword ? "text" : "password"}
//                                     id="password"
//                                     name="password"
//                                     value={user.password}
//                                     onChange={handleChange}
//                                     required
//                                     className="input-field"
//                                 />
//                                 <div className="show-password">
//                                     <input
//                                         type="checkbox"
//                                         onChange={() => setShowPassword(!showPassword)}
//                                     /> Show Password
//                                 </div>
//                             </div>

//                             <div className="forgot-password-link">
//                                 <Link to="/forgot-password">Forgot Password?</Link>
//                             </div>

//                             {captchaImg && (
//                                 <>
//                                     <img src={captchaImg} alt="CAPTCHA" className="captcha-img" />
//                                     <input
//                                         type="text"
//                                         name="captcha"
//                                         placeholder="Enter CAPTCHA"
//                                         value={user.captcha}
//                                         onChange={handleChange}
//                                         required
//                                         className="input-field"
//                                     />
//                                 </>
//                             )}

//                             <button type="submit" className="login-button">
//                                 Log In
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Login;
import './Login.css';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Header/Header';

function Login() {
    const [user, setUser] = useState({ username: "", password: "", captcha: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [captchaImg, setCaptchaImg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const fetchCaptcha = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/generate-captcha/', {
                credentials: 'include',
            });
            const data = await res.json();
            setCaptchaImg(data.captcha_image);
        } catch (error) {
            console.error("CAPTCHA fetch error:", error);
        }
    };

    useEffect(() => {
        fetchCaptcha();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setErrorMsg("");

    //     try {
    //         const res = await fetch("http://localhost:8000/api/signin/", {
    //             method: "POST",
    //             credentials: 'include',
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(user),
    //         });

    //         if (!res.ok) {
    //             const errorData = await res.json();
    //             throw new Error(errorData.detail || "Login failed");
    //         }

    //         const data = await res.json();
    //         const { user: userData, access } = data;

    //         localStorage.setItem("token", access);
    //         localStorage.setItem("user_details", JSON.stringify(userData));

    //         if (userData?.is_recptionstaff) {
    //             navigate("/reception-dashboard");
    //         } else if (userData?.is_candiate) {
    //             navigate("/public-dashboard");
    //         } else if (userData?.is_superuser || userData?.is_staff) {
    //             navigate("/admindasboard");
    //         }
    //         if{
    //             navigate("/");
    //         }
    //     } catch (err) {
    //         setErrorMsg(err.message);
    //         fetchCaptcha();
    //     }
    // };
const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
        const res = await fetch("http://localhost:8000/api/signin/", {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Login failed");
        }

        const data = await res.json();
        const { user: userData, access } = data;

        localStorage.setItem("token", access);
        localStorage.setItem("user_details", JSON.stringify(userData));

        if (userData?.is_recptionstaff) {
            navigate("/reception-dashboard");
        } else if (userData?.is_candiate) {
            navigate("/public-dashboard");
        } else if (userData?.is_superuser || userData?.is_staff) {
            navigate("/admindasboard");
        } else {
            navigate("/");  // fallback for any other user
        }

    } catch (err) {
        setErrorMsg(err.message);
        fetchCaptcha();
    }
};
    return (
        <>
            <Header />
            <div className="login-container">

                <h2>Visitor Monitoring System</h2>

                <div className="login-content">
                    <div className="form-container"
                        style={{
                            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(239, 68, 68, 0.1) 100%)',
                            padding: '1.5rem 0'
                        }}
                    >
                        <div className="logo-wrapper" onClick={() => navigate('/')}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/6/60/Firefox_Home_-_logo.png"
                                alt="logo"
                                className="login-logo"
                            />
                        </div>

                        {errorMsg && <div className="error-message">{errorMsg}</div>}

                        <form onSubmit={handleSubmit} id="loginForm">
                            <div className="form-control-group">
                                <label className="form-label" htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="form-control"
                                    value={user.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-control-group password-container">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    value={user.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="eye-button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title="Show/Hide Password"
                                >
                                    👁️
                                </button>
                            </div>

                            <div className="forgot-password-link">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>

                            {captchaImg && (
                                <>
                                    <img src={captchaImg} alt="CAPTCHA" className="captcha-img" />
                                    <div style={{ textAlign: "center" }}>
                                        <button type="button" 
                                        className="refresh-captcha"
                                        onClick={fetchCaptcha}>
                                            🔄 Refresh CAPTCHA
                                        </button>
                                    </div>
                                    <div className="form-control-group">
                                        <label className="form-label">Enter CAPTCHA</label>
                                        <input
                                            type="text"
                                            name="captcha"
                                            className="form-control"
                                            value={user.captcha}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <button type="submit" className="loginbutton">
                                Log In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
