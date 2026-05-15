import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getInitials, getAvatarStyle, renderStars, formatDate } from '../lib/helpers';
import ReviewModal from './ReviewModal';

export default function AdminPage() {
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('all');
  const [search,   setSearch]   = useState('');
  const [sort,     setSort]     = useState('newest');
  const [modal,    setModal]    = useState(null);

  useEffect(() => { fetch(); }, []);

  async function fetch() {
    setLoading(true);
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data) setReviews(data);
    setLoading(false);
  }

  async function changeStatus(id, status) {
    await supabase.from('reviews').update({ status }).eq('id', id);
    setReviews(p => p.map(r => r.id === id ? { ...r, status } : r));
    if (modal?.id === id) setModal(p => ({ ...p, status }));
  }

  async function deleteReview(id) {
    if (!window.confirm('Delete this review permanently?')) return;
    await supabase.from('reviews').delete().eq('id', id);
    setReviews(p => p.filter(r => r.id !== id));
    if (modal?.id === id) setModal(null);
  }

  // Stats
  const approved = reviews.filter(r => r.status === 'approved').length;
  const rejected = reviews.filter(r => r.status === 'rejected').length;
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Filter + sort
  let data = reviews;
  if (tab !== 'all') data = data.filter(r => r.status === tab);
  if (search.trim()) {
    const q = search.toLowerCase();
    data = data.filter(r =>
      (r.student_name || '').toLowerCase().includes(q) ||
      (r.college_name || '').toLowerCase().includes(q) ||
      (r.review_text  || '').toLowerCase().includes(q)
    );
  }
  data = [...data];
  if (sort === 'newest')  data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  if (sort === 'oldest')  data.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
  if (sort === 'highest') data.sort((a,b) => b.rating - a.rating);
  if (sort === 'lowest')  data.sort((a,b) => a.rating - b.rating);

  return (
    <div className="admin-wrap">
      {/* Header */}
      <div className="admin-hdr">
        <div>
          <h1>Review Management</h1>
          <p>Moderate student college reviews</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:13, color:'var(--text2)' }}>Admin</span>
          <div className="admin-av">AD</div>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="astat"><div className="astat-lbl">Total Reviews</div><div className="astat-num">{reviews.length}</div></div>
        <div className="astat"><div className="astat-lbl">Approved</div><div className="astat-num g">{approved}</div></div>
        <div className="astat"><div className="astat-lbl">Rejected</div><div className="astat-num r">{rejected}</div></div>
        <div className="astat"><div className="astat-lbl">Avg. Rating</div><div className="astat-num a">{avg} ★</div></div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {[['all','All Reviews'],['approved','Approved'],['rejected','Rejected']].map(([v,l]) => (
          <button key={v} className={`atab ${tab===v?'on':''}`} onClick={() => setTab(v)}>{l}</button>
        ))}
      </div>

      {/* Controls */}
      <div className="admin-controls">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search by student, college or review text..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>College</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="tbl-empty">Loading…</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={7} className="tbl-empty">No reviews found.</td></tr>
            ) : data.map((r, i) => (
              <tr key={r.id}>
                <td>
                  <div className="td-user">
                    <div className="avatar" style={{ ...getAvatarStyle(i), width:32, height:32, fontSize:11 }}>
                      {r.student_name ? getInitials(r.student_name) : `S${r.student_id}`}
                    </div>
                    <div>
                      <div>{r.student_name || `Student #${r.student_id}`}</div>
                      <div className="td-email">{r.student_email || ''}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize:12 }}>{r.college_name || `College #${r.college_id}`}</td>
                <td>
                  <div className="stars" style={{ fontSize:12 }}>{renderStars(r.rating)}</div>
                  <div style={{ fontSize:11, color:'var(--text3)' }}>{r.rating}/5</div>
                </td>
                <td><div className="rev-preview">{r.review_text}</div></td>
                <td style={{ fontSize:12, color:'var(--text2)', whiteSpace:'nowrap' }}>{formatDate(r.created_at)}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>
                  <div className="act-btns">
                    <button className="btn-view" onClick={() => setModal(r)}>View</button>
                    {r.status !== 'approved' && <button className="btn-ok"  onClick={() => changeStatus(r.id,'approved')}>✓</button>}
                    {r.status !== 'rejected' && <button className="btn-rej" onClick={() => changeStatus(r.id,'rejected')}>✗</button>}
                    <button className="btn-del" onClick={() => deleteReview(r.id)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <ReviewModal
          review={modal}
          onClose={() => setModal(null)}
          onApprove={id => changeStatus(id,'approved')}
          onReject={id  => changeStatus(id,'rejected')}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'approved') return <span className="status-badge s-approved"><span className="dot" style={{ background:'var(--green)' }}/>Approved</span>;
  if (status === 'rejected') return <span className="status-badge s-rejected"><span className="dot" style={{ background:'var(--red)'   }}/>Rejected</span>;
  return <span className="status-badge s-pending"><span className="dot" style={{ background:'#c8891a' }}/>Pending</span>;
}
