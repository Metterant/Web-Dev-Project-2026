import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import './EditPage.css';

const initialFormData = {
  student_code: '',
  first_name: '',
  last_name: '',
  dob: '',
  major: '',
  admission_year: '',
  email: '',
};

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [initialStudentData, setInitialStudentData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setFormData({
          student_code: data.student_code ?? '',
          first_name: data.first_name ?? '',
          last_name: data.last_name ?? '',
          dob: data.dob ?? '',
          major: data.major ?? '',
          admission_year: data.admission_year ?? '',
          email: data.email ?? '',
        });
        setInitialStudentData({
          student_code: data.student_code ?? '',
          first_name: data.first_name ?? '',
          last_name: data.last_name ?? '',
          dob: data.dob ?? '',
          major: data.major ?? '',
          admission_year: data.admission_year ?? '',
          email: data.email ?? '',
        });
      } catch (err) {
        console.error('Failed to load student:', err);
        setError('Failed to load student record.');
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          admission_year: Number(formData.admission_year),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || `HTTP ${response.status}`);
      }

      navigate('/students');
    } catch (err) {
      console.error('Failed to update student:', err);
      setError(err.message || 'Failed to update student.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(initialStudentData);
    setError('');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this student record?')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/students/delete/${id}`);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || `HTTP ${response.status}`);
      }

      navigate('/students');
    } catch (err) {
      console.error('Failed to delete student:', err);
      setError(err.message || 'Failed to delete student.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <BackButton previous_screen='/students' />
      <div className='edit'>
        <div className='edit-container'>
          <h2>Edit Student</h2>

          {loading ? (
            <p>Loading student data...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='student_code'>Student Code</label>
                <input
                  type='text'
                  id='student_code'
                  name='student_code'
                  value={formData.student_code}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className='form-group'>
                <label htmlFor='first_name'>First Name</label>
                <input
                  type='text'
                  id='first_name'
                  name='first_name'
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='last_name'>Last Name</label>
                <input
                  type='text'
                  id='last_name'
                  name='last_name'
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='dob'>Date of Birth</label>
                <input
                  type='date'
                  id='dob'
                  name='dob'
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='major'>Major</label>
                <input
                  type='text'
                  id='major'
                  name='major'
                  value={formData.major}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='admission_year'>Admission Year</label>
                <input
                  type='number'
                  id='admission_year'
                  name='admission_year'
                  min='1900'
                  max='2100'
                  value={formData.admission_year}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {error ? <p className='edit-error'>{error}</p> : null}

              <div className='edit-actions'>
                <button className='edit-container__button edit-container__button--secondary' type='button' onClick={handleReset} disabled={saving || deleting}>
                  Reset
                </button>

                <button className='edit-container__button' type='submit' disabled={saving || deleting}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>

                <button className='edit-container__button edit-container__button--danger' type='button' onClick={handleDelete} disabled={saving || deleting}>
                  {deleting ? 'Deleting...' : 'Delete Record'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
