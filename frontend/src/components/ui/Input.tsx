import { InputHTMLAttributes } from 'react';
import s from './field.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid, className, ...rest }: InputProps) {
  const classes = [s.control, className].filter(Boolean).join(' ');
  return <input className={classes} aria-invalid={invalid || undefined} {...rest} />;
}
