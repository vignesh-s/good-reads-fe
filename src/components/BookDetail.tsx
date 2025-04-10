import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Book, Review } from '../types';
import { useParams } from 'react-router-dom';
import ReviewForm from './ReviewForm';

const BookDetail: React.FC = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);

  const fetchBook = () => {
    axios.get(`http://localhost:8000/api/books/${id}/`)
      .then(res => setBook(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const deleteReview = (reviewId: number) => {
    axios.delete(`http://localhost:8000/api/reviews/${reviewId}/`)
      .then(fetchBook)
      .catch(err => console.error(err));
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div>
      <h2>{book.title} by {book.author}</h2>
      <p>Genre: {book.genre}</p>
      <p>Published: {book.published_year}</p>
      <p>Average Rating: {book.average_rating ?? 'No ratings yet'}</p>

      <h3>Reviews</h3>
      <ul>
        {book.reviews.map(review => (
          <li key={review.id}>
            ⭐ {review.rating} - {review.comment}
            <button onClick={() => deleteReview(review.id!)}>Delete</button>
          </li>
        ))}
      </ul>

      <ReviewForm bookId={book.id} onReviewAdded={fetchBook} />
    </div>
  );
};

export default BookDetail;
