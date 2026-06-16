import { ReactNode } from 'react';
import s from './field.module.css';

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
}

// Label + control + optional error message (docs/specs/ui-components.md → Form/Field).
export function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className={s.field}>
      <label className={s.label} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && (
        <span className={s.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
