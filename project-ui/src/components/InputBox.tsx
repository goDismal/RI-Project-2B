import React, { useState } from "react";
import "../styles/App.css";

interface InputBoxProps {
  onSend: (text: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ onSend }) => {
  const [message, setMessage] = useState<string>("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage(""); // Limpiar input después de enviar mensaje
    }
  };

  // Detectar tecla "Enter"
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita que se haga un salto de línea
      handleSend();
    }
  };

  return (
    <div className="input-box">
      <input
        type="text"
        placeholder="Escribe tu mensaje..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress} // Capturar tecla Enter
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
};

export default InputBox;
