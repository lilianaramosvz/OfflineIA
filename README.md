# Lumi — Tutor de Lectura Oral con IA Local

Lumi es una app de lectura oral para niños de primaria.  
Funciona completamente offline: la IA corre localmente en la computadora y ningún dato sale del dispositivo.

---

# Requisitos

Antes de correr el proyecto necesitas:

## Node.js

- Node.js v18+ (recomendado v22)
- npm v9+

Descarga: https://nodejs.org

Verifica instalación:

```bash
node --version
npm --version
```

---

## Ollama

Ollama permite correr los modelos de IA localmente.

Descarga: https://ollama.com

Verifica instalación:

```bash
ollama --version
```

---

## Modelos de IA

Descarga los modelos necesarios:

```bash
# feedback y respuestas de Lumi
ollama pull llama3.2

# análisis de palabras difíciles (opcional)
ollama pull nomic-embed-text
```

> `nomic-embed-text` es opcional.  
> La app funciona sin él, pero se pierde el análisis semántico de palabras difíciles.

---

## Navegador compatible

La app usa Web Speech API para reconocimiento de voz.

Compatible con:
- Google Chrome
- Microsoft Edge

Firefox y Safari no soportan correctamente esta funcionalidad.

---

# Instalación

```bash
# clonar repositorio
git clone <url-del-repo>

# entrar al proyecto
cd OfflineIA/frontend

# instalar dependencias
npm install
```

---

# Ejecutar el proyecto

## 1. Iniciar Ollama

```bash
ollama serve
```

> En algunos sistemas Ollama ya corre automáticamente en segundo plano.

---

## 2. Iniciar la app

```bash
npm run dev
```

Abrir en:

```txt
http://localhost:5173
```

---

# Scripts disponibles

```bash
npm run dev       # servidor de desarrollo
npm run build     # build de producción
npm run preview   # preview del build
npm run lint      # revisar errores con eslint
```

---

# Stack principal

- React
- Vite
- React Router
- Ollama
- llama3.2
- Web Speech API
- JavaScript

---

# Estructura del proyecto

```txt
OfflineIA/
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── screens/
    │   ├── styles/
    │   ├── texts/
    │   └── utils/
    ├── package.json
    └── vite.config.js
```

---

# Notas

- La app no usa backend.
- Todo funciona localmente en el navegador y en Ollama.
- Ollama debe correr en `localhost:11434`.
- El navegador necesita permisos de micrófono.
- La fuente Fredoka se carga desde Google Fonts.
