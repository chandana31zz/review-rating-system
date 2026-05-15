import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getInitials, getAvatarStyle, renderStars, formatDate } from '../lib/helpers';
import WriteReviewForm from './WriteReviewForm';

export default function ReviewsPage() {
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [expanded, setExpanded]   = useState({});
  const [helpful, setHelpful]     = useState({});

  useEffect(() => { fetchReviews(); }, []);

  async function fetchReviews() {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setReviews(data);
    setLoading(false);
  }

  const displayed = filter === 'all'
    ? reviews
    : reviews.filter(r => r.rating === parseInt(filter));

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const counts = [5,4,3,2,1].map(s => reviews.filter(r => r.rating === s).length);
  const maxC   = Math.max(...counts, 1);

  function toggleExpand(id) {
    setExpanded(p => ({ ...p, [id]: !p[id] }));
  }

  function markHelpful(r) {
    if (helpful[r.id]) return;
    setHelpful(p => ({ ...p, [r.id]: true }));
    setReviews(prev => prev.map(x => x.id === r.id ? { ...x, helpful_count: (x.helpful_count || 0) + 1 } : x));
    supabase.from('reviews').update({ helpful_count: (r.helpful_count || 0) + 1 }).eq('id', r.id);
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">★ Student Voices</div>
        <h1>Honest Reviews by<br /><em>Real Students</em></h1>
        <p className="hero-sub">
          Read authentic experiences from students across Karnataka. Make smarter college decisions with verified reviews and detailed ratings.
        </p>
        <div className="stats-grid">
          <div className="stat-card"><span className="stat-num">{reviews.length}</span><span className="stat-lbl">Total Reviews</span></div>
          <div className="stat-card"><span className="stat-num">{avg}</span><span className="stat-lbl">Avg. Rating</span></div>
          <div className="stat-card"><span className="stat-num">87</span><span className="stat-lbl">Colleges Rated</span></div>
          <div className="stat-card"><span className="stat-num">96%</span><span className="stat-lbl">Verified Reviews</span></div>
        </div>
      </section>

      {/* PAGE BODY */}
      <div className="page-wrap">
        {/* LEFT — review list */}
        <div>
          <div className="sec-hdr">
            <h2>Recent Reviews</h2>
            <div className="pills">
              {['all','5','4','3'].map(f => (
                <button key={f} className={`pill ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All' : `★ ${f}`}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="empty-reviews">Loading reviews…</div>
          ) : displayed.length === 0 ? (
            <div className="empty-reviews">No reviews yet — be the first!</div>
          ) : (
            displayed.map((r, i) => {
              const isLong  = (r.review_text || '').length > 200;
              const showAll = expanded[r.id];
              const text    = isLong && !showAll ? r.review_text.slice(0, 200) + '…' : r.review_text;
              const cats    = r.category_ratings || {};

              return (
                <div className="rev-card" key={r.id}>
                  <div className="rev-top">
                    <div className="rev-user">
                      <div className="avatar" style={getAvatarStyle(i)}>
                        {r.student_name ? getInitials(r.student_name) : `S${r.student_id}`}
                      </div>
                      <div>
                        <div className="u-name">{r.student_name || `Student #${r.student_id}`}</div>
                        <div className="u-tag">✓ Verified Student</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="stars">{renderStars(r.rating)}</div>
                      <div className="score">{r.rating?.toFixed ? r.rating.toFixed(1) : r.rating} / 5</div>
                    </div>
                  </div>

                  <div className="college-chip">
                    🏛 {r.college_name ? r.college_name.toUpperCase() : `COLLEGE #${r.college_id}`}
                  </div>

                  <div className="rev-text">{text}</div>
                  {isLong && (
                    <button className="read-more" onClick={() => toggleExpand(r.id)}>
                      {showAll ? 'Show less' : 'Read more'}
                    </button>
                  )}

                  {Object.keys(cats).length > 0 && (
                    <div className="cat-bars">
                      {Object.entries(cats).map(([k, v]) => (
                        <div className="cbar" key={k}>
                          {k}
                          <div className="bar-t"><div className="bar-f" style={{ width: `${(v/5)*100}%` }} /></div>
                          {v}/5
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="rev-foot">
                    <button className="helpful-btn" onClick={() => markHelpful(r)}>
                      👍 Helpful ({r.helpful_count || 0})
                    </button>
                    <span className="rev-date">{formatDate(r.created_at)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT — sidebar */}
        <div>
          <div className="overall-box">
            <div className="ob-label">Overall Rating</div>
            <div className="big-rating">
              <div className="big-num">{avg}</div>
              <div>
                <div className="stars big-stars">{renderStars(Math.round(parseFloat(avg)))}</div>
                <small className="big-sub">Based on {reviews.length} reviews</small>
              </div>
            </div>
            {[5,4,3,2,1].map((s, i) => (
              <div className="rbar-row" key={s}>
                <span style={{ minWidth: 28 }}>{s} ★</span>
                <div className="rbar-track">
                  <div className="rbar-fill" style={{ width: `${(counts[i]/maxC)*100}%` }} />
                </div>
                <span className="rbar-cnt">{counts[i]}</span>
              </div>
            ))}
          </div>

          <WriteReviewForm onSubmitted={fetchReviews} />
        </div>
      </div>
    </>
  );
}
