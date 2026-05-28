import '../pages/list_pages/ListPage.css';
import '../App.css'
import { apiFetch } from '../services/apiClient';
import { useUser } from '../context/UserContext';
import { useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';

import { useEffect, useState, useCallback } from 'react';

export default function InstructorCourse() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [backendData, setBackendData] = useState(null);
  // Ownership-authorization
  const canAccessRoute = (user?.role === 'admin') || (user?.role === 'instructor' && String(user?.instructor) === String(id));

  const loadCourses = useCallback(async () => {
    try {
      const endpoint = `/api/instructors/${id}/courses`;

      const response = await apiFetch(endpoint);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setBackendData(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setBackendData([]);
    }
  }, [id]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    if (!canAccessRoute) {
      navigate('/', { replace: true });
      return;
    }

    loadCourses();
  }, [canAccessRoute, loading, user, navigate, location, loadCourses]);

  if (loading || !user) {
    return <p>Loading</p>;
  }

  if (!canAccessRoute) {
    return <Navigate to='/' replace />;
  }

  const checkBackendData = () => {
    return Array.isArray(backendData) && backendData.length > 0;
  }

  return (
    <div className='list-table'>
      {backendData === null ? (
        <p>Loading</p>
      ) : checkBackendData() ? (
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {backendData.map((course) => (
              <tr
                className=''
                key={course.course_code}
              >
                <td>{course.course_code}</td>
                <td>{course.course_name}</td>
                <td>{course.credits}</td>
                <td>{course.department_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Courses found</p>
      )
      }
    </div>
  );
}