import React from 'react';
import './CSS/LoginSignup.css';
import signup_img from '../Components/Assets/signup_icon.jpg'

function LoginSignup() {
  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <div className="loginsignup-content">
          <div className="loginsignup-image">
            <img src={signup_img} alt="" />
          </div>
          <div className="loginsignup-form">
            <h1>Sign Up</h1>
            <div className="lofinsignup-fields">
              <input type='text' placeholder='Your name' />
              <input type='email' placeholder='Email' />
              <input type='password' placeholder='Password' />
            </div>
            <button>Continue</button>
            <p className='loginsignup-login'>Already have an account? <span>Login Here</span></p>
            <div className="loginsignup-agree">
              <input type='checkbox' name='' id='' />
              <p>By Continuing, I agree to the terms of use & privacy policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
