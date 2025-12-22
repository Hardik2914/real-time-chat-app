import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import "./App.css";


function App() {
  const [username, setUsername] = useState("");
const [joined, setJoined] = useState(false);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState(null);

  // runs ONCE when component loads
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,

      onConnect: () => {
        setConnected(true);

        stompClient.subscribe("/topic/messages", (msg) => {
          setMessages((prev) => [...prev, JSON.parse(msg.body)]);
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, []);

  const sendMessage = () => {
  if (!connected || !text.trim()) return;

  client.publish({
    destination: "/app/chat",
    body: JSON.stringify({
      sender: username,
      text: text,
    }),
  });

  setText("");
};

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
};


  return (
  <div className="chat-container">
    {!joined ? (
      <div className="join-chat">
        <h2>Enter Username</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
        />
        <button
          onClick={() => {
            if (username.trim()) setJoined(true);
          }}
        >
          Join Chat
        </button>
      </div>
    ) : (
      <>
        <div className="chat-header">Real-Time Chat</div>

        <div className="chat-messages">
          {messages.map((m, i) => {
  const isMine = m.sender === username;

  return (
    <div
      key={i}
      className={`chat-message ${isMine ? "my-message" : "other-message"}`}
    >
      {!isMine && <div className="sender-name">{m.sender}</div>}
      <div className="message-text">{m.text}</div>
    </div>
  );
})}


        </div>

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
      </>
    )}
  </div>
);

}

export default App;
