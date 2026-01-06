import React from "react";

function MessageList({ messages, typingUser, messagesEndRef, username }) {
  return (
    <div className="chat-messages">
      {messages.map((m, i) => {
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

      {/* 🔹 BEAUTIFUL TYPING INDICATOR */}
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