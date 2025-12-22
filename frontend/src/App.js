import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("CONNECTED FROM REACT");
        setConnected(true);

        stompClient.subscribe("/topic/messages", msg => {
          setMessages(prev => [...prev, JSON.parse(msg.body)]);
        });
      },

      onDisconnect: () => setConnected(false),
      onStompError: frame => console.error(frame),
    });

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, []);

  const send = () => {
    if (!connected || !text.trim()) return;

    client.publish({
      destination: "/app/chat",
      body: JSON.stringify({ text }),
    });

    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Real-Time Chat</h2>

      <div style={{ border: "1px solid black", height: 200, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <p key={i}>{m.text}</p>
        ))}
      </div>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={send} disabled={!connected}>
        Send
      </button>

      <p>{connected ? "Connected" : "Connecting..."}</p>
    </div>
  );
}

export default App;
