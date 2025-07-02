import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import './ReceptionDashboard.css';
import SidePanel from '../SidePanel/SidePanel';
import { useNavigate } from 'react-router-dom';
import JobApplicationForm from '../JobForm/JobFrom';
import ImageSignatureForm from '../UploadFile/UploadFile';
import jwtDecode from 'jwt-decode';
import Menubar from '../HeaderMenu/HeaderMenu';
import SideApplicantList from '../SidePannelApli/SidePannelApli';
import VleDefaultDashboard from '../VleDefaultDashboard/VleDefaultDashboard';
import AddComplaint from '../AddComplaint/AddComplaint';
import UserProfile from '../Profile/Profile';
import UpdatePassword from '../PasswordUpdate/PasswordUpdate';
import DisplayComplaints from '../DisplayComplaints/DisplayComplaints';
import AdminSidePanel from '../AdminSidePanel/AdminSidePanel';
import WriteFeedback from '../VleFeedback/VleFeedback';
import AdminDefaultDashboard from '../AdminDefaultDashboard/AdminDefaultDashboard';
const ReceptionDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('menu-item-1');
  const [isSessionExpired, setSessionExpired] = useState(false);
//   const user_details = localStorage.getItem('user_details');
  const navigate = useNavigate();
//   useEffect(()=>{
//     const user_details =  localStorage.getItem('user_details');
//     if (!token) {
//       navigate('/');
//     }
//   }, []);
  
  const handleMenuClick = (menuItem) => {
    setSelectedMenu(menuItem);
  };

  const handlePrint = () => {
    const sidePanel = document.querySelector('.side-panel');
    sidePanel.classList.add('show-side-panel');
    window.print();
    sidePanel.classList.remove('show-side-panel');
  };

  useEffect(() => {
    // Check if the token is expired
    const isTokenExpired = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          return decodedToken.exp < currentTime;
        } catch (error) {

          return true;
        }
      }

      return true;
    };

    // Redirect to login page if token is expired
    setSessionExpired(isTokenExpired());
  }, [selectedMenu]);

  const renderContent = () => {
    if (isSessionExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('user_details');
      navigate('/sessionexpires');
    }

    switch (selectedMenu) {
      case 'menu-item-1':
        return <AdminDefaultDashboard />;
      case 'menu-item-2':
        return <UserProfile />;
      case 'menu-item-3':
        return <UpdatePassword/>;
      case 'menu-item-4':
        return <AddComplaint/>;
      case 'menu-item-5':
        return <DisplayComplaints/>;
      case 'menu-item-6':
        return <WriteFeedback/>;
      case 'menu-item-7':
        return <JobApplicationForm/>;
        // return (
        //   <div style={{ alignItems: 'center' }}>
        //     <ApplicantProfile />
        //     <button onClick={handlePrint} style={{ marginLeft: '25%', width: '50%' }}>
        //       Print
        //     </button>
        //   </div>
        // );
      default:
        return <AdminDefaultDashboard />;
    }
  };

  return (
    <div className="layout-container ">
      <Header className="no-print" />
      <Menubar className="no-print" />
      <div className="main-content">
        <SidePanel  onMenuClick={handleMenuClick} className="side-panel" />
        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
