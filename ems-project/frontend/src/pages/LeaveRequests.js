import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  PlaneIcon,
  SendIcon,
  XCircleIcon,
} from '../components/icons';
import './LeaveRequests.css';

const emptyForm = { employee: '', leave_type: 'CASUAL', start_date: '', end_date: '', reason: '' };
const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const typeLabel = (type) => ({ SICK: 'Sick leave', CASUAL: 'Casual leave', EARNED: 'Earned leave', UNPAID: 'Unpaid leave' }[type] || type);
const readableDate = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    api.get('/leave-requests/')
      .then((res) => setLeaves(res.data.results || res.data))
      .catch(() => showToast('Could not load leave requests.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.get('/employees/').then((res) => setEmployees(res.data.results || res.data)).catch(() => showToast('Could not load employees.', 'error'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); setSubmitting(true);
    try {
      await api.post('/leave-requests/', form);
      setForm(emptyForm);
      showToast('Leave request submitted for review.');
      load();
    } catch (err) {
      if (err.response?.data) setErrors(err.response.data);
      else showToast('Could not submit this request.', 'error');
    } finally { setSubmitting(false); }
  };

  const confirmReview = async () => {
    if (!reviewTarget) return;
    setReviewing(true);
    try {
      await api.post(`/leave-requests/${reviewTarget.leave.id}/${reviewTarget.action}/`);
      showToast(`Leave request ${reviewTarget.action === 'approve' ? 'approved' : 'rejected'}.`);
      setReviewTarget(null); load();
    } catch { showToast('Could not update this leave request.', 'error'); }
    finally { setReviewing(false); }
  };

  const counts = useMemo(() => ({
    ALL: leaves.length,
    PENDING: leaves.filter((leave) => leave.status === 'PENDING').length,
    APPROVED: leaves.filter((leave) => leave.status === 'APPROVED').length,
    REJECTED: leaves.filter((leave) => leave.status === 'REJECTED').length,
  }), [leaves]);
  const visibleLeaves = filter === 'ALL' ? leaves : leaves.filter((leave) => leave.status === filter);

  const handleChange = (e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

  return (
    <div className="app-page leave-page">
      <header className="page-header">
        <div><p className="page-header__eyebrow">Time away</p><h1>Leave requests</h1><p className="page-header__description">Submit time off and keep approvals moving from one place.</p></div>
        <span className="leave-pending-summary"><ClockIcon /> {counts.PENDING} awaiting review</span>
      </header>

      <div className="leave-overview">
        <section className="surface leave-form-card">
          <div className="leave-section-heading"><span><PlaneIcon /></span><div><h2>New leave request</h2><p>Enter the dates and employee requesting time away.</p></div></div>
          <form onSubmit={handleSubmit}>
            <div className="leave-form-grid">
              <div className="field"><label htmlFor="leave-employee">Employee</label><select id="leave-employee" name="employee" value={form.employee} onChange={handleChange} required><option value="">Select employee</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.full_name} · {employee.employee_id}</option>)}</select>{errors.employee && <div className="field-error">{errors.employee}</div>}</div>
              <div className="field"><label htmlFor="leave-type">Leave type</label><select id="leave-type" name="leave_type" value={form.leave_type} onChange={handleChange}><option value="SICK">Sick leave</option><option value="CASUAL">Casual leave</option><option value="EARNED">Earned leave</option><option value="UNPAID">Unpaid leave</option></select></div>
              <div className="field"><label htmlFor="leave-from">From</label><input id="leave-from" type="date" name="start_date" value={form.start_date} onChange={handleChange} required />{errors.start_date && <div className="field-error">{errors.start_date}</div>}</div>
              <div className="field"><label htmlFor="leave-to">To</label><input id="leave-to" type="date" min={form.start_date || undefined} name="end_date" value={form.end_date} onChange={handleChange} required />{errors.end_date && <div className="field-error">{errors.end_date}</div>}</div>
              <div className="field leave-form-grid__full"><label htmlFor="leave-reason">Reason <span>Optional</span></label><textarea id="leave-reason" name="reason" rows="3" placeholder="Add a short note for the reviewer" value={form.reason} onChange={handleChange} /></div>
            </div>
            {errors.non_field_errors && <div className="leave-form-error">{errors.non_field_errors}</div>}
            <div className="leave-form-actions"><button className="button button--primary" disabled={submitting}><SendIcon /> {submitting ? 'Submitting…' : 'Submit request'}</button></div>
          </form>
        </section>

        <aside className="leave-status-card">
          <p>Request status</p><h2>At a glance</h2>
          <div><span className="leave-status-card__pending"><ClockIcon /></span><strong>{counts.PENDING}</strong><small>Pending review</small></div>
          <div><span className="leave-status-card__approved"><CheckCircleIcon /></span><strong>{counts.APPROVED}</strong><small>Approved</small></div>
          <div><span className="leave-status-card__rejected"><XCircleIcon /></span><strong>{counts.REJECTED}</strong><small>Rejected</small></div>
        </aside>
      </div>

      <section className="surface leave-history">
        <div className="leave-history__header"><div><h2>Request history</h2><p>Review and manage recent employee leave requests.</p></div><div className="leave-tabs" role="tablist">{['ALL','PENDING','APPROVED','REJECTED'].map((status) => <button key={status} className={filter === status ? 'active' : ''} onClick={() => setFilter(status)}>{status.charAt(0) + status.slice(1).toLowerCase()} <span>{counts[status]}</span></button>)}</div></div>
        {loading ? <div className="loading-block">Loading leave requests…</div> : visibleLeaves.length === 0 ? (
          <div className="empty-state"><div><span className="empty-state__icon"><CalendarIcon /></span><h3>No {filter === 'ALL' ? '' : filter.toLowerCase()} requests</h3><p>{filter === 'ALL' ? 'Submitted requests will appear here.' : 'There are no requests with this status.'}</p></div></div>
        ) : (
          <div className="leave-table-wrap"><table className="leave-table"><thead><tr><th>Employee</th><th>Leave type</th><th>Dates</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visibleLeaves.map((leave) => <tr key={leave.id}><td><div className="leave-employee"><span>{initials(leave.employee_name)}</span><strong>{leave.employee_name}</strong></div></td><td>{typeLabel(leave.leave_type)}</td><td><div className="leave-dates"><strong>{readableDate(leave.start_date)}</strong><span>to {readableDate(leave.end_date)}</span></div></td><td><span className={`status-badge status-badge--${leave.status.toLowerCase()}`}>{leave.status.toLowerCase()}</span></td><td>{leave.status === 'PENDING' ? <div className="leave-actions"><button className="leave-actions__approve" onClick={() => setReviewTarget({ leave, action: 'approve' })}><CheckCircleIcon /> Approve</button><button className="leave-actions__reject" onClick={() => setReviewTarget({ leave, action: 'reject' })}><XCircleIcon /> Reject</button></div> : <span className="leave-complete">Reviewed</span>}</td></tr>)}</tbody></table></div>
        )}
      </section>

      {reviewTarget && <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setReviewTarget(null)}><div className="dialog" role="dialog" aria-modal="true"><h3>{reviewTarget.action === 'approve' ? 'Approve' : 'Reject'} this leave request?</h3><p>You’re about to {reviewTarget.action} {reviewTarget.leave.employee_name}’s request from {readableDate(reviewTarget.leave.start_date)} to {readableDate(reviewTarget.leave.end_date)}.</p><div className="dialog__actions"><button className="button button--secondary" onClick={() => setReviewTarget(null)}>Cancel</button><button className={`button ${reviewTarget.action === 'approve' ? 'button--primary' : 'button--danger'}`} disabled={reviewing} onClick={confirmReview}>{reviewing ? 'Updating…' : `${reviewTarget.action === 'approve' ? 'Approve' : 'Reject'} request`}</button></div></div></div>}
    </div>
  );
}
