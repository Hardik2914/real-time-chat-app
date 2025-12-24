import React from "react";

function ChatHeader({ darkMode, setDarkMode }) {
  return (
    <div className="chat-header">
      <span>Real-Time Chat</span>

      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </div>
  );
}

export default ChatHeader;
