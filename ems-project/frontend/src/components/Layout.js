import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BuildingIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DashboardIcon,
  LogoutIcon,
  MenuIcon,
  UserIcon,
  XCircleIcon,
} from './icons';
import './Layout.css';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/employees', label: 'Employees', icon: UserIcon },
  { to: '/departments', label: 'Departments', icon: BuildingIcon },
  { to: '/leave-requests', label: 'Leave requests', icon: CalendarIcon },
];

const pageNames = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employees',
  '/employees/new': 'Add employee',
  '/departments': 'Departments',
  '/leave-requests': 'Leave requests',
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const currentPage = pageNames[location.pathname]
    || (location.pathname.includes('/edit') ? 'Edit employee' : 'EMS');
  const initials = (user?.username || 'U').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
      {mobileOpen && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`app-sidebar ${mobileOpen ? 'app-sidebar--open' : ''}`}>
        <div className="app-sidebar__brand">
          <span className="app-sidebar__logo">E</span>
          <div><strong>EMS</strong><span>Employee management</span></div>
          <button
            className="app-sidebar__collapse"
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
          <button className="app-sidebar__close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><XCircleIcon /></button>
        </div>

        <p className="app-sidebar__label">Workspace</p>
        <nav className="app-sidebar__nav" aria-label="Main navigation">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} title={collapsed ? label : undefined} className={({ isActive }) => isActive ? 'active' : ''}>
              <Icon /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="app-sidebar__help">
          <span>Need a quick start?</span>
          <p>Add departments before assigning employees to teams.</p>
          <NavLink to="/departments">Manage departments →</NavLink>
        </div>

        <div className="app-sidebar__user">
          <span className="app-sidebar__avatar">{initials}</span>
          <div><strong>{user?.username}</strong><span>{user?.is_staff ? 'Administrator' : 'Team member'}</span></div>
          <button onClick={handleLogout} aria-label="Log out" title="Log out"><LogoutIcon /></button>
        </div>
      </aside>

      <div className="app-workspace">
        <header className="app-topbar">
          <button className="app-topbar__menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><MenuIcon /></button>
          <div><span>Employee management system</span><strong>{currentPage}</strong></div>
          <div className="app-topbar__user"><span>{initials}</span><div><strong>{user?.username}</strong><small>Signed in</small></div></div>
        </header>
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
