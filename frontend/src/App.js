import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import "./App.css";

import JoinChat from "./components/JoinChat";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (client && username) {
        client.publish({
          destination: "/app/chat",
          body: JSON.stringify({
            type: "LEAVE",
            sender: username,
            text: `${username} left the chat`,
          }),
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [client, username]);

  const sendMessage = () => {
    if (!connected || !text.trim()) return;

    client.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        type: "CHAT",
        sender: username,
        text: text,
      }),
    });

    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleJoin = () => {
    if (!username.trim()) return;

    setJoined(true);

    client.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        type: "JOIN",
        sender: username,
        text: `${username} joined the chat`,
      }),
    });
  };

  return (
    <div className="chat-container">
      {!joined ? (
        <JoinChat
          username={username}
          setUsername={setUsername}
          onJoin={handleJoin}
        />
      ) : (
        <>
          <ChatHeader />
          <MessageList
            messages={messages}
            username={username}
            messagesEndRef={messagesEndRef}
          />
          <ChatInput
            text={text}
            setText={setText}
            sendMessage={sendMessage}
            handleKeyDown={handleKeyDown}
            connected={connected}
          />
        </>
      )}
    </div>
  );
}

export default App;
