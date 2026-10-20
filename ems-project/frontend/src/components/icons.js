import React from 'react';

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const UserIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const TagIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M20.6 12.6 12.7 20.5a2 2 0 0 1-2.8 0l-6.4-6.4a2 2 0 0 1 0-2.8L11.4 3.4a2 2 0 0 1 1.4-.6H19a2 2 0 0 1 2 2v6.6a2 2 0 0 1-.4 1.6Z" />
    <circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const CalendarIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
    <path d="M16 2.5v4M8 2.5v4M3 9.5h18" />
  </svg>
);

export const NoteIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);

export const ClockIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const CheckCircleIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.3 2.4 2.4 4.8-5.2" />
  </svg>
);

export const XCircleIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9.5 9.5 5 5m0-5-5 5" />
  </svg>
);

export const PlaneIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M10.5 20.5 12 17l1.5 3.5M2 13.5l20-8-8 20-2.5-8.5L2 13.5Z" />
  </svg>
);

export const SendIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m22 2-9.5 9.5M22 2 15 22l-3.5-7.5L4 11 22 2Z" />
  </svg>
);

export const DashboardIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const BuildingIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M9 21v-4h4v4M8 7h1M12 7h1M8 11h1M12 11h1M17 9h2a1 1 0 0 1 1 1v11M2 21h20" />
  </svg>
);

export const MenuIcon = (props) => (
  <svg {...base} {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);

export const LogoutIcon = (props) => (
  <svg {...base} {...props}><path d="M10 17l5-5-5-5M15 12H3M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></svg>
);

export const SearchIcon = (props) => (
  <svg {...base} {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
);

export const EditIcon = (props) => (
  <svg {...base} {...props}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>
);

export const TrashIcon = (props) => (
  <svg {...base} {...props}><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5" /></svg>
);

export const EyeIcon = (props) => (
  <svg {...base} {...props}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>
);

export const EyeOffIcon = (props) => (
  <svg {...base} {...props}><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10 10 0 0 1 12 5c6 0 9.5 7 9.5 7a15 15 0 0 1-2 2.8M6.2 6.2C3.8 7.8 2.5 12 2.5 12s3.5 7 9.5 7a9.8 9.8 0 0 0 3-.5" /></svg>
);

export const ChevronLeftIcon = (props) => (
  <svg {...base} {...props}><path d="m15 18-6-6 6-6" /></svg>
);

export const ChevronRightIcon = (props) => (
  <svg {...base} {...props}><path d="m9 18 6-6-6-6" /></svg>
);
