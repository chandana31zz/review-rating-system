import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import ReviewsPage from './components/ReviewsPage';
import AdminPage from './components/AdminPage';

export default function App() {
  const [page, setPage] = useState('public');

  return (
    <div className="app">
      <Navbar page={page} setPage={setPage} />
      {page === 'public' && <ReviewsPage />}
      {page === 'admin'  && <AdminPage />}
    </div>
  );
}
