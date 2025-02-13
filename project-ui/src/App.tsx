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

// 📌 Reemplaza con tu dominio en Fly.io
const API_URL = "https://tu-app.fly.dev/chat";

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false); // Para mostrar indicador de carga

  const sendMessage = async (text: string) => {
    const userMessage: Message = { text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true); // Indicar que se está procesando la respuesta

    try {
      const response = await axios.post(API_URL, { message: text }, {
        headers: { "Content-Type": "application/json" }
      });

      const botMessage: Message = { text: response.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      const errorMessage: Message = { text: "⚠️ Error: No se pudo obtener respuesta.", sender: "bot" };
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
        {loading && <p className="loading">⏳ Pensando...</p>} {/* Indicador de carga */}
        <InputBox onSend={sendMessage} />
      </div>
    </div>
  );
};

export default App;
