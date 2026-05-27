import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import './EditPage.css';

const initialFormData = {
  instructor_code: '',
  first_name: '',
  last_name: '',
  email: '',
  department_id: '',
};

export default function InstructorEdit() {
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
        const resp = await fetch(`/api/instructors/${id}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        setFormData({
          instructor_code: data.instructor_code ?? '',
          first_name: data.first_name ?? '',
          last_name: data.last_name ?? '',
          email: data.email ?? '',
          department_id: data.department_id ?? '',
        });
        setInitialData({
          instructor_code: data.instructor_code ?? '',
          first_name: data.first_name ?? '',
          last_name: data.last_name ?? '',
          email: data.email ?? '',
          department_id: data.department_id ?? '',
        });
      } catch (err) {
        console.error('Failed to load instructor:', err);
        setError('Failed to load instructor.');
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
      const resp = await fetch(`/api/instructors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData }),
      });
      if (!resp.ok) {
        const p = await resp.json().catch(() => ({}));
        throw new Error(p.message || `HTTP ${resp.status}`);
      }

      navigate('/instructors');
    } catch (err) {
      console.error('Failed to update instructor:', err);
      setError(err.message || 'Failed to update instructor.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setError('');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this instructor record?')) return;
    setDeleting(true);
    setError('');

    try {
      const resp = await fetch(`/api/instructors/delete/${id}`);
      if (!resp.ok) {
        const p = await resp.json().catch(() => ({}));
        throw new Error(p.message || `HTTP ${resp.status}`);
      }
      navigate('/instructors');
    } catch (err) {
      console.error('Failed to delete instructor:', err);
      setError(err.message || 'Failed to delete instructor.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <BackButton previous_screen='/instructors' />
      <div className='edit'>
        <div className='edit-container'>
          <h2>Edit Instructor</h2>

          {loading ? (
            <p>Loading instructor...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='instructor_code'>Instructor Code</label>
                <input id='instructor_code' name='instructor_code' value={formData.instructor_code} onChange={handleChange} required autoFocus />
              </div>

              <div className='form-group'>
                <label htmlFor='first_name'>First Name</label>
                <input id='first_name' name='first_name' value={formData.first_name} onChange={handleChange} required />
              </div>

              <div className='form-group'>
                <label htmlFor='last_name'>Last Name</label>
                <input id='last_name' name='last_name' value={formData.last_name} onChange={handleChange} required />
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input id='email' name='email' type='email' value={formData.email} onChange={handleChange} required />
              </div>

              <div className='form-group'>
                <label htmlFor='department_id'>Department ID</label>
                <input id='department_id' name='department_id' value={formData.department_id} onChange={handleChange} />
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
