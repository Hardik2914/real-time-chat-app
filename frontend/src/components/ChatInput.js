import React from "react";

function ChatInput({ text, setText, sendMessage, handleKeyDown, connected }) {
  return (
    <div className="chat-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
      />

      <button onClick={sendMessage} disabled={!connected}>
        {/* Simple Send Icon */}
        ➤
      </button>
    </div>
  );
}

export default ChatInput;