import React, { useState, useEffect } from 'react';
import { folderAPI, imageAPI } from '../../services/api';
import FolderModal from './FolderModal';
// import CreateFolder from './CreateFolder';
import ImageModal from './ImageModal';
import { useFolderContext } from '../ContextApi/Context';

const FolderView = () => {
    const {
    folderPath,
    folders,
    images,
    error,
    showImageModal,
    setImageModal,
    currentFolder,
    setCurrentFolder,
    showFolderModal,
    setFolderModal,
    handleFolderCreated,
  } = useFolderContext();

    const handleFolderClick = (folder) => {
      setCurrentFolder(folder._id);
    };
  
    const handleBreadcrumbClick = (folderId) => {
      setCurrentFolder(folderId);
    };
  
    const handleBackClick = () => {
      if (folderPath.length > 1) {
        const parentFolderId = folderPath[folderPath.length - 2].id;
        setCurrentFolder(parentFolderId);
      } else {
        setCurrentFolder(null);
      }
    };
  const handleImageUploaded = () => {
    setImageModal(false);
    loadFolderContents(currentFolder);
  };

  const getImageUrl = (image) => {
    return `http://localhost:5000/uploads/${image.filename}`;
  };


  return (
    <div className="folder-view">
      <div className="folder-header">
        <div className="breadcrumb">
          <button onClick={() => setCurrentFolder(null)} className="breadcrumb-btn">
            Home
          </button>
          {folderPath.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <span className="breadcrumb-separator"> / </span>
              <button 
                onClick={() => handleBreadcrumbClick(folder.id)}
                className="breadcrumb-btn"
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>
        <div className="action-buttons">
          <button 
            onClick={() => setFolderModal(true)}
            className="action-btn"
          >
            + Folder
          </button>
          <button 
            onClick={() => setImageModal(true)}
            className="action-btn"
          >
            + Image
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="folder-contents">
        {folders.length === 0 && images.length === 0 ? (
          <div className="empty-folder">
            <p>This folder is empty</p>
          </div>
        ) : (
          <>
            {folders.length > 0 && (
              <div className="folders-section">
                <h3>Folders</h3>
                <div className="folders-grid">
                  {folders.map((folder) => (
                    <div 
                      key={folder._id} 
                      className="folder-item"
                      onClick={() => handleFolderClick(folder)}
                    >
                      <div className="folder-icon">📁</div>
                      <div className="folder-name">{folder.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {images.length > 0 && (
              <div className="images-section">
                <h3>Images</h3>
                <div className="images-grid">
                  {images.map((image) => (
                    <div key={image._id} className="image-item">
                      <div className="image-preview">
                        <img 
                          src={getImageUrl(image)} 
                          alt={image.name}
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA3NEg2M0M2MS4zNDMxIDc0IDYwIDc1LjM0MzEgNjAgNzdWMTIzQzYwIDEyNC42NTcgNjEuMzQzMSAxMjYgNjMgMTI2SDEzN0MxMzguNjU3IDEyNiAxNDAgMTI0LjY1NyAxNDAgMTIzVjc3QzE0MCA3NS4zNDMxIDEzOC42NTcgNzQgMTM3IDc0SDExM00xMTMgNzRDMTEzIDY5LjU4MTcgMTA5LjQxOCA2NiAxMDUgNjZIOTVDOTAuNTgxNyA2NiA4NyA2OS41ODE3IDg3IDc0TTExMyA3NEg4NyIgc3Ryb2tlPSIjOUI5QkEwIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIHN0cm9rZT0iIzlCOUJBMCIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik04MCA4MEwxMjAgMTIwTTEyMCA4MEw4MCAxMjAiIHN0cm9rZT0iIzlCOUJBMCIgc3Ryb2tlLXdpZHRoPSI0Ii8+Cjwvc3ZnPgo=';
                          }}
                        />
                      </div>
                      <div className="image-name">{image.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showFolderModal && (
        <FolderModal
          parentFolderId={currentFolder}
          onClose={() => setFolderModal(false)}
          onFolderCreated={handleFolderCreated}
        />
      )}

      {showImageModal && (
        <ImageModal
          folderId={currentFolder}
          onClose={() => setImageModal(false)}
          onImageUploaded={handleImageUploaded}
        />
      )}
    </div>
  );
};

export default FolderView;
