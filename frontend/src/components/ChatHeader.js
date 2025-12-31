import React from "react";

function ChatHeader({ darkMode, setDarkMode, onLogout }) {
  return (
    <div className="chat-header">
      <h3>Real-Time Chat</h3>

      {}
      <div className="header-actions">
        {}
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="theme-btn"
          title="Toggle Theme"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;