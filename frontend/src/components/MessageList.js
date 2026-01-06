import React from "react";

function MessageList({ messages, typingUser, messagesEndRef, username }) {
  return (
    <div className="chat-messages">
      {messages.map((m, i) => {
        // 🔹 SYSTEM MESSAGES (JOIN / LEAVE)
        if (m.type === "JOIN" || m.type === "LEAVE") {
          return (
            <div key={i} className="system-message">
              {m.text}
            </div>
          );
        }

        // 🔹 NORMAL CHAT MESSAGE
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
          </div>
        );
      })}

      {/* 🔹 TYPING INDICATOR */}
      {typingUser && (
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

export default MessageList;
