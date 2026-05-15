import React from 'react';

export default function Navbar({ page, setPage }) {
  function scrollToForm() {
    setPage('public');
    setTimeout(() => {
      document.getElementById('write-review')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="logo" onClick={() => setPage('public')}>
          U<span>nisol</span> Academy
        </div>

        <ul className="nav-links">
          <li><a onClick={() => setPage('public')}>Home</a></li>
          <li><a>Colleges</a></li>
          <li><a className={page === 'public' ? 'active' : ''} onClick={() => setPage('public')}>Reviews</a></li>
          <li><a>Courses</a></li>
          <li><a>Mock Tests</a></li>
        </ul>

        <div className="nav-right">
          <button className="btn-admin" onClick={() => setPage('admin')}>Admin Panel</button>
          <button className="btn-write" onClick={scrollToForm}>Write a Review</button>
        </div>
      </div>
    </nav>
  );
}
