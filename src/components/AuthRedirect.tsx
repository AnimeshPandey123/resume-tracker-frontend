import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL as string;

const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // No token, go to landing page
        return navigate('/');
      }

      try {
        const res = await fetch(`${API_URL}/api/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });

        if (res.ok) {
          // Valid token, proceed to home
        //   navigate('/home');
        } else {
          // Invalid token, fallback to landing
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (err) {
        console.error('Auth check failed', err);
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  return <Outlet />; // can wrap this around child routes if needed
};

export default AuthRedirect;
