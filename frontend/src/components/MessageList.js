import React from "react";

function MessageList({ messages, username, messagesEndRef }) {
  const formatTime = (time) => {
    if (!time) return "";

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-messages">
      {messages.map((m, i) => {
        // 🔹 JOIN / LEAVE system messages
        if (m.type === "JOIN" || m.type === "LEAVE") {
          return (
            <div key={i} className="system-message">
              <div className="message-text">{m.text}</div>
              <div className="system-time">{formatTime(m.time)}</div>
            </div>
          );
        }

        // 🔹 Normal chat messages
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

            <div
              className={`message-time ${
                isMine ? "time-mine" : "time-other"
              }`}
            >
              {formatTime(m.time)}
            </div>
          </div>
        );
      })}

      {/* 🔹 Auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
