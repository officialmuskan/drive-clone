import React, { useState } from 'react';
import { imageAPI } from '../../services/api';

const ImageModal = ({ folderId, onClose, onImageUploaded }) => {
  const [imageName, setImageName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!imageName) {
        // Set default name from filename (without extension)
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setImageName(nameWithoutExt);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !imageName) {
      setError('Please select a file and enter a name');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('name', imageName);
    if (folderId) {
      formData.append('folderId', folderId);
    }

    try {
      await imageAPI.upload(formData);
      onImageUploaded();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Upload Image</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-content">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Image Name:</label>
              <input
                type="text"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                placeholder="Enter image name"
                required
              />
            </div>
            <div className="form-group">
              <label>Select Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            {selectedFile && (
              <div className="file-info">
                <p>Selected: {selectedFile.name}</p>
                <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
