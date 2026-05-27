import MainContainer from '../../MainContainer';
import './ListPage.css';
import '../../App.css'
import SearchBox from '../../components/SearchBox';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PAGE_SIZE = 20;
const ALLOWED_SORT_COLUMNS = ['course_code', 'course_name', 'credits', 'department_id', 'day_of_week', 'start_period', 'end_period'];

const getPageFromParams = (params) => {
  const value = Number.parseInt(params.get('page') || '1', 10);
  return Number.isNaN(value) || value < 1 ? 1 : value;
};

const getSortFromParams = (params) => {
  const value = params.get('sort') || 'student_code';
  return ALLOWED_SORT_COLUMNS.includes(value) ? value : 'student_code';
};

const getOrderFromParams = (params) => {
  return params.get('order') === 'DESC' ? 'DESC' : 'ASC';
};

const getKeywordFromParams = (params) => {
  return params.get('keyword') ?? '';
};

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
  const [searchParams, setSearchParams] = useSearchParams();

  const loadCourses = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        keyword: getKeywordFromParams(searchParams),
        page: String(getPageFromParams(searchParams)),
        sort: getSortFromParams(searchParams),
        order: getOrderFromParams(searchParams),
      });
      const response = await fetch(`/api/courses/search?${params.toString()}`);
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
    nextParams.set('sort', getSortFromParams(searchParams));
    nextParams.set('order', getOrderFromParams(searchParams));

    setSearchParams(nextParams);
  }

  const checkBackendData = () => {
    return Array.isArray(backendData) && backendData.length > 0;
  }

  const handleDelete = async (courseId) => {
    try {
      const resp = await fetch(`/api/courses/delete/${courseId}`);
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${resp.status}`);
      }

      await loadCourses();
      alert('Course record deleted');
    } catch (err) {
      console.error('Delete failed:', err);
      alert(`Delete failed: ${err.message}`);
    }
  }

  const handleSort = (column) => {
    const nextParams = new URLSearchParams(searchParams);
    const currentSort = getSortFromParams(searchParams);
    const currentOrder = getOrderFromParams(searchParams);

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
    if (getSortFromParams(searchParams) !== column) return '';
    return getOrderFromParams(searchParams) === 'ASC' ? ' ▲' : ' ▼';
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
                  key={course.course_id} 
                  onClick={() => navigate(`/courses/${course.course_id}`)}
                  title={`Click to navigate to Edit form for Course ${course.course_code}`}
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
          nextParams.set('page', String(Math.max(1, getPageFromParams(searchParams) - 1)));
          setSearchParams(nextParams);
        }} disabled={getPageFromParams(searchParams) === 1}>
          Previous
        </button>
        <span>Page {getPageFromParams(searchParams)}</span>
        <button type='button' onClick={() => {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set('page', String(getPageFromParams(searchParams) + 1));
          setSearchParams(nextParams);
        }} disabled={!hasNextPage}>
          Next
        </button>
      </div>

    </MainContainer>
  );
}