import React, { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { BuildingIcon, TrashIcon, UserIcon } from '../components/icons';
import './Departments.css';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { showToast } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api.get('/departments/')
      .then((res) => setDepartments(res.data.results || res.data))
      .catch(() => showToast('Could not load departments.', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post('/departments/', { name: name.trim(), description: description.trim() });
      showToast(`${name.trim()} department created.`);
      setName(''); setDescription(''); load();
    } catch (err) {
      setError(err.response?.data?.name?.[0] || 'Could not create this department.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/departments/${deleteTarget.id}/`);
      showToast(`${deleteTarget.name} department deleted.`);
      setDeleteTarget(null); load();
    } catch { showToast('Could not delete this department.', 'error'); }
  };

  return (
    <div className="app-page departments-page">
      <header className="page-header">
        <div><p className="page-header__eyebrow">Organization structure</p><h1>Departments</h1><p className="page-header__description">Create teams and see how your workforce is distributed.</p></div>
        <span className="departments-count"><BuildingIcon /> {departments.length} {departments.length === 1 ? 'department' : 'departments'}</span>
      </header>

      <div className="departments-layout">
        <form className="surface department-create" onSubmit={handleAdd}>
          <span className="department-create__icon"><BuildingIcon /></span>
          <h2>Create department</h2>
          <p>Add a team before assigning designations and employees to it.</p>
          <div className="field"><label htmlFor="department-name">Department name</label><input id="department-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Product Design" required />{error && <div className="field-error">{error}</div>}</div>
          <div className="field"><label htmlFor="department-description">Description <span>Optional</span></label><textarea id="department-description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this team own?" /></div>
          <button className="button button--primary" disabled={submitting}>{submitting ? 'Creating…' : 'Create department'}</button>
        </form>

        <section className="surface department-list">
          <div className="department-list__header"><div><h2>All departments</h2><p>Employee totals update automatically.</p></div></div>
          {loading ? <div className="loading-block">Loading departments…</div> : departments.length === 0 ? (
            <div className="empty-state"><div><span className="empty-state__icon"><BuildingIcon /></span><h3>No departments yet</h3><p>Use the form to create your organization’s first department.</p></div></div>
          ) : (
            <div className="department-items">
              {departments.map((department) => (
                <article className="department-item" key={department.id}>
                  <span className="department-item__icon"><BuildingIcon /></span>
                  <div className="department-item__body"><h3>{department.name}</h3><p>{department.description || 'No description added'}</p></div>
                  <span className="department-item__people"><UserIcon /> {department.employee_count}</span>
                  <button className="department-item__delete" aria-label={`Delete ${department.name}`} onClick={() => setDeleteTarget(department)}><TrashIcon /></button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {deleteTarget && <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setDeleteTarget(null)}><div className="dialog" role="dialog" aria-modal="true"><h3>Delete {deleteTarget.name}?</h3><p>Its designations will be deleted. Existing employees will remain, but their department and designation will be cleared.</p><div className="dialog__actions"><button className="button button--secondary" onClick={() => setDeleteTarget(null)}>Cancel</button><button className="button button--danger" onClick={handleDelete}>Delete department</button></div></div></div>}
    </div>
  );
}
