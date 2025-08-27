import React, { useState } from 'react';
import { imageAPI } from '../../services/api';

const SearchImages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await imageAPI.search(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    return `http://localhost:5000/uploads/${image.filename}`;
  };

  return (
    <div className="search-images">
      <div className="search-header">
        <h2>Search Images</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by name..."
              className="search-input"
            />
            <button type="submit" disabled={loading} className="search-btn">
              {loading ? 'Searching...' : '🔍 Search'}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-results">
        {hasSearched && !loading && (
          <div className="results-info">
            Found {searchResults.length} image(s) matching "{searchQuery}"
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="images-grid">
            {searchResults.map((image) => (
              <div key={image._id} className="image-item search-result">
                <div className="image-preview">
                  <img 
                    src={getImageUrl(image)} 
                    alt={image.name}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIHN0cm9rZT0iIzlCOUJBMCIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik04MCA4MEwxMjAgMTIwTTEyMCA4MEw4MCAxMjAiIHN0cm9rZT0iIzlCOUJBMCIgc3Ryb2tlLXdpZHRoPSI0Ii8+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>
                <div className="image-info">
                  <div className="image-name">{image.name}</div>
                  {image.folder && (
                    <div className="image-location">
                      📁 {image.folder.path}
                    </div>
                  )}
                  <div className="image-date">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasSearched && !loading && searchResults.length === 0 && (
          <div className="no-results">
            <p>No images found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchImages;