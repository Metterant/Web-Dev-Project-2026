import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import './EditPage.css';
import { apiFetch } from '../../services/apiClient';
import { isValidCourseCode } from '../../utils/validationUtils';

const initialFormData = {
  course_code: '',
  course_name: '',
  credits: 0,
  department_id: '',
};

export default function CourseEdit() {
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
        const resp = await apiFetch(`/api/courses/${id}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        setFormData({
          course_code: data.course_code ?? '',
          course_name: data.course_name ?? '',
          credits: data.credits ?? 0,
          department_id: data.department_id ?? '',
        });
        setInitialData({
          course_code: data.course_code ?? '',
          course_name: data.course_name ?? '',
          credits: data.credits ?? 0,
          department_id: data.department_id ?? '',
        });
      } catch (err) {
        console.error('Failed to load course:', err);
        setError('Failed to load course.');
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
    // Client-side validation
    const validateForm = (data) => {
      if (!isValidCourseCode(data.course_code)) return 'Course code is invalid (expect letters then numbers).';
      if (!data.course_name || String(data.course_name).trim().length === 0) return 'Course name is required.';
      const credits = Number(data.credits);
      if (!Number.isInteger(credits) || credits < 0 || credits > 10) return 'Credits must be an integer between 0 and 10.';
      if (data.department_id !== '' && !Number.isInteger(Number(data.department_id))) return 'Department ID must be an integer.';
      return null;
    };

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      setSaving(false);
      return;
    }

    try {
      const resp = await apiFetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, credits: Number(formData.credits) }),
      });
      if (!resp.ok) {
        const p = await resp.json().catch(() => ({}));
        throw new Error(p.message || `HTTP ${resp.status}`);
      }

      navigate('/courses');
    } catch (err) {
      console.error('Failed to update course:', err);
      setError(err.message || 'Failed to update course.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setError('');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this course record?')) return;
    setDeleting(true);
    setError('');

    try {
      const resp = await apiFetch(`/api/courses/delete/${id}`);
      if (!resp.ok) {
        const p = await resp.json().catch(() => ({}));
        throw new Error(p.message || `HTTP ${resp.status}`);
      }
      navigate('/courses');
    } catch (err) {
      console.error('Failed to delete course:', err);
      setError(err.message || 'Failed to delete course.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <BackButton previous_screen='/courses' />
      <div className='edit'>
        <div className='edit-container'>
          <h2>Edit Course</h2>

          {loading ? (
            <p>Loading course...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='course_code'>Course Code</label>
                <input id='course_code' name='course_code' value={formData.course_code} onChange={handleChange} required autoFocus />
              </div>

              <div className='form-group'>
                <label htmlFor='course_name'>Course Name</label>
                <input id='course_name' name='course_name' value={formData.course_name} onChange={handleChange} required />
              </div>

              <div className='form-group'>
                <label htmlFor='credits'>Credits</label>
                <input id='credits' name='credits' type='number' min='0' value={formData.credits} onChange={handleChange} required />
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
