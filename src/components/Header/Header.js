import './Header.css'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
function Header() {
    let token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    
    
    const handleLogout = (e) => {
        e.preventDefault();
        // Remove the token from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('user_details');
        // Redirect to the login page
        navigate('/admin');
    };
    const handlehome=(e)=>{
        e.preventDefault();
        navigate('/admindasboard');
    }
    return (
        <>
            <nav className="no-print" >
                <div className="logo" >
                    <a style={{ textDecoration: 'none', color: 'black' }}
                        href="https://jamtara.nic.in/" title="Go to home" class="emblem" rel="home">
                        <img class="site_logo"
                            height="80" id="logo"
                            src="https://cdn.s3waas.gov.in/s313f320e7b5ead1024ac95c3b208610db/uploads/2020/09/2020091221.jpg"
                            alt="" />

                        <p style={{ marginTop: '15px' }}>
                            <strong>&nbsp;&nbsp;जिला जामताड़ा</strong>
                            <br></br>
                            <strong>&nbsp;&nbsp;DISTRICT JAMTARA</strong>
                        </p>
                    </a>
                    
                    <p style={{ marginTop: '15px' }}>
                        <strong>Welcome to Online Visitors&nbsp;
                        </strong>
                        <br></br>
                        <strong>and Complaint Management System &nbsp; 
                            {/* {token ?
                            <button onClick={handleLogout} className='logout'>Logout</button> :
                            null} */}
                        &nbsp;</strong>
                    </p>


                 </div>
                 
                 <hr style={{ margin: '0' }} /> 
                {/*
                                <button onClick={handlehome}
                                style={{
                                    margin: '15px',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'background-color 0.3s ease'
                                  }}
                                  onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                                  onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                                >Home</button>
                <hr style={{ margin: '0' }} /> */}

            </nav>



        </>
    );
}
export default Header;
