import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header>
        <h1>Library</h1>
        <nav>
          <NavLink to="/books">Books</NavLink>
          {' · '}
          <NavLink to="/users">Users</NavLink>
          {' · '}
          <NavLink to="/rentals">Rentals</NavLink>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
