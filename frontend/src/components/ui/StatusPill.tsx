import { ReactNode } from 'react';
import s from './StatusPill.module.css';

export type Tone = 'success' | 'warning';

// Status label (book availability, rental state). Always shows text, never
// color-only (a11y).
export function StatusPill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`${s.pill} ${s[tone]}`}>{children}</span>;
}
