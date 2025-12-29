import React from "react";

function MessageList({ messages, username, messagesEndRef }) {
  const formatTime = (time) => {
    if (!time) return "";
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to generate a color from a name (optional, for fun avatars)
  const getAvatarColor = (name) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="chat-messages">
      {messages.map((m, i) => {
        if (m.type === "JOIN" || m.type === "LEAVE") {
          return (
            <div key={i} className="system-message">
              <span>{m.text}</span>
            </div>
          );
        }

        const isMine = m.sender === username;
        const initial = m.sender ? m.sender.charAt(0).toUpperCase() : "?";

        return (
          <div
            key={i}
            className={`chat-message ${isMine ? "my-message" : "other-message"}`}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* Header for other people: Avatar + Name */}
            {!isMine && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "5px", gap: "8px" }}>
                 {/* Simple CSS Avatar */}
                <div style={{
                  width: "24px", height: "24px", 
                  borderRadius: "50%", 
                  backgroundColor: getAvatarColor(m.sender),
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: "bold"
                }}>
                  {initial}
                </div>
                <div className="sender-name" style={{ margin: 0 }}>{m.sender}</div>
              </div>
            )}

            <div className="message-text">{m.text}</div>

            <div className={`message-time ${isMine ? "time-mine" : "time-other"}`}>
              {formatTime(m.time)}
            </div>
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;