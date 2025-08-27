import React, { useState } from 'react';
import { folderAPI } from '../../services/api';

const FolderModal  = ({ parentFolderId, onClose, onFolderCreated }) => {
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await folderAPI.create({
        name: folderName,
        parentFolderId
      });
      onFolderCreated();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Create New Folder</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-content">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Folder Name:</label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
                required
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Creating...' : 'Create Folder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FolderModal;