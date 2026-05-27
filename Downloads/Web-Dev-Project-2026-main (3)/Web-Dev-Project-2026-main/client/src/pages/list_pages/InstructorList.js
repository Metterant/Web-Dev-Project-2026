import MainContainer from '../../MainContainer';
import './ListPage.css';
import '../../App.css'
import SearchBox from '../../components/SearchBox';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const INSTRUCTOR_PAGE_SIZE = 20;
const INSTRUCTOR_ALLOWED_SORT_COLUMNS = ['instructor_code', 'first_name', 'last_name', 'email', 'department_name'];

const instructorGetPageFromParams = (params) => {
  const value = Number.parseInt(params.get('page') || '1', 10);
  return Number.isNaN(value) || value < 1 ? 1 : value;
};

const instructorGetSortFromParams = (params) => {
  const value = params.get('sort') || 'instructor_code';
  return INSTRUCTOR_ALLOWED_SORT_COLUMNS.includes(value) ? value : 'instructor_code';
};

const instructorGetOrderFromParams = (params) => {
  return params.get('order') === 'DESC' ? 'DESC' : 'ASC';
};

const instructorGetKeywordFromParams = (params) => {
  return params.get('keyword') ?? '';
};

export default function InstructorList() {
  const navigate = useNavigate();
  const [backendData, setBackendData] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const loadInstructors = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        keyword: instructorGetKeywordFromParams(searchParams),
        page: String(instructorGetPageFromParams(searchParams)),
        sort: instructorGetSortFromParams(searchParams),
        order: instructorGetOrderFromParams(searchParams),
      });
      const response = await fetch(`/api/instructors/search?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setBackendData(data);
      setHasNextPage(Array.isArray(data) && data.length === INSTRUCTOR_PAGE_SIZE);
    } catch (err) {
      console.error('Failed to load instructors:', err);
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

    if (!INSTRUCTOR_ALLOWED_SORT_COLUMNS.includes(nextParams.get('sort'))) {
      nextParams.set('sort', 'instructor_code');
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

    loadInstructors();
  }, [searchParams, setSearchParams, loadInstructors]);

  const handleSubmit = (queryParams) => {
    const nextParams = new URLSearchParams(searchParams);
    const nextKeyword = queryParams.keyword ?? '';

    nextParams.set('keyword', nextKeyword);
    nextParams.set('page', '1');
    nextParams.set('sort', instructorGetSortFromParams(searchParams));
    nextParams.set('order', instructorGetOrderFromParams(searchParams));

    setSearchParams(nextParams);
  }

  const checkBackendData = () => {
    return Array.isArray(backendData) && backendData.length > 0;
  }

  const handleSort = (column) => {
    const nextParams = new URLSearchParams(searchParams);
    const currentSort = instructorGetSortFromParams(searchParams);
    const currentOrder = instructorGetOrderFromParams(searchParams);

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
    if (instructorGetSortFromParams(searchParams) !== column) return '';
    return instructorGetOrderFromParams(searchParams) === 'ASC' ? ' ▲' : ' ▼';
  };

  return (
    <MainContainer>
      <h2>Instructor List</h2>

      <SearchBox onSearch={handleSubmit} />

      <div className='list-table'>
        {backendData === null ? (
          <p>Loading</p>
        ) : checkBackendData() ? (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('instructor_code')} className='sortable-header'>Instructor Code{getSortIndicator('instructor_code')}</th>
                <th onClick={() => handleSort('first_name')} className='sortable-header'>First name{getSortIndicator('first_name')}</th>
                <th onClick={() => handleSort('last_name')} className='sortable-header'>Last name{getSortIndicator('last_name')}</th>
                <th onClick={() => handleSort('email')} className='sortable-header'>Email{getSortIndicator('email')}</th>
                <th onClick={() => handleSort('department_name')} className='sortable-header'>Department{getSortIndicator('department_name')}</th>
              </tr>
            </thead>
            <tbody>
              {backendData.map((ins) => (
                <tr
                  key={ins.instructor_id}
                  onClick={() => navigate(`/instructors/${ins.instructor_id}`)}
                  title={`Click to navigate to Edit form for Instructor ${ins.instructor_code}`}
                >
                  <td>{ins.instructor_code}</td>
                  <td>{ins.first_name}</td>
                  <td>{ins.last_name}</td>
                  <td>{ins.email}</td>
                  <td>{ins.department_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No instructors found</p>
        )
        }
      </div>

      <div className='pagination-controls'>
        <button type='button' onClick={() => {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set('page', String(Math.max(1, instructorGetPageFromParams(searchParams) - 1)));
          setSearchParams(nextParams);
        }} disabled={instructorGetPageFromParams(searchParams) === 1}>
          Previous
        </button>
        <span>Page {instructorGetPageFromParams(searchParams)}</span>
        <button type='button' onClick={() => {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set('page', String(instructorGetPageFromParams(searchParams) + 1));
          setSearchParams(nextParams);
        }} disabled={!hasNextPage}>
          Next
        </button>
      </div>

    </MainContainer>
  );
}
