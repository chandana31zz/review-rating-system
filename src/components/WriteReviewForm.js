import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const COLLEGES = [
  { id: 1, name: 'BMS Institute of Technology' },
  { id: 2, name: 'NIE Mysuru' },
  { id: 3, name: 'DSCE Bengaluru' },
];

const CATS = ["academics", "infrastructure", "placements", "faculty"];

export default function WriteReviewForm({ onSubmitted }) {

  const [name, setName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');

  const [catRatings, setCatRatings] = useState({
    academics: 3,
    infrastructure: 3,
    placements: 3,
    faculty: 3
  });

  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setCat = (cat, val) => {
    setCatRatings(prev => ({
      ...prev,
      [cat]: Number(val)
    }));
  };

  const submit = async () => {
    console.log("clicked");

    if (!name || !collegeId || !rating || !text) {
      return setErr("Fill all fields");
    }

    setSubmitting(true);
    setErr('');

    const { error } = await supabase.from('reviews').insert([
      {
        student_id: 1,
        college_id: Number(collegeId),
        rating,
        review_text: text,

        academics: catRatings.academics,
        infrastructure: catRatings.infrastructure,
        placements: catRatings.placements,
        faculty: catRatings.faculty
      }
    ]);

    setSubmitting(false);

    if (error) {
      setErr(error.message);
    } else {
      setName('');
      setCollegeId('');
      setRating(0);
      setText('');
      onSubmitted && onSubmitted();
    }
  };

  return (
    <div className="form-box">

      <h2 className="form-title">Write a Review</h2>

      <div className="form-group">
        <input
          className="form-input"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <select
          className="form-select"
          value={collegeId}
          onChange={(e) => setCollegeId(e.target.value)}
        >
          <option value="">Select College</option>
          {COLLEGES.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <div className="star-picker">
          {[1,2,3,4,5].map(s => (
            <button
              key={s}
              type="button"
              className={`star-btn ${(hover || rating) >= s ? "lit" : ""}`}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Rate by Category</label>

        {CATS.map(cat => (
          <div key={cat} className="slider-wrap">
            <div className="slider-row">

              <span className="slider-label">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>

              <input
                type="range"
                min="1"
                max="5"
                className="slider-input"
                value={catRatings[cat]}
                onChange={(e) => setCat(cat, e.target.value)}
              />

              <span className="slider-val">
                {catRatings[cat]}
              </span>

            </div>
          </div>
        ))}
      </div>

      <div className="form-group">
        <textarea
          className="form-textarea"
          placeholder="Write your review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {err && <p className="err-msg">{err}</p>}

      <button
        className="btn-submit"
        onClick={submit}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>

    </div>
  );
}