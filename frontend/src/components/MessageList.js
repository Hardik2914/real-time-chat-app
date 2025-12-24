import React from "react";

function MessageList({ messages, username, messagesEndRef }) {
  return (
    <div className="chat-messages">
      {messages.map((m, i) => {
        if (m.type === "JOIN" || m.type === "LEAVE") {
          return (
            <div key={i} className="system-message">
              {m.text}
            </div>
          );
        }

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

      {/* auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
