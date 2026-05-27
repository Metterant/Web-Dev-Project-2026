import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import './EditPage.css';

const initialFormData = {
  department_name: '',
};

export default function DepartmentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [initialData, setInitialData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch(`/api/departments/${id}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        setFormData({ department_name: data.department_name ?? '' });
        setInitialData({ department_name: data.department_name ?? '' });
      } catch (err) {
        console.error('Failed to load department:', err);
        setError('Failed to load department.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((cur) => ({ ...cur, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const resp = await fetch(`/api/departments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!resp.ok) {
        const p = await resp.json().catch(() => ({}));
        throw new Error(p.message || `HTTP ${resp.status}`);
      }

      navigate('/departments');
    } catch (err) {
      console.error('Failed to update department:', err);
      setError(err.message || 'Failed to update department.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setError('');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this department record?')) return;
    setDeleting(true);
    setError('');

    try {
      const resp = await fetch(`/api/departments/delete/${id}`);
      if (!resp.ok) {
        const p = await resp.json().catch(() => ({}));
        throw new Error(p.message || `HTTP ${resp.status}`);
      }
      navigate('/departments');
    } catch (err) {
      console.error('Failed to delete department:', err);
      setError(err.message || 'Failed to delete department.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <BackButton previous_screen='/departments' />
      <div className='edit'>
        <div className='edit-container'>
          <h2>Edit Department</h2>

          {loading ? (
            <p>Loading department...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='department_name'>Department Name</label>
                <input id='department_name' name='department_name' value={formData.department_name} onChange={handleChange} required autoFocus />
              </div>

              {error ? <p className='edit-error'>{error}</p> : null}

              <div className='edit-actions'>
                <button className='edit-container__button edit-container__button--secondary' type='button' onClick={handleReset} disabled={saving || deleting}>Reset</button>
                <button className='edit-container__button' type='submit' disabled={saving || deleting}>{saving ? 'Saving...' : 'Save Changes'}</button>
                <button className='edit-container__button edit-container__button--danger' type='button' onClick={handleDelete} disabled={saving || deleting}>{deleting ? 'Deleting...' : 'Delete Record'}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
