import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BooksPage } from './pages/BooksPage';
import { UsersPage } from './pages/UsersPage';
import { RentalsPage } from './pages/RentalsPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/rentals" element={<RentalsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
