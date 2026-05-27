import MainContainer from '../../MainContainer';
import './ListPage.css';
import '../../App.css'
import SearchBox from '../../components/SearchBox';
import { apiFetch } from '../../services/apiClient';
import { getCurrentUser } from '../../services/authClient';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PAGE_SIZE = 20;
const ALLOWED_SORT_COLUMNS = ['course_code', 'course_name', 'credits', 'department_id', 'day_of_week', 'start_period', 'end_period'];

const courseGetPageFromParams = (params) => {
  const value = Number.parseInt(params.get('page') || '1', 10);
  return Number.isNaN(value) || value < 1 ? 1 : value;
};

const courseGetSortFromParams = (params) => {
  const value = params.get('sort') || 'course_code';
  return ALLOWED_SORT_COLUMNS.includes(value) ? value : 'course_code';
};

const courseGetOrderFromParams = (params) => {
  return params.get('order') === 'DESC' ? 'DESC' : 'ASC';
};

const courseGetKeywordFromParams = (params) => {
  return params.get('keyword') ?? '';
};

export default function CourseList() {
  const navigate = useNavigate();
  const [backendData, setBackendData] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const loadCourses = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        keyword: courseGetKeywordFromParams(searchParams),
        page: String(courseGetPageFromParams(searchParams)),
        sort: courseGetSortFromParams(searchParams),
        order: courseGetOrderFromParams(searchParams),
      });
      const response = await apiFetch(`/api/courses/search?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setBackendData(data);
      setHasNextPage(Array.isArray(data) && data.length === PAGE_SIZE);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setBackendData([]);
      setHasNextPage(false);
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

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    let shouldReplace = false;

    if (!nextParams.has('keyword')) {
      nextParams.set('keyword', '');
      shouldReplace = true;
    }

    if (!nextParams.get('page') || Number.parseInt(nextParams.get('page'), 10) < 1) {
      nextParams.set('page', '1');
      shouldReplace = true;
    }

    if (!ALLOWED_SORT_COLUMNS.includes(nextParams.get('sort'))) {
      nextParams.set('sort', 'course_code');
      shouldReplace = true;
    }

    if (nextParams.get('order') !== 'ASC' && nextParams.get('order') !== 'DESC') {
      nextParams.set('order', 'ASC');
      shouldReplace = true;
    }

    if (shouldReplace) {
      setSearchParams(nextParams, { replace: true });
      return;
    }

    loadCourses();
  }, [searchParams, setSearchParams, loadCourses]);

  const handleSubmit = (queryParams) => {
    const nextParams = new URLSearchParams(searchParams);
    const nextKeyword = queryParams.keyword ?? '';

    nextParams.set('keyword', nextKeyword);
    nextParams.set('page', '1');
    nextParams.set('sort', courseGetSortFromParams(searchParams));
    nextParams.set('order', courseGetOrderFromParams(searchParams));

    setSearchParams(nextParams);
  }

  const checkBackendData = () => {
    return Array.isArray(backendData) && backendData.length > 0;
  }

  const handleSort = (column) => {
    const nextParams = new URLSearchParams(searchParams);
    const currentSort = courseGetSortFromParams(searchParams);
    const currentOrder = courseGetOrderFromParams(searchParams);

    nextParams.set('page', '1');

    if (currentSort === column) {
      nextParams.set('sort', column);
      nextParams.set('order', currentOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      nextParams.set('sort', column);
      nextParams.set('order', 'ASC');
    }

    setSearchParams(nextParams);
  };

  const getSortIndicator = (column) => {
    if (courseGetSortFromParams(searchParams) !== column) return '';
    return courseGetOrderFromParams(searchParams) === 'ASC' ? ' ▲' : ' ▼';
  };

  return (
    <MainContainer>
      <h2>Course List</h2>

      <SearchBox onSearch={handleSubmit} />

      <div className='list-table'>
        {backendData === null ? (
          <p>Loading</p>
        ) : checkBackendData() ? (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('course_code')} className='sortable-header'>Course Code{getSortIndicator('course_code')}</th>
                <th onClick={() => handleSort('course_name')} className='sortable-header'>Course Name{getSortIndicator('course_name')}</th>
                <th onClick={() => handleSort('credits')} className='sortable-header'>Credits{getSortIndicator('credits')}</th>
                <th onClick={() => handleSort('department_id')} className='sortable-header'>Department{getSortIndicator('department_id')}</th>
                <th>Instructor</th>
                <th onClick={() => handleSort('start_period')} className='sortable-header'>Start{getSortIndicator('start_period')}</th>
                <th onClick={() => handleSort('end_period')} className='sortable-header'>End{getSortIndicator('end_period')}</th>
                <th>Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {backendData.map((course) => (
                <tr 
                  className={isAdmin ? 'list-row--clickable' : ''}
                  key={course.course_id} 
                  onClick={isAdmin ? () => navigate(`/courses/${course.course_id}`) : undefined}
                  title={isAdmin ? `Click to navigate to Edit form for Course ${course.course_code}` : 'Only admins can edit records'}
                  >
                  <td>{course.course_code}</td>
                  <td>{course.course_name}</td>
                  <td>{course.credits}</td>
                  <td>{course.department_name}</td>
                  <td>{course.instructor_code ? `${course.instructor_code} (${course.ins_fname} ${course.ins_lname})` : ''}</td>
                  <td>{course.start_period}</td>
                  <td>{course.end_period}</td>
                  <td>{course.enrollment_count ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No courses found</p>
        )
        }
      </div>

      <div className='pagination-controls'>
        <button type='button' onClick={() => {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set('page', String(Math.max(1, courseGetPageFromParams(searchParams) - 1)));
          setSearchParams(nextParams);
        }} disabled={courseGetPageFromParams(searchParams) === 1}>
          Previous
        </button>
        <span>Page {courseGetPageFromParams(searchParams)}</span>
        <button type='button' onClick={() => {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set('page', String(courseGetPageFromParams(searchParams) + 1));
          setSearchParams(nextParams);
        }} disabled={!hasNextPage}>
          Next
        </button>
      </div>

    </MainContainer>
  );
}