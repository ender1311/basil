// src/components/Login.js
/*
import React from 'react';
//import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();
  
  
  const onSuccess = (response) => {
    console.log('Login Success:', response.profileObj);
    localStorage.setItem('userData', JSON.stringify(response.profileObj));
    navigate('/');
  };

  const onFailure = (response) => {
    console.log('Login Failed:', response);
  };

  return (
    <div className="login-container">
      <h2>Login with Google</h2>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
}
*/