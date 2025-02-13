import React, { useState } from "react";
import Header from "./components/Header";
import ChatBox from "./components/ChatBox";
import InputBox from "./components/InputBox";
import axios from "axios";
import "./styles/App.css";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (text: string) => {
    const userMessage: Message = { text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("/api/chat", { message: text });
      const botMessage: Message = { text: response.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="chat-container">
        <ChatBox messages={messages} />
        <InputBox onSend={sendMessage} />
      </div>
    </div>
  );
};

export default App;
