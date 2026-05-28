import MainContainer from '../MainContainer';
import StudentCourses from '../components/StudentCourses'
import InstructorCourses from '../components/InstructorCourses';
import './list_pages/ListPage.css';
import '../App.css'
import { apiFetch } from '../services/apiClient';
import { getCurrentUser } from '../services/authClient';
import { useUser } from '../context/UserContext';

import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ViewCourses() {
  const { user } = useUser();
  const location = useLocation();
  const [backendData, setBackendData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // Extracted loader so other actions (delete) can refresh the list

  const isInstructorRoute = location.pathname.startsWith('/instructors/');

  const loadCourses = useCallback(async () => {
    try {
      const response = await apiFetch(`/api/students/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setBackendData(data);
    } catch (err) {
      console.error('Failed to load students:', err);
      setBackendData([]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    getCurrentUser().then((user) => {
      if (!mounted) return;
      setIsAdmin(user?.role === 'admin');
    }).catch(() => {
      if (!mounted) return;
      setIsAdmin(false);
    });

    return () => { mounted = false; };
  }, []);

  return (
    <MainContainer>
      <h2>Courses</h2>
      {(isInstructorRoute) ? (<InstructorCourses />) : (<StudentCourses />)}
    </MainContainer>
  );
}