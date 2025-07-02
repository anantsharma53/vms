import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function SessionExpired() {
const navigate=useNavigate()
  function onSubmithandel(){
  navigate('/')
}
  return (
    <div className='login-container'>
      <div className='login-content'>
        <div style={{display:'flex',flexDirection:'column'}}>
        <h2>your SessionExpired please relogin</h2>
          <button onClick={onSubmithandel}>Login</button>
        </div>         
      </div>
    </div>

        
    );
}