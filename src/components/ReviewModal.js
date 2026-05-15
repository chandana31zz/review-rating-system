import React from 'react';
import { renderStars, formatDate } from '../lib/helpers';

export default function ReviewModal({ review, onClose, onApprove, onReject }) {
  const cats = review.category_ratings || {};

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-x" onClick={onClose}>✕</button>

        <h3>{review.student_name || `Student #${review.student_id}`}</h3>
        <div className="modal-sub">
          {review.college_name || `College #${review.college_id}`} · {formatDate(review.created_at)}
        </div>

        <div className="modal-field">
          <div className="modal-fl">Rating</div>
          <div className="modal-fv">
            <span style={{ color: 'var(--accent)', fontSize: 16 }}>{renderStars(review.rating)}</span>
            {' '}{review.rating} / 5
          </div>
        </div>

        <div className="modal-field">
          <div className="modal-fl">Review</div>
          <div className="modal-fv">{review.review_text}</div>
        </div>

        {Object.keys(cats).length > 0 && (
          <div className="modal-field">
            <div className="modal-fl">Category Ratings</div>
            <div className="modal-fv" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
              {Object.entries(cats).map(([k, v]) => (
                <span key={k} style={{ fontSize: 13 }}>
                  {k}: <strong style={{ color: 'var(--accent)' }}>{v}/5</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="modal-field">
          <div className="modal-fl">Status</div>
          <div className="modal-fv" style={{
            color: review.status === 'approved' ? 'var(--green)'
                 : review.status === 'rejected' ? 'var(--red)'
                 : '#c8891a',
            textTransform: 'capitalize',
            fontWeight: 500,
          }}>
            {review.status || 'pending'}
          </div>
        </div>

        <div className="modal-acts">
          {review.status !== 'approved' && (
            <button className="btn-m-ok" onClick={() => { onApprove(review.id); }}>
              ✓ Approve
            </button>
          )}
          {review.status !== 'rejected' && (
            <button className="btn-m-rej" onClick={() => { onReject(review.id); }}>
              ✗ Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
