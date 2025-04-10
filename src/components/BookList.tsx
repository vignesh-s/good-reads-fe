import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Book } from '../types';
import { Link } from 'react-router-dom';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/books/')
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredBooks = books.filter(book =>
    book.genre.toLowerCase().includes(filter.toLowerCase()) ||
    book.author.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1>📚 Book List</h1>
      <input
        type="text"
        placeholder="Filter by genre or author"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <ul>
        {filteredBooks.map(book => (
          <li key={book.id}>
            <Link to={`/book/${book.id}`}>
              {book.title} by {book.author} ({book.genre}) - ⭐ {book.average_rating ?? 'N/A'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
