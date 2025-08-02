import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './components/Login/Login';
import Sign from './components/SignUp/Sign';
import Layout from './components/Dashboard/Dashboard';
import SessionExpired from './components/SessionExpired/SessionExpired';
import AdminLogin from './components/Admin/Admin';
import Admindasboard from './components/AdminDashboard/AdminDasboard';
import VleLayout from './components/VleDashboard/VleDashboard';
import HomeNew from './components/HomeNew/HomeNew';
import ReceptionDashboard from './components/ReceptionDashboard/ReceptionDashboard';
import ComplaintReceipt from './components/ComplaintReceipt/ComplaintReceipt';
import UnderConstruction from './components/UnderConstruction/UnderConstruction';
import ComplaintDetails from './components/ComplainDetail/ComplaintDetails';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';

function App() {
  return (

    <BrowserRouter>
      <Routes>
      <Route path='/register' element={<Sign />} />
        <Route path='/reception' element={<Login />} />
        <Route path='/' element={<HomeNew />} />
        <Route path='/public' element={<Login/>}/>
        <Route path='/reception-dashboard' element={<VleLayout />} />
        <Route path='/public-dashboard' element={<VleLayout />} />
        <Route path='/dashboard' element={<Layout />} />
        <Route path='/officer' element={<Login />} />
        <Route path='/sessionexpires' element={<SessionExpired/>}/>
        <Route path='/admindasboard' element={<Admindasboard/>}/>
        <Route path='/complaintreceipt' element={<ComplaintReceipt/>}/>
        <Route path="/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
