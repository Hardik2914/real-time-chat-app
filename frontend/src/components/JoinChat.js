import React from "react";

function JoinChat({ username, setUsername, onJoin }) {
  return (
    <div className="join-chat">
      <h2>Enter Username</h2>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your name"
      />

      <button onClick={onJoin}>Join Chat</button>
    </div>
  );
}

export default JoinChat;
