// SidePanel.jsx

import './AdminSidePanel.css'
import React, { useState, useEffect } from "react";
import AdminDefaultDashboard from '../AdminDefaultDashboard/AdminDefaultDashboard';
const AdminSidePanel = ({ onMenuClick }) => {
  const [departments, setDepartments] = useState([]);
  const user_details = JSON.parse(localStorage.getItem('user_details') || '{}');
  console.log(user_details)

const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/departments/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching departments");
    }
  };
  useEffect(() => {
      
      fetchDepartments();
    }, []);
    const getDepartmentNameFromList = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept ? dept.name : "—";
  };
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
            Department Name : {getDepartmentNameFromList(user_details.department)}
            </li>
            <li onClick={() => onMenuClick('menu-item-2')}>Profile </li>
            <li onClick={() => onMenuClick('menu-item-3')}>Password Reset </li>
            {/* Conditional rendering for superadmin */}
          {user_details.is_superuser === true && (
            <>
              <li onClick={() => onMenuClick('menu-item-12')}>Manage Department</li>
              <li onClick={() => onMenuClick('menu-item-8')}>Manage Users</li>
              <li onClick={() => onMenuClick('menu-item-9')}>System Settings</li>
              <li onClick={() => onMenuClick('menu-item-13')}>View All Dept.Complaint </li>
              <li onClick={() => onMenuClick('menu-item-10')}>Audit Logs</li>
            </>
          )}
          {user_details.is_staff === true && (
            <>
              {/* <li onClick={() => onMenuClick('menu-item-11')}>JharSewa Applications</li> */}
              <li onClick={() => onMenuClick('menu-item-4')}>View Complaints </li>
              
            </>
          )}
            
            <li onClick={() => onMenuClick('menu-item-5')}>Complaint Summary</li>
            <li onClick={() => onMenuClick('menu-item-6')}>Accepts Complaints</li>
            <li onClick={() => onMenuClick('menu-item-7')}>Contact Us</li>
            {/* <li onClick={() => onMenuClick('menu-item-1')}>Apply Application Part I</li>
            <li onClick={() => onMenuClick('menu-item-2')}>Apply Application Part II</li>
            <li onClick={() => onMenuClick('menu-item-3')}>Print Application</li> */}
            {/* Add more menu items as needed */}
          </ul>
        </nav>
        
      </aside>
    );
  };
  
  export default AdminSidePanel;

