import MainContainer from '../../MainContainer';
import './ListPage.css';
import '../../App.css'
import SearchBox from '../../components/SearchBox';
import { apiFetch } from '../../services/apiClient';
import { getCurrentUser } from '../../services/authClient';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const DEPT_PAGE_SIZE = 20;
const DEPT_ALLOWED_SORT_COLUMNS = ['department_name'];

const deptGetPageFromParams = (params) => {
  const value = Number.parseInt(params.get('page') || '1', 10);
  return Number.isNaN(value) || value < 1 ? 1 : value;
};

const deptGetSortFromParams = (params) => {
  const value = params.get('sort') || 'department_name';
  return DEPT_ALLOWED_SORT_COLUMNS.includes(value) ? value : 'department_name';
};

const deptGetOrderFromParams = (params) => {
  return params.get('order') === 'DESC' ? 'DESC' : 'ASC';
};

const deptGetKeywordFromParams = (params) => {
  return params.get('keyword') ?? '';
};

export default function DepartmentList() {
  const navigate = useNavigate();
  const [backendData, setBackendData] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const loadDepartments = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        keyword: deptGetKeywordFromParams(searchParams),
        page: String(deptGetPageFromParams(searchParams)),
        sort: deptGetSortFromParams(searchParams),
        order: deptGetOrderFromParams(searchParams),
      });
      const response = await apiFetch(`/api/departments/search?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setBackendData(data);
      setHasNextPage(Array.isArray(data) && data.length === DEPT_PAGE_SIZE);
    } catch (err) {
      console.error('Failed to load departments:', err);
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

    if (!DEPT_ALLOWED_SORT_COLUMNS.includes(nextParams.get('sort'))) {
      nextParams.set('sort', 'department_name');
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

    loadDepartments();
  }, [searchParams, setSearchParams, loadDepartments]);

  const handleSubmit = (queryParams) => {
    const nextParams = new URLSearchParams(searchParams);
    const nextKeyword = queryParams.keyword ?? '';

    nextParams.set('keyword', nextKeyword);
    nextParams.set('page', '1');
    nextParams.set('sort', deptGetSortFromParams(searchParams));
    nextParams.set('order', deptGetOrderFromParams(searchParams));

    setSearchParams(nextParams);
  }

  const checkBackendData = () => {
    return Array.isArray(backendData) && backendData.length > 0;
  }

  const handleSort = (column) => {
    const nextParams = new URLSearchParams(searchParams);
    const currentSort = deptGetSortFromParams(searchParams);
    const currentOrder = deptGetOrderFromParams(searchParams);

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
    if (deptGetSortFromParams(searchParams) !== column) return '';
    return deptGetOrderFromParams(searchParams) === 'ASC' ? ' ▲' : ' ▼';
  };

  return (
    <MainContainer>
      <h2>Department List</h2>

      <SearchBox onSearch={handleSubmit} />

      <div className='list-table'>
        {backendData === null ? (
          <p>Loading</p>
        ) : checkBackendData() ? (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('department_name')} className='sortable-header'>Department{getSortIndicator('department_name')}</th>
                <th>Head</th>
                <th>Courses</th>
              </tr>
            </thead>
            <tbody>
              {backendData.map((d) => (
                <tr 
                  className={isAdmin ? 'list-row--clickable' : ''}
                  key={d.department_id} 
                  onClick={isAdmin ? () => navigate(`/departments/${d.department_id}`) : undefined}
                  title={isAdmin ? `Click to navigate to Edit form for Department ${d.department_name}` : 'Only admins can edit records'}
                  >
                  <td>{d.department_name}</td>
                  <td>{d.ins_fname ? `${d.ins_fname} ${d.ins_lname}` : 'Unassigned'}</td>
                  <td>{d.course_count ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No departments found</p>
        )
        }
      </div>

      <div className='pagination-controls'>
        <button type='button' onClick={() => {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set('page', String(Math.max(1, deptGetPageFromParams(searchParams) - 1)));
          setSearchParams(nextParams);
        }} disabled={deptGetPageFromParams(searchParams) === 1}>
          Previous
        </button>
        <span>Page {deptGetPageFromParams(searchParams)}</span>
        <button type='button' onClick={() => {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set('page', String(deptGetPageFromParams(searchParams) + 1));
          setSearchParams(nextParams);
        }} disabled={!hasNextPage}>
          Next
        </button>
      </div>

    </MainContainer>
  );
}
