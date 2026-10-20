import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  PlaneIcon,
  UserIcon,
} from '../components/icons';
import './Dashboard.css';

const MetricCard = ({ label, value, detail, tone, icon, to }) => (
  <div className={`dashboard-metric dashboard-metric--${tone}`}>
    <div className="dashboard-metric__top">
      <span className="dashboard-metric__icon">{icon}</span>
      <span className="dashboard-metric__label">{label}</span>
    </div>
    <strong>{value}</strong>
    <div className="dashboard-metric__bottom">
      <span>{detail}</span>
      {to && <Link to={to}>View <span aria-hidden="true">→</span></Link>}
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get('/employees/dashboard_stats/')
      .then((res) => setStats(res.data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="dashboard-state">
        <h2>Dashboard unavailable</h2>
        <p>We couldn’t load the latest workforce data. Please refresh and try again.</p>
      </div>
    );
  }

  if (!stats) {
    return <div className="dashboard-state">Loading your workforce overview…</div>;
  }

  const activeRate = stats.total_employees
    ? Math.round((stats.active_employees / stats.total_employees) * 100)
    : 0;
  const departmentMax = Math.max(...stats.employees_by_department.map((d) => d.count), 1);
  const hasDepartments = stats.employees_by_department.length > 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard-page app-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-header__eyebrow">Workforce overview</p>
          <h2>{greeting}, <span>{user?.username || 'team'}</span></h2>
          <p>Here’s the latest view of your people and leave activity.</p>
        </div>
        <Link className="dashboard-header__action" to="/employees/new">
          <span aria-hidden="true">+</span> Add employee
        </Link>
      </header>

      <section className="dashboard-hero" aria-label="Workforce health">
        <div className="dashboard-hero__copy">
          <span className="dashboard-hero__kicker"><CheckCircleIcon /> Workforce health</span>
          <h3>{activeRate}% of your team is active today</h3>
          <p>
            {stats.on_leave > 0
              ? `${stats.on_leave} ${stats.on_leave === 1 ? 'employee is' : 'employees are'} currently on leave.`
              : 'No employees are currently marked as on leave.'}
          </p>
          <Link to="/employees">View all employees <span aria-hidden="true">→</span></Link>
        </div>
        <div className="dashboard-hero__rate" style={{ '--rate': `${activeRate}%` }}>
          <div><strong>{activeRate}%</strong><span>active</span></div>
        </div>
      </section>

      <section className="dashboard-metrics" aria-label="Key workforce metrics">
        <MetricCard
          label="Total employees"
          value={stats.total_employees}
          detail="Across your organization"
          tone="blue"
          icon={<UserIcon />}
          to="/employees"
        />
        <MetricCard
          label="Active employees"
          value={stats.active_employees}
          detail={`${activeRate}% of total headcount`}
          tone="green"
          icon={<CheckCircleIcon />}
          to="/employees"
        />
        <MetricCard
          label="Currently on leave"
          value={stats.on_leave}
          detail="Status marked on leave"
          tone="amber"
          icon={<PlaneIcon />}
          to="/employees"
        />
        <MetricCard
          label="Pending requests"
          value={stats.pending_leave_requests}
          detail={stats.pending_leave_requests ? 'Needs a review' : 'All caught up'}
          tone="violet"
          icon={<ClockIcon />}
          to="/leave-requests"
        />
      </section>

      <section className="dashboard-lower-grid">
        <div className="dashboard-panel dashboard-departments">
          <div className="dashboard-panel__heading">
            <div>
              <p>Organization</p>
              <h3>Employees by department</h3>
            </div>
            <span>{hasDepartments ? `${stats.employees_by_department.length} departments` : 'No departments'}</span>
          </div>

          {hasDepartments ? (
            <div className="dashboard-departments__list">
              {stats.employees_by_department.map((department) => {
                const width = Math.max(Math.round((department.count / departmentMax) * 100), department.count ? 8 : 0);
                return (
                  <div className="dashboard-department" key={department.name}>
                    <div className="dashboard-department__label">
                      <span>{department.name}</span>
                      <strong>{department.count}</strong>
                    </div>
                    <div className="dashboard-department__track" aria-label={`${department.name}: ${department.count} employees`}>
                      <span style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dashboard-empty">
              <UserIcon />
              <p>No department data yet.</p>
              <Link to="/departments">Create a department</Link>
            </div>
          )}
        </div>

        <aside className="dashboard-panel dashboard-attention">
          <div className="dashboard-panel__heading">
            <div>
              <p>Action centre</p>
              <h3>Needs attention</h3>
            </div>
            <CalendarIcon />
          </div>
          <div className="dashboard-attention__content">
            <span className="dashboard-attention__count">{stats.pending_leave_requests}</span>
            <div>
              <strong>{stats.pending_leave_requests === 1 ? 'leave request' : 'leave requests'} awaiting review</strong>
              <p>
                {stats.pending_leave_requests
                  ? 'Review requests to keep team availability up to date.'
                  : 'There are no leave requests waiting for a decision.'}
              </p>
            </div>
          </div>
          <Link className="dashboard-attention__action" to="/leave-requests">
            {stats.pending_leave_requests ? 'Review leave requests' : 'View leave requests'} <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </section>
    </div>
  );
}
