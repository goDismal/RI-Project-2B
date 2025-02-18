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

const API_URL = "http://localhost:5000/chat";

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    const userMessage: Message = { text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post(API_URL, { message: text }, {
        headers: { "Content-Type": "application/json" }
      });

      const botMessage: Message = { text: response.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      const errorMessage: Message = {
        text: "⚠️ No se pudo conectar con el servidor. Asegúrate de que Flask esté corriendo.",
        sender: "bot"
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="chat-container">
        <ChatBox messages={messages} />
        {loading && <p className="loading">⏳ Pensando...</p>}
        <InputBox onSend={sendMessage} />
      </div>
    </div>
  );
};

export default App;
