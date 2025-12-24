import React from "react";

function ChatInput({ text, setText, sendMessage, handleKeyDown, connected }) {
  return (
    <div className="chat-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />

      <button onClick={sendMessage} disabled={!connected}>
        Send
      </button>
    </div>
  );
}

export default ChatInput;
