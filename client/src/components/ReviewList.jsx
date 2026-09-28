import { useState } from 'react';
import axios from 'axios';

function ReviewList({ reviews, onReplyAdded }) {
  const [expandedComments, setExpandedComments] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleCommentSubmit = async (reviewId) => {
    const text = commentInputs[reviewId]?.trim();
    if (!text) return;

    try {
      await axios.post(`/api/reviews/${reviewId}/comments`, {
        author: 'Anonymous User',
        text
      });
      setCommentInputs(prev => ({ ...prev, [reviewId]: '' }));
      onReplyAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleReplySubmit = async (commentId) => {
    const text = replyInputs[commentId]?.trim();
    if (!text) return;

    try {
      await axios.post(`/api/comments/${commentId}/replies`, {
        author: 'Anonymous User',
        text
      });
      setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
      onReplyAdded();
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <div>
              <div className="review-author">{review.author}</div>
              <div className="review-rating">
                <span>{renderStars(review.rating)}</span>
                <span>{review.rating}/5</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="review-badge">{review.reviewType.replace('-', ' ')}</span>
              <div className="review-date">{formatDate(review.createdAt)}</div>
            </div>
          </div>
          <p className="review-text">{review.comment}</p>

          {review.comments && review.comments.length > 0 && (
            <div className="comments-section">
              <div style={{ marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                💬 {review.comments.length} comment{review.comments.length !== 1 ? 's' : ''}
              </div>
              {expandedComments[review.id] && (
                <div>
                  {review.comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-author">{comment.author}</div>
                      <div className="comment-text">{comment.text}</div>
                      <div className="comment-date">{formatDate(comment.createdAt)}</div>

                      {comment.replies && comment.replies.length > 0 && (
                        <div style={{ marginTop: '8px', marginLeft: '10px', borderLeft: '2px solid #666', paddingLeft: '10px' }}>
                          {comment.replies.map((reply) => (
                            <div key={reply.id} style={{ marginBottom: '8px', fontSize: '12px' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '11px' }}>{reply.author}</div>
                              <div style={{ color: 'var(--text-secondary)' }}>{reply.text}</div>
                              <div className="comment-date">{formatDate(reply.createdAt)}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="reply-form">
                        <input
                          type="text"
                          className="reply-input"
                          placeholder="Reply to this comment..."
                          value={replyInputs[comment.id] || ''}
                          onChange={(e) => setReplyInputs(prev => ({
                            ...prev,
                            [comment.id]: e.target.value
                          }))}
                        />
                        <button
                          className="reply-submit"
                          onClick={() => handleReplySubmit(comment.id)}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginTop: '5px'
                }}
                onClick={() => setExpandedComments(prev => ({
                  ...prev,
                  [review.id]: !prev[review.id]
                }))}
              >
                {expandedComments[review.id] ? 'Hide comments' : 'Show comments'}
              </button>
            </div>
          )}

          <div className="reply-form">
            <input
              type="text"
              className="reply-input"
              placeholder="Add a comment..."
              value={commentInputs[review.id] || ''}
              onChange={(e) => setCommentInputs(prev => ({
                ...prev,
                [review.id]: e.target.value
              }))}
            />
            <button
              className="reply-submit"
              onClick={() => handleCommentSubmit(review.id)}
            >
              Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
