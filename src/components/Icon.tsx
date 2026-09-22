import React from 'react'

export type IconName =
  | 'home' | 'car' | 'wrench' | 'chart' | 'user' | 'bell' | 'back' | 'edit' | 'plus'
  | 'filter' | 'chevronRight' | 'camera' | 'oil' | 'filterIcon' | 'drop' | 'belt'
  | 'spark' | 'brake' | 'suspension' | 'gear' | 'battery' | 'tire' | 'align'
  | 'wiper' | 'ac' | 'check' | 'chip' | 'doc' | 'shield' | 'sun' | 'moon' | 'phone'
  | 'location' | 'siren' | 'close' | 'lock' | 'fingerprint' | 'download' | 'file'

const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" strokeLinejoin="round" /></>,
  car: <><path d="M4 16 5.6 10.4A3 3 0 0 1 8.5 8h7a3 3 0 0 1 2.9 2.4L20 16" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="16" width="18" height="4.5" rx="1.4" /><circle cx="7.5" cy="20.5" r="0.4" fill="currentColor" /><circle cx="16.5" cy="20.5" r="0.4" fill="currentColor" /></>,
  wrench: <><path d="M14.7 3 12.5 5.2l6.3 6.3L21 9.3a2 2 0 0 0 0-2.8L17.5 3a2 2 0 0 0-2.8 0Z" strokeLinejoin="round" /><path d="M11.5 6.2 4 13.7 3 21l7.3-1 7.5-7.5" strokeLinejoin="round" /></>,
  chart: <path d="M4 19V9M10 19V5M16 19v-7M21 19H3" strokeLinecap="round" strokeLinejoin="round" />,
  user: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" strokeLinecap="round" /></>,
  bell: <><path d="M12 3a5 5 0 0 0-5 5v3.2c0 .6-.2 1.2-.6 1.7L5 15h14l-1.4-2.1a2.7 2.7 0 0 1-.6-1.7V8a5 5 0 0 0-5-5Z" strokeLinejoin="round" /><path d="M10 18a2 2 0 0 0 4 0" strokeLinecap="round" /></>,
  back: <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />,
  edit: <path d="M4 20l1-4.4L16 4.6l3.4 3.4L8.4 19H4Z" strokeLinejoin="round" />,
  plus: <path d="M12 5v14M5 12h14" strokeLinecap="round" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />,
  chevronRight: <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />,
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" strokeLinejoin="round" /><circle cx="12" cy="14" r="3.2" /></>,
  oil: <><path d="M8 3h8l1 3H7l1-3Z" strokeLinejoin="round" /><path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" strokeLinejoin="round" /><path d="M9.5 12.5c1.6 1.2 3.4 1.2 5 0" strokeLinecap="round" /></>,
  filterIcon: <><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M8.5 9h7M8.5 12.5h7M8.5 16h4.5" strokeLinecap="round" /></>,
  drop: <path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11Z" strokeLinejoin="round" />,
  belt: <><path d="M6 17c1-3.5 2.6-9 3-10.4A2.4 2.4 0 0 1 11.3 5h1.4a2.4 2.4 0 0 1 2.3 1.6c.4 1.4 2 6.9 3 10.4" strokeLinecap="round" /><path d="M5 17h14" strokeLinecap="round" /></>,
  spark: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" />,
  brake: <><circle cx="12" cy="12" r="7" /><path d="M12 7v5M9 9l6 6M15 9l-6 6" strokeWidth="1.4" /></>,
  suspension: <><path d="M8 20V4M16 20V4" strokeLinecap="round" /><path d="M6 8h4M6 12h4M6 16h4M14 8h4M14 12h4M14 16h4" strokeLinecap="round" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" strokeLinecap="round" /></>,
  battery: <><rect x="6" y="8" width="12" height="9" rx="1.5" /><path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8" /><path d="M10 12.2h4" strokeLinecap="round" /></>,
  tire: <><circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.6" /></>,
  align: <><path d="M12 3v18M6 8l6-5 6 5M6 16l6 5 6-5" strokeLinecap="round" strokeLinejoin="round" /></>,
  wiper: <path d="M6 20 16 6M6 20l12-6" strokeLinecap="round" strokeLinejoin="round" />,
  ac: <><path d="M4 12h16M12 4v16M6.5 6.5l11 11M17.5 6.5l-11 11" strokeLinecap="round" /></>,
  check: <path d="M5 12.5 10 17.5 19 7" strokeLinecap="round" strokeLinejoin="round" />,
  chip: <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" strokeLinecap="round" /></>,
  doc: <><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M8.5 9h7M8.5 12.5h7M8.5 16h4.5" strokeLinecap="round" /></>,
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" strokeLinejoin="round" />,
  sun: <><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" strokeLinecap="round" /></>,
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" strokeLinejoin="round" />,
  phone: <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2C11.6 19.5 4.5 12.4 4.5 5a2 2 0 0 1 2-2Z" strokeLinejoin="round" />,
  location: <><path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21Z" strokeLinejoin="round" /><circle cx="12" cy="9.5" r="2.4" /></>,
  siren: <><path d="M12 3a5 5 0 0 1 5 5v6H7V8a5 5 0 0 1 5-5Z" strokeLinejoin="round" /><path d="M4 20h16M12 3V1.2" strokeLinecap="round" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />,
  lock: <><rect x="5.5" y="10.5" width="13" height="9.5" rx="1.8" /><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" strokeLinecap="round" /></>,
  fingerprint: <><path d="M12 3a8 8 0 0 1 8 8v2.5" strokeLinecap="round" /><path d="M12 3a8 8 0 0 0-8 8v2.5" strokeLinecap="round" /><path d="M8.5 21c-.6-1.6-1-3.6-1-6.5a4.5 4.5 0 0 1 9 0c0 1 0 1.8-.1 2.5" strokeLinecap="round" /><path d="M12 21c-1-2-1.5-4-1.5-6.5a1.5 1.5 0 0 1 3 0c0 2 .2 3.6.7 5" strokeLinecap="round" /></>,
  download: <><path d="M12 4v11" strokeLinecap="round" /><path d="M7.5 11 12 15.5 16.5 11" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 19.5h14" strokeLinecap="round" /></>,
  file: <><path d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" strokeLinejoin="round" /><path d="M14 3.5V8h4" strokeLinejoin="round" /></>
}

export function Icon({ name, size = 20, className = '', strokeWidth = 1.7 }: { name: IconName; size?: number; className?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
