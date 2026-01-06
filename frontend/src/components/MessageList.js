import React, { memo } from "react";

function MessageList({ messages, typingUser, messagesEndRef, username }) {
  
  
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-messages">
      {messages.map((m, i) => {
        // SYSTEM MESSAGES (JOIN / LEAVE)
        if (m.type === "JOIN" || m.type === "LEAVE") {
          return (
            <div key={i} className="system-message">
              {m.text}
            </div>
          );
        }

        // NORMAL CHAT MESSAGE
        const isMine = m.sender === username;

        return (
          <div
            key={i}
            className={`chat-message ${
              isMine ? "my-message" : "other-message"
            }`}
          >
            {!isMine && <div className="sender-name">{m.sender}</div>}
            
            <div className="message-text">{m.text}</div>

            {}
            <div className="message-time">
              {formatTime(m.time)}
            </div>
          </div>
        );
      })}

      {/* TYPING INDICATOR */}
      {typingUser && typingUser !== username && (
        <div className="typing-container">
          <div className="typing-bubble">
            <span className="typing-name">{typingUser}</span>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default memo(MessageList);