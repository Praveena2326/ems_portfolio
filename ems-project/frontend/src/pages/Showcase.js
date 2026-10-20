import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  DashboardIcon,
  UserIcon,
} from '../components/icons';
import './Showcase.css';

const features = [
  { icon: UserIcon, title: 'Employee directory', text: 'Keep profiles, reporting lines and employment details in one organized place.' },
  { icon: CalendarIcon, title: 'Leave management', text: 'Review leave requests quickly and keep team availability visible.' },
  { icon: DashboardIcon, title: 'Workforce insights', text: 'Turn day-to-day people data into a simple, useful overview.' },
];

export default function Showcase() {
  return (
    <div className="showcase">
      <header className="showcase-nav">
        <Link className="showcase-brand" to="/">
          <span>e</span><strong>EMS</strong>
        </Link>
        <div className="showcase-nav__actions">
          <a href="#features">Features</a>
          <Link className="showcase-nav__login" to="/login">Sign in</Link>
        </div>
      </header>

      <main>
        <section className="showcase-hero">
          <div className="showcase-hero__copy">
            <p className="showcase-kicker"><span /> Modern people operations</p>
            <h1>Your people deserve a <em>better</em> workspace.</h1>
            <p className="showcase-lead">EMS gives growing teams one calm, capable place to manage people, leave and workforce insights.</p>
            <div className="showcase-hero__actions">
              <Link className="showcase-button showcase-button--primary" to="/login">Open workspace <span>→</span></Link>
              <a className="showcase-button showcase-button--quiet" href="#features">Explore features</a>
            </div>
            <div className="showcase-trust"><CheckCircleIcon /> Secure access for your organization</div>
          </div>

          <div className="showcase-preview" aria-label="EMS dashboard preview">
            <div className="showcase-preview__top"><span className="showcase-preview__mark">e</span><div><small>Employee management</small><strong>Dashboard</strong></div><span className="showcase-preview__avatar">JD</span></div>
            <div className="showcase-preview__body">
              <div className="showcase-preview__welcome"><div><small>WORKFORCE OVERVIEW</small><strong>Good morning, Jordan</strong></div><span>+ Add employee</span></div>
              <div className="showcase-preview__health"><div><small><CheckCircleIcon /> WORKFORCE HEALTH</small><strong>94% of your team is active today</strong><p>Three team members are currently on leave.</p></div><b>94<small>% active</small></b></div>
              <div className="showcase-preview__metrics">
                <div><UserIcon /><small>Total employees</small><strong>42</strong><span>Across your organization</span></div>
                <div><CheckCircleIcon /><small>Active employees</small><strong>39</strong><span>93% of total headcount</span></div>
                <div><ClockIcon /><small>Pending requests</small><strong>3</strong><span>Needs a review</span></div>
              </div>
              <div className="showcase-preview__rows"><div><strong>Employees by department</strong><span>Product <i style={{ width: '86%' }} /></span><span>Engineering <i style={{ width: '68%' }} /></span><span>Operations <i style={{ width: '45%' }} /></span></div><div className="showcase-preview__notice"><CalendarIcon /><small>Action centre</small><strong>3 requests awaiting review</strong></div></div>
            </div>
          </div>
        </section>

        <section className="showcase-features" id="features">
          <div className="showcase-section-title"><p>Built for clarity</p><h2>Everything your people team needs. Nothing they don’t.</h2></div>
          <div className="showcase-feature-grid">
            {features.map(({ icon: Icon, title, text }) => <article key={title}><span><Icon /></span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="showcase-callout"><div><p>Ready when your team is</p><h2>Bring calm to people operations.</h2></div><Link className="showcase-button showcase-button--light" to="/login">Sign in to EMS <span>→</span></Link></section>
      </main>
      <footer className="showcase-footer"><Link className="showcase-brand" to="/"><span>e</span><strong>EMS</strong></Link><p>Employee management, thoughtfully simplified.</p></footer>
    </div>
  );
}
