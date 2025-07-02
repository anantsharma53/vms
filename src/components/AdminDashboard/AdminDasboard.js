import React, { useState, useEffect } from 'react';
import './AdminDasboard.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom'
import Menubar from '../HeaderMenu/HeaderMenu';
import AdminComplaints from '../AdminComplaints/AdminComplaints';
import AdminSidePanel from '../AdminSidePanel/AdminSidePanel';
import AdminDefaultDashboard from '../AdminDefaultDashboard/AdminDefaultDashboard';
import UserProfile from '../Profile/Profile';
import UpdatePassword from '../PasswordUpdate/PasswordUpdate';
import UserManagement from '../UserManagement/UserManagement';
import ApplicantList from '../Allaplication/Allaplication';
import DepartmentManagement from '../DepartmentManagement/DepartmentManagement';
import SuperAdminComplaintsView from '../SuperAdminComplaintsView/SuperAdminComplaintsView';
import SolvedComplaints from '../SolvedComplaints/SolvedComplaints';
// import ApplicantList from '../Allaplication/Allaplication';
const AdminDashboard = () => {
    const [selectedMenu, setSelectedMenu] = useState('menu-item-1');
    const [isSessionExpired, setSessionExpired] = useState(false);
    const [totalForms, setTotalForms] = useState(0);
    const [applicationsPerPost, setApplicationsPerPost] = useState({});
    const [error, setError] = useState(null);
 
useEffect(() => {
    const fetchJobApplicationsCount = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch('http://127.0.0.1:8000/api/job-applications/count/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include auth token if required
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setTotalForms(data.total_applications); // Set total applications count
        setApplicationsPerPost(data.applications_per_post); // Set applications count per post
      } catch (error) {
        setError(error.message);
      }
    };

    fetchJobApplicationsCount();
  }, []);  
let navigate = useNavigate();
  const handlePrintApplication = () => {
    // Logic to handle application printing
     navigate('/applicantList')
    
    console.log('Print application');
  };

  const handleOtherAction = () => {
    // Logic for another action 
    navigate('/dashboard')
    console.log('Other action');
  };

  const renderContent = () => {
    if (isSessionExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('user_details');
      navigate('/sessionexpires');
    }

    switch (selectedMenu) {
      case 'menu-item-1':
        return <AdminDefaultDashboard/>;
      case 'menu-item-2':
        return <UserProfile/>;
      case 'menu-item-3':
        return <UpdatePassword/>;
      case 'menu-item-4':
        return <AdminComplaints/>;
      case 'menu-item-5':
        return <AdminDefaultDashboard/>;
      case 'menu-item-6':
        return <SolvedComplaints/>;
        // return (
        //   <div style={{ alignItems: 'center' }}>
        //     <ApplicantProfile />
        //     <button onClick={handlePrint} style={{ marginLeft: '25%', width: '50%' }}>
        //       Print
        //     </button>
        //   </div>
        // );
      case 'menu-item-8':
        return <UserManagement/>;
      case 'menu-item-9':
        return <AdminDefaultDashboard/>;
      case 'menu-item-10':
        return <AdminDefaultDashboard/>;
      case 'menu-item-11':
          return <ApplicantList/>;    
      case 'menu-item-12':
          return <DepartmentManagement/>;   
      case 'menu-item-13':
          return <SuperAdminComplaintsView/>;
      default:
        return <AdminDefaultDashboard/>;
    }
  };
  const handleMenuClick = (menuItem) => {
    setSelectedMenu(menuItem);
  };
  return (
    <>
  

    <div className="layout-container ">
      <Header className="no-print" />
      <Menubar className="no-print" />
      <div className="main-content">
        
        <AdminSidePanel onMenuClick={handleMenuClick} className="side-panel" />
        <div className="content">{renderContent()}</div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
