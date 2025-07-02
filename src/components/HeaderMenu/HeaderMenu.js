import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import jwtDecode from 'jwt-decode';
import './HeaderMenu.css';
function Menubar() {
    let token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        navigate('/');
    }

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);
    const handlehome = (e) => {
        e.preventDefault();
        navigate('/vledashboard');
    }
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const user_details = JSON.parse(localStorage.getItem('user_details') || '{}');

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    return (
        <nav className="" style={{ backgroundColor: '#f0f0f0' }}>
            <div className="no-print">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex' }}>
                        <p
                            style={{
                                margin: '15px',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                color: 'black',
                                fontSize: '16px',
                            }}
                        >Visitor Monitoring System</p>
                        {/* <p onClick={handlehome}
                            style={{
                                margin: '15px',
                                padding: '10px 20px',
                                border: 'none',
                                // borderRadius: '5px',
                                // backgroundColor: '#4CAF50',
                                color: 'black',
                                fontSize: '16px',
                                cursor: 'pointer',
                                // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                // transition: 'background-color 0.3s ease'
                            }}
                        // onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                        // onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                        >Home</p>
                        <p onClick={handlehome}
                            style={{
                                margin: '15px',
                                padding: '10px 20px',
                                border: 'none',
                                // borderRadius: '5px',
                                // backgroundColor: '#4CAF50',
                                color: 'black',
                                fontSize: '16px',
                                cursor: 'pointer',
                                // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                // transition: 'background-color 0.3s ease'
                            }}
                        // onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                        // onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                        >About</p>
                        <p onClick={handlehome}
                            style={{
                                margin: '15px',
                                padding: '10px 20px',
                                border: 'none',
                                // borderRadius: '5px',
                                // backgroundColor: '#4CAF50',
                                color: 'black',
                                fontSize: '16px',
                                cursor: 'pointer',
                                // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                // transition: 'background-color 0.3s ease'
                            }}
                        // onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                        // onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                        >Contact Us</p> */}
                    </div>
                    <div>
                        <p
                            style={{
                                margin: '15px',
                                padding: '10px 20px',
                                border: 'none',
                                // borderRadius: '5px',
                                // backgroundColor: '#4CAF50',
                                color: 'black',
                                fontSize: '16px',
                                cursor: 'pointer',
                                // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                // transition: 'background-color 0.3s ease'
                            }}
                            onClick={handleLogout}>
                            Logout
                        </p>
                    </div>
                    {/* <div className="dropdown-container">
                        <button onClick={toggleDropdown} className="dropdown-toggle">
                            {user_details.username || 'User'} &nbsp;&nbsp;
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/vledashboard" className="dropdown-item">Dashboard</Link>
                                <Link to={`/admin/edit-user/${user_details.id}`} className="dropdown-item">Edit User</Link>
                                <Link to={`/admin/view-user/${user_details.id}`} className="dropdown-item">View User</Link>
                                <Link to="/" className="dropdown-item" onClick={handleLogout}>Logout</Link>
                            </div>
                        )}

                    </div> */}
                </div>

            </div>



            <hr style={{ margin: '0' }} />
        </nav>

    );
};
export default Menubar;