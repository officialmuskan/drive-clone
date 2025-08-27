import React from "react";
import FolderView from "./FolderView";
import SearchImages from "./SearchImages";
import FolderModal from "./FolderModal";
import { FolderProvider, useFolderContext } from "./../ContextApi/Context";

const DashboardContent = () => {
  const {
    currentView,
    setCurrentView,
    loading,
    showFolderModal,
    setFolderModal,
    currentFolder,
    handleFolderCreated,
  } = useFolderContext();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="sidebar">
          <button
            className="sidebar-btn"
            onClick={() => {
              setCurrentView("folders");
              setFolderModal(true);
            }}
          >
            + New Folder
          </button>
          <button
            className={`sidebar-btn ${currentView === "folders" ? "active" : ""}`}
            onClick={() => setCurrentView("folders")}
          >
            Home
          </button>
          <button
            className={`sidebar-btn ${currentView === "search" ? "active" : ""}`}
            onClick={() => setCurrentView("search")}
          >
            Search Images
          </button>
        </div>

        <div className="main-content">
          {currentView === "folders" && <FolderView />}
          {currentView === "search" && <SearchImages />}
        </div>
      </div>

      {showFolderModal && (
        <FolderModal
          parentFolderId={currentFolder}
          onClose={() => setFolderModal(false)}
          onFolderCreated={handleFolderCreated}
        />
      )}
    </div>
  );
};

const Dashboard = () => (
  <FolderProvider>
    <DashboardContent />
  </FolderProvider>
);

export default Dashboard;
