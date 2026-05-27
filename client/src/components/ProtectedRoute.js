import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authClient';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    getCurrentUser().then((user) => {
      if (!mounted) return;

      setAuthed(!!user);
      setChecking(false);
    }).catch(() => {
      if (!mounted) return;

      setAuthed(false);
      setChecking(false);
    });
    return () => { mounted = false; };
  }, []);

  if (checking) return null;

  if (!authed) return <Navigate to='/login' replace state={{ from: location }} />;
  
  return children;
}