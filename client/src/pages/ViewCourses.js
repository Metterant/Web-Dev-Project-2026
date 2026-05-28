import MainContainer from '../MainContainer';
import StudentCourses from '../components/StudentCourses'
import './list_pages/ListPage.css';
import '../App.css'
import { apiFetch } from '../services/apiClient';
import { getCurrentUser } from '../services/authClient';
import { useUser } from '../context/UserContext';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const STUDENT_COURSE_COLUMNS = ['student_code', 'first_name', 'last_name', 'dob', 'major', 'admission_year', 'email'];

export default function ViewCourses() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [backendData, setBackendData] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  // Extracted loader so other actions (delete) can refresh the list
  const loadStudents = useCallback(async () => {
    try {
      const response = await apiFetch(`/api/students/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setBackendData(data);
    } catch (err) {
      console.error('Failed to load students:', err);
      setBackendData([]);
    }
  }, [searchParams]);

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

  const checkBackendData = () => {
    return Array.isArray(backendData) && backendData.length > 0;
  }

  return (
    <MainContainer>
      <h2>Course List</h2>
      <StudentCourses />
      

    </MainContainer>
  );
}