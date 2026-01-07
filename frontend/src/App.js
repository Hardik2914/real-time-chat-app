import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import "./App.css";
import AuthForm from "./components/auth/AuthForm";
import joinSound from "./assets/sounds/join.mp3";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [joined, setJoined] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);

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
    setJoined(true); 
  }
  setAppLoading(false);
}, []);

const joinAudio = useRef(null);

useEffect(() => {
  joinAudio.current = new Audio(joinSound);
}, []);



  /* AUTO SCROLL */
  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, typingUser]);


  /*  WEBSOCKET SETUP */
  useEffect(() => {
    const socketUrl =
      process.env.REACT_APP_WS_URL || "ws://localhost:8080/ws";

    const stompClient = new Client({
      brokerURL: socketUrl,
      reconnectDelay: 5000,

      onConnect: () => {
        setConnected(true);

        stompClient.subscribe("/topic/messages", (msg) => {
  const message = JSON.parse(msg.body);

   if (message.type === "TYPING" && message.sender !== username) {
    setTypingUser(message.typing ? message.sender : null);
    return;
  }

  
  if (message.type === "JOIN") {
  
  if (message.sender !== username && joinAudio.current) {
    joinAudio.current.play().catch(() => {});
  }

  setMessages((prev) => [...prev, message]);
  return;
}

if (message.type === "LEAVE") {
  setMessages((prev) => [...prev, message]);
  return;
}



  if (message.type === "CHAT") {
    setMessages((prev) => [...prev, message]);
  }
});

      },

      onDisconnect: () => {
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

  useEffect(() => {
 const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080";

const fetchMessages = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/messages`);

    if (!res.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await res.json();

    const history = data.map((msg) => ({
      type: "CHAT",
      sender: msg.sender,
      text: msg.content,
      time: msg.timestamp,
    }));

    setMessages(history);
  } catch (err) {
    console.error("Failed to load message history", err);
  }
};

  fetchMessages();
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


  

  /* SEND MESSAGE */
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



  /*  UI */
  return (
  <div className="chat-container">
    <ChatHeader
  darkMode={darkMode}
  setDarkMode={setDarkMode}
  onLogout={handleLogout}
/>


    <MessageList
      messages={messages}
        typingUser={typingUser}
        messagesEndRef={messagesEndRef}
        username={username}
    />

    <ChatInput
  text={text}
  setText={setText}
  sendMessage={sendMessage}
  handleKeyDown={handleKeyDown}
  connected={connected}
  client={client}
  username={username}
/>

  </div>
);

}

export default App;
