from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import os
import faiss
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# 📌 Cargar la clave de OpenAI
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("🚨 ERROR: La clave OPENAI_API_KEY no está configurada!")

# 📌 Inicializar Flask
app = Flask(__name__)

# 📌 Ruta del archivo CSV local
CSV_PATH = "EmbeddingsEntrevistas.csv"

# 📌 Cargar embeddingsx
if not os.path.exists(CSV_PATH):
    raise FileNotFoundError(f"🚨 ERROR: No se encontró el archivo {CSV_PATH}")

print("📥 Cargando embeddings desde archivo local...")
df = pd.read_csv(CSV_PATH, dtype={"Embeddings": str})
df["Embeddings"] = df["Embeddings"].apply(lambda x: np.array(eval(x), dtype=np.float32))

# 📌 Preparar FAISS
embedding_dim = len(df["Embeddings"].iloc[0])
index = faiss.IndexFlatL2(embedding_dim)
embeddings = np.vstack(df["Embeddings"].values).astype(np.float32)
index.add(embeddings)

# 📌 Inicializar el modelo de embeddings
embeddings_model = OpenAIEmbeddings()
print("✅ Embeddings cargados correctamente.")



# 📌 Ruta de prueba para verificar que el API está activo
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"})

# 📌 Ruta para recibir preguntas
@app.route("/chat", methods=["POST"])
def chat_with_gpt():
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "El mensaje no puede estar vacío"}), 400

    # 📌 Convertir la pregunta en un embedding y buscar en FAISS
    user_embedding = np.array(embeddings_model.embed_query(user_message), dtype=np.float32).reshape(1, -1)
    _, idx = index.search(user_embedding, k=3)
    retrieved_texts = df.iloc[idx[0]]["Text"].values  # Extraer textos relevantes

    # 📌 Generar respuesta con GPT
    context = "\n".join(retrieved_texts)
    prompt = f"""
    Eres un asistente basado en entrevistas con candidatos presidenciales de Ecuador.
    Proporciona respuestas claras y detalladas en el idioma de la pregunta.

    Contexto relevante:
    {context}

    Pregunta: {user_message}

    Respuesta:"""

    llm = ChatOpenAI(model="gpt-4o-mini", openai_api_key=OPENAI_API_KEY)
    response = llm.invoke(prompt)

    return jsonify({"response": response.content})

@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "OPTIONS, GET, POST, PUT, DELETE"
    return response


# 📌 Ejecutar la aplicación en local
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
