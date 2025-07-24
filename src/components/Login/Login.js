import './Login.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import AdmitCardSearchForm from '../AdmitCardSearch/AdmitCardSearch';
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
    };

    return <span className={className}>{icons[name] || "•"}</span>;
};
function Login() {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    let navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    // const handleRegistration = () => {
    //     navigate('/register');
    // };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleSignupVisibility = () => {
        setShowSignup(!showSignup);
    };

    const handleSubmit = (e) => {
        console.log(user)
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
                    return res.json();
                } else if (res.status === 400) {
                    alert("Login Error");
                    throw new Error("Unauthorized request");
                } else {
                    throw new Error("Something went wrong");
                }
            })
            .then((data) => {
                const { user, access } = data;
                localStorage.setItem("token", access);
                localStorage.setItem("tokenExpiration", access);
                localStorage.setItem("user_details", JSON.stringify(user));
                const users = JSON.parse(localStorage.getItem("user_details"));
                const iscandiate = users?.is_candiate;
                const isreception = users?.is_recptionstaff;
                if (isreception) {
                    navigate("/reception-dashboard");
                } else if (iscandiate) {
                    navigate("/public-dashboard");
                } else {
                    navigate("/");
                }
            })
            .catch((err) => {
                alert("Check your Username Or Password");
                console.error(err);
            });
    };

    return (
        <>
            <div className="login-container" >

                <Header />

                <h2>Visitor Monitoring System</h2>
                <h2>Reception Login</h2>
                <div className="login-content">


                    <div className="form-container"
                        style={{
                            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(239, 68, 68, 0.1) 100%)',
                            padding: '1.5rem 0'
                        }}
                    >
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
                        {/* <div className="information">
                            <h2>Important Informations</h2>
                            <ol>
                                <li style={{ padding: "12px" }}> नागरिक अनुभाग </li>
                            </ol>
                            <div style={{ width: "300px", color: "red", textAlign: "justify" }}>
                                <p>
                                    नोट:-  लॉगिन करने के लिए नागरिक अपना रजिस्ट्रेशन करे ।
                                </p>
                                <button onClick={handleRegistration} style={styles.button}>
                                    Click Here To Register
                                </button>
                            </div>
                        </div> */}

                        <div className="admitcard">

                            <form onSubmit={handleSubmit} style={styles.form}>
                                <div style={styles.formGroup}>
                                    <label htmlFor="username">User Name:</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={user.username}
                                        onChange={handleChange}
                                        required
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={user.password}
                                        onChange={handleChange}
                                        required
                                        style={styles.input}
                                    />
                                </div>
                                <div className="forgot-password-link" style={{ marginTop: '10px', textAlign: 'right' }}>
                                <Link to="/forgot-password" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                                    Forgot Password?
                                </Link>
                            </div>
                                <button type="submit" style={styles.button}>
                                    Log In
                                </button>
                            </form>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const styles = {
    form: {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        // border: '1px solid #ccc',
        // borderRadius: '5px',
        // backgroundColor: '#f9f9f9',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '8px',
        boxSizing: 'border-box',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        width: '100%',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
    },
};
export default Login;