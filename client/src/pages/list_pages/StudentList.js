import MainContainer from '../../MainContainer';
import './ListPage.css';
import '../../App.css'
import SearchBox from '../../components/SearchBox';
import { apiFetch } from '../../services/apiClient';
import { getCurrentUser } from '../../services/authClient';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PAGE_SIZE = 20;
const ALLOWED_SORT_COLUMNS = ['student_code', 'first_name', 'last_name', 'dob', 'major', 'admission_year', 'email'];

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

export default function StudentList() {
  const navigate = useNavigate();
  const [backendData, setBackendData] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  // Extracted loader so other actions (delete) can refresh the list
  const loadStudents = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        keyword: getKeywordFromParams(searchParams),
        page: String(getPageFromParams(searchParams)),
        sort: getSortFromParams(searchParams),
        order: getOrderFromParams(searchParams),
      });
      const response = await apiFetch(`/api/students/search?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setBackendData(data);
      setHasNextPage(Array.isArray(data) && data.length === PAGE_SIZE);
    } catch (err) {
      console.error('Failed to load students:', err);
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
      nextParams.set('sort', 'student_code');
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

    // load students (kept here so initial param normalization can happen first)
    loadStudents();
  }, [searchParams, setSearchParams, loadStudents]);

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
      <h2>Student List</h2>

      <SearchBox onSearch={handleSubmit}>
        {/* <select name="department">
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Science">Science</option>
          <option value="Arts">Arts</option>
        </select> */}
      </SearchBox>

      <div className='list-table'>
        {backendData === null ? (
          <p>Loading</p>
        ) : checkBackendData() ? (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('student_code')} className='sortable-header'>Student Code{getSortIndicator('student_code')}</th>
                <th onClick={() => handleSort('first_name')} className='sortable-header'>First name{getSortIndicator('first_name')}</th>
                <th onClick={() => handleSort('last_name')} className='sortable-header'>Last name{getSortIndicator('last_name')}</th>
                <th onClick={() => handleSort('dob')} className='sortable-header'>Date of Birth{getSortIndicator('dob')}</th>
                <th onClick={() => handleSort('major')} className='sortable-header'>Major{getSortIndicator('major')}</th>
                <th onClick={() => handleSort('admission_year')} className='sortable-header'>Admission Year{getSortIndicator('admission_year')}</th>
                <th onClick={() => handleSort('email')} className='sortable-header'>Email{getSortIndicator('email')}</th>
              </tr>
            </thead>
            <tbody>
              {backendData.map((student) => (
                <tr 
                  className={isAdmin ? 'list-row--clickable' : ''}
                  key={student.student_id} 
                  onClick={isAdmin ? () => navigate(`/students/${student.student_id}`) : undefined}
                  title={isAdmin ? `Click to navigate to Edit form for Student with Student Code ${student.student_code}` : 'Only admins can edit records'}
                  >
                  <td>{student.student_code}</td>
                  <td>{student.first_name}</td>
                  <td>{student.last_name}</td>
                  <td>{student.dob}</td>
                  <td>{student.major}</td>
                  <td>{student.admission_year}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students found</p>
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