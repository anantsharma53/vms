// SidePanel.jsx
import React from 'react';
import './SidePanel.css'
const SidePanel = ({ onMenuClick }) => {
  const user_details = JSON.parse(localStorage.getItem('user_details') || '{}');
    return (
      <aside className="side-panel no-print ">
        <img
                // src={user_details.profile_picture}
                src="https://i0.wp.com/static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg?ssl=1"
                alt="User profile picture"
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    marginLeft: '10px'
                }}
            />
            
        <nav>
          <ul>
            <li onClick={() => onMenuClick('menu-item-1')}>Welcome : {user_details.name} 
              <br></br> 
              User Name : {user_details.username} 
              <br></br>
              Dashboard
              </li>
            <li onClick={() => onMenuClick('menu-item-2')}>Profile </li>
            <li onClick={() => onMenuClick('menu-item-3')}>Password Reset </li>
            <li onClick={() => onMenuClick('menu-item-4')}>Add Complaint </li>
            <li onClick={() => onMenuClick('menu-item-5')}>View Complaint</li>
            <li onClick={() => onMenuClick('menu-item-6')}>Feedback</li>
            <li onClick={() => onMenuClick('menu-item-7')}>Jhar-Sewa Application</li>
            {/* <li onClick={() => onMenuClick('menu-item-1')}>Apply Application Part I</li>
            <li onClick={() => onMenuClick('menu-item-2')}>Apply Application Part II</li>
            <li onClick={() => onMenuClick('menu-item-3')}>Print Application</li> */}
            {/* Add more menu items as needed */}
          </ul>
        </nav>
      </aside>
    );
  };
  
  export default SidePanel;

