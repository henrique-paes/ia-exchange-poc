import { ButtonHTMLAttributes } from 'react';
import s from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className, type = 'button', ...rest }: ButtonProps) {
  const classes = [s.button, s[variant], className].filter(Boolean).join(' ');
  return <button type={type} className={classes} {...rest} />;
}
