import React, { useRef } from "react";

function ChatInput({
  text,
  setText,
  sendMessage,
  handleKeyDown,
  connected,
  client,
  username,
}) {
  const typingTimeoutRef = useRef(null);

  const handleTyping = (e) => {
    const value = e.target.value;
    setText(value);
    if (!client || !username) return;


    client.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        type: "TYPING",
        sender: username,
        typing: true,
      }),
    });

    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    
    typingTimeoutRef.current = setTimeout(() => {
      client.publish({
        destination: "/app/chat",
        body: JSON.stringify({
          type: "TYPING",
          sender: username,
          typing: false,
        }),
      });
    }, 1500);
  };

  return (
    <div className="chat-input">
      <input
        value={text}
        onChange={handleTyping}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />

      <button onClick={sendMessage} disabled={!connected}>
        ➤
      </button>
    </div>
  );
}

export default ChatInput;
