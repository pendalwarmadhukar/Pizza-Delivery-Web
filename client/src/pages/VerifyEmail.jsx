import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
        setStatus('Email verified successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setStatus(err.response?.data?.msg || 'Verification failed. Link may be invalid or expired.');
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="auth-container">
      <div className="glass-card text-center">
        <h2>Email Verification</h2>
        <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>{status}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
