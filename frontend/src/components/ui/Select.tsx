import { SelectHTMLAttributes } from 'react';
import s from './field.module.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export function Select({ invalid, className, children, ...rest }: SelectProps) {
  const classes = [s.control, s.select, className].filter(Boolean).join(' ');
  return (
    <select className={classes} aria-invalid={invalid || undefined} {...rest}>
      {children}
    </select>
  );
}
