import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        // Extract session_id from URL hash
        const hash = location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const sessionId = params.get('session_id');

        if (!sessionId) {
          console.error('No session_id in URL');
          navigate('/');
          return;
        }

        // Exchange session_id for session_token
        const response = await axios.post(
          `${API}/auth/session`,
          { session_id: sessionId },
          { withCredentials: true }
        );

        const userData = response.data.user;
        
        // Navigate to home with user data
        navigate('/', { state: { user: userData }, replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/');
      }
    };

    processSession();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;