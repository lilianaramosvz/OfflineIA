//frontend\src\utils\embeddings.js

async function getEmbedding(word) {
  const res = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "nomic-embed-text", prompt: word }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error("embedding error");
  const { embedding } = await res.json();
  return embedding;
}

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Devuelve { relacionadas: bool, cohesion: number } o null si hay error / pocas palabras
export async function analizarPalabrasDificiles(palabras) {
  if (palabras.length < 2) return null;

  const embeddings = await Promise.all(palabras.map(getEmbedding));

  let total = 0, pairs = 0;
  for (let i = 0; i < embeddings.length; i++) {
    for (let j = i + 1; j < embeddings.length; j++) {
      total += cosineSimilarity(embeddings[i], embeddings[j]);
      pairs++;
    }
  }

  const cohesion = total / pairs;
  return { relacionadas: cohesion > 0.65, cohesion };
}
