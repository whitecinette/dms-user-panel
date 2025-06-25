import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import './style.scss';

const EmailVerifyPage = () => {
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const verifyEmail = async () => {
    try {
      setIsLoading(true);
      const token = new URLSearchParams(location.search).get('token');
      
      if (!token) {
        setVerificationStatus('error');
        setMessage('Verification token is missing');
        return;
      }

      const response = await axios.get(`${config.backend_url}/verify-email`, {
        params: { token }
      });

      setVerificationStatus('success');
      setMessage(response.data.message || 'Email verified successfully!');
      

    } catch (error) {
      setVerificationStatus('error');
      setMessage(error.response?.data?.message || 'Email verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="email-verify-container">
      <div className="verify-card">
        <div className="verify-header">
          <h1>Email Verification</h1>
          {verificationStatus === 'pending' && (
            <p>Please verify your email address to continue</p>
          )}
        </div>

        <div className={`verify-content ${verificationStatus}`}>
          {verificationStatus === 'pending' && (
            <button 
              className="verify-button"
              onClick={verifyEmail}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          )}

          {(verificationStatus === 'success' || verificationStatus === 'error') && (
            <div className="status-message">
              <span className="status-icon">
                {verificationStatus === 'success' ? '✓' : '✗'}
              </span>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerifyPage;