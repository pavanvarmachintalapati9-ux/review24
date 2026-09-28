import { useState } from 'react';
import axios from 'axios';

function AIReview({ movieId, title, description, genre }) {
  const [aiReview, setAiReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAIReview, setShowAIReview] = useState(false);

  const fetchAIReview = async () => {
    if (aiReview) {
      setShowAIReview(!showAIReview);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/movies/${movieId}/ai-review`);
      setAiReview(response.data.review);
      setShowAIReview(true);
    } catch (error) {
      console.error('Error fetching AI review:', error);
      alert('Failed to generate AI review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-review-section">
      <div className="ai-review-header">
        <span className="ai-icon">🤖</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '5px' }}>AI Film Critic</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Genuine analysis powered by Claude AI
          </p>
        </div>
        <button
          className="btn-submit"
          onClick={fetchAIReview}
          disabled={loading}
          style={{ marginLeft: '10px' }}
        >
          {loading ? '...' : (showAIReview && aiReview ? '✓' : 'Analyze')}
        </button>
      </div>

      {loading && (
        <div className="ai-review-loading">
          <div className="spinner"></div>
          <span>Analyzing movie...</span>
        </div>
      )}

      {showAIReview && aiReview && (
        <div className="ai-review-content">
          {aiReview}
        </div>
      )}
    </div>
  );
}

export default AIReview;
