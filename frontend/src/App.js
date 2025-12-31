import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import "./App.css";
import AuthForm from "./components/auth/AuthForm";

import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [joined, setJoined] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState(null);
  const username = user?.username;

  const messagesEndRef = useRef(null);

  useEffect(() => {
  const savedUser = localStorage.getItem("chatUser");
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
  setAppLoading(false);
}, []);



  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------- WEBSOCKET SETUP -------------------- */
  useEffect(() => {
    const socketUrl =
      process.env.REACT_APP_WS_URL || "ws://localhost:8080/ws";

    const stompClient = new Client({
      brokerURL: socketUrl,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        setConnected(true);

        stompClient.subscribe("/topic/messages", (msg) => {
          const message = JSON.parse(msg.body);
          setMessages((prev) => [...prev, message]);
          
        });
      },

      onDisconnect: () => {
        console.log(" Disconnected from WebSocket");
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, []);

  /*  DARK MODE  */
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  useEffect(() => {
  if (user && client && connected) {
    client.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        type: "JOIN",
        sender: username,
        text: `${username} joined the chat`,
        time: new Date().toISOString(),
      }),
    });
  }
}, [user, client, connected, username]);


  

  /* -------------------- SEND MESSAGE -------------------- */
  const sendMessage = () => {
  if (!text.trim() || !client || !connected) return;

  client.publish({
    destination: "/app/chat",
    body: JSON.stringify({
      type: "CHAT",
      sender: username,
      text: text,
      time: new Date().toISOString(),
    }),
  });

  setText("");
};



  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };


if (appLoading) {
  return <div className="loading-screen">Loading...</div>;
}


//  AUTH GATE 
if (!user) {
  return (
    <AuthForm
  onAuthSuccess={(data) => {
    setUser(data);
    localStorage.setItem("chatUser", JSON.stringify(data));
  }}
  isLogin={isLogin}
  setIsLogin={setIsLogin}
/>

  );
}

//logout function
const handleLogout = () => {
  if (client && username) {
    client.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        type: "LEAVE",
        sender: username,
        text: `${username} left the chat`,
        time: new Date().toISOString(),
      }),
    });
  }

  localStorage.removeItem("chatUser");
  setUser(null);
  setJoined(false);
};



  /* -------------------- UI -------------------- */
  return (
  <div className="chat-container">
    <ChatHeader
  darkMode={darkMode}
  setDarkMode={setDarkMode}
  onLogout={handleLogout}
/>


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
  </div>
);

}

export default App;
