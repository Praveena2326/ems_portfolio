import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, SearchIcon, TrashIcon, UserIcon } from '../components/icons';
import './EmployeeList.css';

const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const fetchEmployees = useCallback(() => {
    setLoading(true);
    setError(false);
    api.get('/employees/', { params: { search: search || undefined, page, status: statusFilter || undefined, department: departmentFilter || undefined } })
      .then((res) => {
        setEmployees(res.data.results || res.data);
        setCount(res.data.count ?? res.data.length);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [search, page, statusFilter, departmentFilter]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
  useEffect(() => { api.get('/departments/').then((res) => setDepartments(res.data.results || res.data)).catch(() => {}); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/employees/${deleteTarget.id}/`);
      showToast(`${deleteTarget.full_name} was removed.`);
      setDeleteTarget(null);
      fetchEmployees();
    } catch {
      showToast('Could not delete this employee. Please try again.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.max(Math.ceil(count / 10), 1);
  const clearFilters = () => { setSearch(''); setStatusFilter(''); setDepartmentFilter(''); setPage(1); };

  return (
    <div className="app-page employee-list-page">
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">People directory</p>
          <h1>Employees</h1>
          <p className="page-header__description">Find people, update their details, and keep employment records current.</p>
        </div>
        <Link to="/employees/new" className="button button--primary"><span aria-hidden="true">+</span> Add employee</Link>
      </header>

      <section className="surface employee-directory">
        <div className="employee-toolbar">
          <div className="employee-search"><SearchIcon /><input aria-label="Search employees" placeholder="Search name, ID, email or phone" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} /></div>
          <select aria-label="Filter by department" value={departmentFilter} onChange={(e) => { setPage(1); setDepartmentFilter(e.target.value); }}>
            <option value="">All departments</option>
            {departments.map((department) => <option value={department.id} key={department.id}>{department.name}</option>)}
          </select>
          <select aria-label="Filter by status" value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}>
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On leave</option>
            <option value="TERMINATED">Terminated</option>
          </select>
          {(search || statusFilter || departmentFilter) && <button className="employee-toolbar__clear" onClick={clearFilters}>Clear</button>}
        </div>

        <div className="employee-directory__summary"><strong>{count}</strong> {count === 1 ? 'employee' : 'employees'} found</div>

        {loading ? <div className="loading-block">Loading employees…</div> : error ? (
          <div className="empty-state"><div><span className="empty-state__icon"><UserIcon /></span><h3>Couldn’t load employees</h3><p>Check your connection and try again.</p><button className="button button--secondary employee-retry" onClick={fetchEmployees}>Retry</button></div></div>
        ) : employees.length === 0 ? (
          <div className="empty-state"><div><span className="empty-state__icon"><UserIcon /></span><h3>No employees found</h3><p>{search || statusFilter || departmentFilter ? 'Try changing or clearing your filters.' : 'Add your first employee to start building the directory.'}</p></div></div>
        ) : (
          <div className="employee-table-wrap">
            <table className="employee-table">
              <thead><tr><th>Employee</th><th>Employee ID</th><th>Department</th><th>Designation</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td><div className="employee-identity"><span>{initials(employee.full_name)}</span><div><strong>{employee.full_name}</strong><small>{employee.email}</small></div></div></td>
                    <td><span className="employee-id">{employee.employee_id}</span></td>
                    <td>{employee.department_name || <span className="employee-muted">Not assigned</span>}</td>
                    <td>{employee.designation_title || <span className="employee-muted">Not assigned</span>}</td>
                    <td><span className={`status-badge status-badge--${employee.status.toLowerCase()}`}>{employee.status.replace('_', ' ').toLowerCase()}</span></td>
                    <td><div className="employee-actions"><Link to={`/employees/${employee.id}/edit`} title="Edit employee"><EditIcon /> Edit</Link><button title="Delete employee" onClick={() => setDeleteTarget(employee)}><TrashIcon /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && count > 0 && (
          <div className="employee-pagination">
            <span>Page <strong>{page}</strong> of {totalPages}</span>
            <div><button aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}><ChevronLeftIcon /></button><button aria-label="Next page" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}><ChevronRightIcon /></button></div>
          </div>
        )}
      </section>

      {deleteTarget && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="delete-employee-title">
            <h3 id="delete-employee-title">Delete {deleteTarget.full_name}?</h3>
            <p>This permanently removes their employee profile and associated leave requests. This action cannot be undone.</p>
            <div className="dialog__actions"><button className="button button--secondary" onClick={() => setDeleteTarget(null)}>Cancel</button><button className="button button--danger" disabled={deleting} onClick={handleDelete}>{deleting ? 'Deleting…' : 'Delete employee'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
