const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage === "") return;

    // Mostrar mensaje del usuario
    const userMessageElement = document.createElement('div');
    userMessageElement.classList.add('message', 'user-message');
    userMessageElement.textContent = userMessage;
    chatBox.appendChild(userMessageElement);

    // Limpiar el campo de entrada
    userInput.value = '';

    // Simular respuesta de la IA (aquí deberías hacer una solicitud a la API de la IA)
    setTimeout(() => {
        const aiMessageElement = document.createElement('div');
        aiMessageElement.classList.add('message', 'ai-message');
        aiMessageElement.textContent = "Esto es una respuesta simulada de la IA.";
        chatBox.appendChild(aiMessageElement);

        // Hacer scroll hacia abajo
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}