import '../pages/list_pages/ListPage.css';
import '../App.css'
import { apiFetch } from '../services/apiClient';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';

import { useEffect, useState, useCallback } from 'react';

export default function StudentCourses() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [backendData, setBackendData] = useState(null);
  const canAccessRoute = (user?.role === 'admin' || user?.role === 'instructor') || (user?.role === 'student' && String(user?.student_id) === String(id));

  const loadCourses = useCallback(async () => {
    try {
      const endpoint = `/api/students/${id}/courses`;

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

  const semHelper = (semester) => {
    let startYear = Number(semester.slice(0, 4));
    let sem = Number(semester.slice(4));
    let suffices = ['st', 'nd', 'rd', 'th'];
    let suffix = '';

    if (sem > 3)
      suffix = suffices.at(3);
    else suffix = suffices[sem - 1];

    return `${startYear}-${startYear + 1} ${sem}${suffix} Semester`;
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
              <th>Semester</th>
              <th>Grade</th>
              <th>Credits</th>
            </tr>
          </thead>
          <tbody>
            {backendData.map((course) => (
              <tr
                className=''
                key={course.enrollment_id}
              >
                <td>{course.course_code}</td>
                <td>{course.course_name}</td>
                <td>{semHelper(course.semester)}</td>
                <td>{course.grade}</td>
                <td>{course.credits}</td>
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