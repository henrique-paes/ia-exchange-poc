import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import s from './Layout.module.css';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${s.link} ${s.active}` : s.link;

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={s.shell}>
      <header className={s.header}>
        <h1 className={s.title}>Library</h1>
        <nav className={s.nav}>
          <NavLink to="/books" className={linkClass}>
            Books
          </NavLink>
          <NavLink to="/users" className={linkClass}>
            Users
          </NavLink>
          <NavLink to="/rentals" className={linkClass}>
            Rentals
          </NavLink>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
