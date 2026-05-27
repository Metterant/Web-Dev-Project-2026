import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authClient';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    getCurrentUser().then((currentUser) => {
      if (!mounted) return;

      setUser(currentUser);
      setAuthed(!!currentUser);
      setChecking(false);
    }).catch(() => {
      if (!mounted) return;

      setUser(null);
      setAuthed(false);
      setChecking(false);
    });
    return () => { mounted = false; };
  }, []);

  if (checking) return null;

  if (!authed) return <Navigate to='/login' replace state={{ from: location }} />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to='/' replace />;
  }
  
  return children;
}