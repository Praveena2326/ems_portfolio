import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import './EmployeeForm.css';

const emptyForm = {
  employee_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  gender: '',
  date_of_birth: '',
  address: '',
  department: '',
  designation: '',
  date_joined: '',
  salary: '',
  status: 'ACTIVE',
};

export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/departments/').then((res) => setDepartments(res.data.results || res.data));
    api.get('/designations/').then((res) => setDesignations(res.data.results || res.data));
    if (isEdit) {
      api.get(`/employees/${id}/`).then((res) => setForm(res.data));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/employees/${id}/`, form);
      } else {
        await api.post('/employees/', form);
      }
      showToast(isEdit ? 'Employee details updated.' : 'Employee profile created.');
      navigate('/employees');
    } catch (err) {
      if (err.response?.data) setErrors(err.response.data);
      else showToast('Could not save this employee. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDesignations = designations.filter(
    (d) => !form.department || String(d.department) === String(form.department)
  );

  const fieldError = (name) =>
    errors[name] && <div className="employee-form__error">{errors[name]}</div>;

  return (
    <div className="employee-form-page">
      <div className="employee-form__header">
        <div>
          <p className="employee-form__eyebrow">Employees / {isEdit ? 'Edit profile' : 'New profile'}</p>
          <h2>{isEdit ? 'Edit employee' : 'Add a new employee'}</h2>
          <p className="employee-form__intro">
            {isEdit ? 'Update this employee’s details and employment information.' : 'Create a complete employee profile in a few quick steps.'}
          </p>
        </div>
        <div className="employee-form__step">1 of 1 <span>Employee profile</span></div>
      </div>

      <form className="employee-form" onSubmit={handleSubmit}>
        <section className="employee-form__section">
          <div className="employee-form__section-heading">
            <span className="employee-form__section-number">01</span>
            <div>
              <h3>Basic information</h3>
              <p>Use the employee’s official name and contact details.</p>
            </div>
          </div>
          <div className="employee-form__grid">
            <div className="employee-form__field">
              <label htmlFor="employee_id">Employee ID <em>*</em></label>
              <input id="employee_id" name="employee_id" placeholder="e.g. EMP-1042" value={form.employee_id} onChange={handleChange} required />
              {fieldError('employee_id')}
            </div>
            <div className="employee-form__field">
              <label htmlFor="status">Employment status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>
            <div className="employee-form__field">
              <label htmlFor="first_name">First name <em>*</em></label>
              <input id="first_name" name="first_name" autoComplete="given-name" value={form.first_name} onChange={handleChange} required />
              {fieldError('first_name')}
            </div>
            <div className="employee-form__field">
              <label htmlFor="last_name">Last name <em>*</em></label>
              <input id="last_name" name="last_name" autoComplete="family-name" value={form.last_name} onChange={handleChange} required />
              {fieldError('last_name')}
            </div>
            <div className="employee-form__field">
              <label htmlFor="email">Work email <em>*</em></label>
              <input id="email" type="email" name="email" autoComplete="email" placeholder="name@company.com" value={form.email} onChange={handleChange} required />
              {fieldError('email')}
            </div>
            <div className="employee-form__field">
              <label htmlFor="phone">Phone number</label>
              <input id="phone" name="phone" autoComplete="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
              {fieldError('phone')}
            </div>
          </div>
        </section>

        <section className="employee-form__section">
          <div className="employee-form__section-heading">
            <span className="employee-form__section-number">02</span>
            <div>
              <h3>Employment details</h3>
              <p>Set the role, start date, and current compensation.</p>
            </div>
          </div>
          <div className="employee-form__grid">
            <div className="employee-form__field">
              <label htmlFor="department">Department</label>
              <select id="department" name="department" value={form.department || ''} onChange={handleChange}>
                <option value="">Select department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              {fieldError('department')}
            </div>
            <div className="employee-form__field">
              <label htmlFor="designation">Designation</label>
              <select id="designation" name="designation" value={form.designation || ''} onChange={handleChange}>
                <option value="">Select designation</option>
                {filteredDesignations.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
              {fieldError('designation')}
            </div>
            <div className="employee-form__field">
              <label htmlFor="date_joined">Joining date <em>*</em></label>
              <input id="date_joined" type="date" name="date_joined" value={form.date_joined || ''} onChange={handleChange} required />
              {fieldError('date_joined')}
            </div>
            <div className="employee-form__field">
              <label htmlFor="salary">Annual salary</label>
              <div className="employee-form__money-input"><span>₹</span><input id="salary" type="number" min="0" step="0.01" name="salary" placeholder="0.00" value={form.salary} onChange={handleChange} /></div>
              {fieldError('salary')}
            </div>
          </div>
        </section>

        <section className="employee-form__section">
          <div className="employee-form__section-heading">
            <span className="employee-form__section-number">03</span>
            <div>
              <h3>Personal details</h3>
              <p>Optional information to complete the employee profile.</p>
            </div>
          </div>
          <div className="employee-form__grid">
            <div className="employee-form__field">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={form.gender || ''} onChange={handleChange}>
                <option value="">Prefer not to say</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div className="employee-form__field">
              <label htmlFor="date_of_birth">Date of birth</label>
              <input id="date_of_birth" type="date" name="date_of_birth" value={form.date_of_birth || ''} onChange={handleChange} />
              {fieldError('date_of_birth')}
            </div>
            <div className="employee-form__field employee-form__field--full">
              <label htmlFor="address">Address</label>
              <textarea id="address" name="address" rows="3" placeholder="Street, city, state, postal code" value={form.address || ''} onChange={handleChange} />
              {fieldError('address')}
            </div>
          </div>
        </section>

        {errors.non_field_errors && <div className="employee-form__form-error">{errors.non_field_errors}</div>}

        <div className="employee-form__actions">
          <button type="button" className="employee-form__cancel" onClick={() => navigate('/employees')}>Cancel</button>
          <button className="employee-form__submit" disabled={submitting}>
            {submitting ? 'Saving employee…' : isEdit ? 'Save changes' : 'Create employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
