import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import './Dashboard.css';
import SidePanel from '../SidePanel/SidePanel';
import { useNavigate } from 'react-router-dom';
import JobApplicationForm from '../JobForm/JobFrom';
import ImageSignatureForm from '../UploadFile/UploadFile';
import ApplicantProfile from '../Displayform/Displayform';
import jwtDecode from 'jwt-decode';
import FormPreview from '../FormPre/FormPre';
import SessionExpired from '../SessionExpired/SessionExpired';
import Menubar from '../HeaderMenu/HeaderMenu';
import SideApplicantList from '../SidePannelApli/SidePannelApli';
const Layout = () => {
  const [selectedMenu, setSelectedMenu] = useState('menu-item-1');
  const [isSessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

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
        return <JobApplicationForm />;
      case 'menu-item-2':
        return <ImageSignatureForm />;
      case 'menu-item-3':
        return <SideApplicantList/>;
        // return (
        //   <div style={{ alignItems: 'center' }}>
        //     <ApplicantProfile />
        //     <button onClick={handlePrint} style={{ marginLeft: '25%', width: '50%' }}>
        //       Print
        //     </button>
        //   </div>
        // );
      default:
        return null;
    }
  };

  return (
    <div className="layout-container ">
      <Header className="no-print" />
      <Menubar className="no-print" />
      <div className="main-content">
        <SidePanel onMenuClick={handleMenuClick} className="side-panel " />
        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Layout;
