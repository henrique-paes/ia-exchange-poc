import s from './Spinner.module.css';

// Decorative; the surrounding status region carries the accessible text.
export function Spinner() {
  return <span className={s.spinner} aria-hidden="true" />;
}
