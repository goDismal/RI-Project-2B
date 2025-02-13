import React, { useEffect, useRef } from "react";
import "../styles/App.css";

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface ChatBoxProps {
  messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Hacer scroll al último mensaje cuando cambian los mensajes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-box">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender}`}>
          {msg.text}
        </div>
      ))}
      <div ref={chatEndRef} /> {/* Elemento invisible para hacer scroll */}
    </div>
  );
};

export default ChatBox;
