import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";
import { Book, Review } from "../types";
import api from "../utils/api";

const BookDetail: React.FC = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isEditingReview, setIsEditingReview] = useState<boolean>(false);

  const [userReview, setUserReview] = useState<Review | null>(null);
  const [otherReviews, setOtherReviews] = useState<Review[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const fetchBook = useCallback(() => {
    api
      .get(`books/${id}/`)
      .then((res) => {
        setBook(res.data.book);
        setUserReview(res.data.user_review);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const fetchOtherReviews = useCallback(async () => {
    try {
      const res = await api.get(`books/${id}/other-reviews/?page=${page}`);
      setOtherReviews(res.data.results);
      setTotalPages(Math.ceil(res.data.count / 2));
    } catch (err) {
      console.error(err);
    }
  }, [id, page]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  useEffect(() => {
    fetchOtherReviews();
  }, [fetchOtherReviews]);

  if (!book) return <div>Loading...</div>;

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (userReview) {
      await api.put(`/reviews/${userReview.id}/`, {
        rating,
        comment,
        book: book!.id,
      });
    } else {
      await api.post("/reviews/", {
        rating,
        comment,
        book: book!.id,
      });
    }
    fetchBook();
    cancelEdit();
  };

  const cancelEdit = () => {
    setIsEditingReview(false);
  };

  const deleteReview = (reviewId: number) => {
    api
      .delete(`reviews/${reviewId}/`)
      .then(fetchBook)
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 mb-4 shadow-sm">
        <h2>{book.title}</h2>
        <h5 className="text-muted mb-2">by {book.author}</h5>
        <p>
          <strong>Genre:</strong> {book.genre}
        </p>
        <p>
          <strong>Published:</strong> {book.published_year}
        </p>
        <p>
          <strong>Average Rating:</strong> ⭐{" "}
          {book.average_rating ?? "No ratings yet"}
        </p>
      </div>

      {/* My Review Section */}
      <div className="mb-4">
        <h4>{!userReview ? "Add a Review" : "My Review"}</h4>
        {userReview ? (
          <>
            {!isEditingReview ? (
              <div className="mt-2">
                <p>
                  <strong>Rating:</strong> {"⭐".repeat(userReview.rating)}
                </p>
                <p>{userReview.comment}</p>
                <small className="text-muted">
                  Updated on{" "}
                  {new Date(userReview.timestamp!).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </small>
                <div className="mt-2">
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => setIsEditingReview(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteReview(userReview.id!)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <ReviewForm
                  onSubmit={handleReviewSubmit}
                  initialRating={userReview.rating}
                  initialComment={userReview.comment}
                  isEditing={true}
                  onCancel={cancelEdit}
                />
              </div>
            )}
          </>
        ) : (
          <ReviewForm
            onSubmit={handleReviewSubmit}
            initialRating={0}
            initialComment=""
            isEditing={false}
          />
        )}
      </div>

      {/* Other Users' Reviews */}
      <div>
        <h4 className="mb-3">Reviews</h4>
        {otherReviews.length === 0 ? (
          <p>No other reviews yet.</p>
        ) : (
          otherReviews.map((review) => (
            <div key={review.id} className="border rounded p-3 mb-3">
              <p>
                <strong>{review.user}</strong>
              </p>
              <p>
                Rating: {"⭐".repeat(review.rating)} ({review.rating}/5)
              </p>
              <p>{review.comment}</p>
              <small className="text-muted">
                {new Date(review.timestamp!).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </small>
            </div>
          ))
        )}

        {totalPages > 1 && (
          <>
            <p className="text-muted mb-1">
              Page {page} of {totalPages}
            </p>
            <nav>
              <ul className="pagination">
                {[...Array(totalPages)].map((_, idx) => (
                  <li
                    key={idx}
                    className={`page-item ${page === idx + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
