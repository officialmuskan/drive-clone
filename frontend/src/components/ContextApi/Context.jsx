import React, { createContext, useContext, useState, useEffect } from "react";
import { folderAPI } from "../../services/api";

const FolderContext = createContext();

export const FolderProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState("folders");
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFolderModal, setFolderModal] = useState(false);
  const [showImageModal, setImageModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFolderContents(currentFolder);
    if (currentFolder) {
      loadFolderPath(currentFolder);
    } else {
      setFolderPath([]);
    }
  }, [currentFolder, images]);

  const loadFolderContents = async (folderId) => {
    try {
      setLoading(true);
      const response = await folderAPI.getFolderContents(folderId);
      setFolders(response.data.folders);
      setImages(response.data.images);
      setError("");
    } catch (error) {
      setError("Failed to load folder contents");
      console.error("Error loading folder contents:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolderPath = async (folderId) => {
    try {
      const response = await folderAPI.getFolderPath(folderId);
      setFolderPath(response.data);
    } catch (error) {
      console.error("Error loading folder path:", error);
    }
  };

  const handleFolderCreated = () => {
    setFolderModal(false);
    loadFolderContents(currentFolder);
  };

  return (
    <FolderContext.Provider
      value={{
        currentView,
        setCurrentView,
        folders,
        images,
        currentFolder,
        setCurrentFolder,
        folderPath,
        loading,
        showFolderModal,
        setFolderModal,
        showImageModal,
        setImageModal,
        error,
        handleFolderCreated,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

// custom hook for easier usage
export const useFolderContext = () => useContext(FolderContext);
