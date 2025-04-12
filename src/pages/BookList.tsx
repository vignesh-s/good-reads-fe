import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book } from "../types";
import api from "../utils/api";

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get(`/books/?search=${filter}&page=${page}`);
        setBooks(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 2));
      } catch (err) {
        console.error("Failed to fetch books", err);
      }
    };

    fetchBooks();
  }, [filter, page]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(filter.toLowerCase()) ||
      book.genre.toLowerCase().includes(filter.toLowerCase()) ||
      book.author.toLowerCase().includes(filter.toLowerCase())
  );

  const handleRowClick = (id: number) => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Books</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by title / genre / author"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <table className="table table-hover table-bordered">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Published</th>
            <th>Rating</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <tr
                key={book.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(book.id)}
              >
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.published_year}</td>
                <td>{book.average_rating ?? "N/A"}</td>
                <td>
                  <Link
                    to={`/book/${book.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                No books found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <p>
          Page {page} of {totalPages}
        </p>
        <div className="btn-group">
          <button
            className="btn btn-outline-primary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <button
            className="btn btn-outline-primary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookList;
