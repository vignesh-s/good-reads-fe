import React, { useState } from 'react';
import axios from 'axios';
import { Review } from '../types';

interface Props {
  bookId: number;
  onReviewAdded: () => void;
}

const ReviewForm: React.FC<Props> = ({ bookId, onReviewAdded }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = { book: bookId, rating, comment };

    axios.post('http://localhost:8000/api/reviews/', newReview)
      .then(() => {
        setRating(5);
        setComment('');
        onReviewAdded();
      })
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add Review</h4>
      <label>
        Rating:
        <select value={rating} onChange={e => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      <br />
      <textarea
        placeholder="Comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <br />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
