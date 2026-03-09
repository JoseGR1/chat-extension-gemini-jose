# 🧭 Gemini Navigator

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Chrome Extension](https://img.shields.io/badge/platform-Chrome%20|%20Edge%20|%20Brave-lightgrey.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Gemini Navigator** es una extensión de navegador diseñada para mejorar la navegación en conversaciones largas dentro de **Google Gemini**.

La extensión añade un **navigator lateral inteligente** que detecta automáticamente los mensajes enviados por el usuario y crea un índice visual para moverse rápidamente entre distintas partes de la conversación.

Esto permite explorar chats largos sin tener que hacer scroll interminable, ofreciendo una experiencia de navegación mucho más fluida.

---

# ✨ ¿Qué hace esta extensión?

Cuando estás en una conversación de **Gemini**, la extensión:

- Detecta automáticamente los mensajes del usuario
- Genera un **navigator lateral compacto**
- Muestra **marcadores visuales** para cada mensaje
- Permite abrir un **panel expandido con el índice completo**
- Permite navegar rápidamente entre prompts

El diseño está pensado para integrarse visualmente con la interfaz de Gemini sin interferir con la experiencia normal del chat.

---

# ✨ Características principales

- 🧭 **Navigator lateral compacto**  
  Muestra pequeñas barras que representan los mensajes del usuario.

- 🖱️ **Navegación rápida por clic**  
  Haz clic en un mensaje del panel para saltar directamente a esa parte del chat.

- 📑 **Panel expandido con índice de mensajes**  
  Permite ver rápidamente todos los prompts enviados en la conversación.

- 🎯 **Marcador del mensaje seleccionado**  
  El navigator indica visualmente qué prompt está activo.

- 🧩 **Integración con Gemini**  
  Diseñado específicamente para la interfaz de Gemini.

- 🎨 **Diseño minimalista y moderno**  
  Interfaz compacta que no interfiere con el chat.

- 🚀 **Optimizado para rendimiento**  
  Construido usando **Chrome Extensions Manifest V3**.

---

# 🌐 Compatibilidad

La extensión funciona en navegadores basados en **Chromium**.

| Navegador | Estado |
| :--- | :---: |
| Google Chrome | ✅ Compatible |
| Microsoft Edge | ✅ Compatible |
| Brave | ✅ Compatible |
| Opera | ✅ Compatible |
| Vivaldi | ✅ Compatible |

---

# 🛠️ Instalación Manual

Como la extensión aún no está publicada en la tienda oficial, debe instalarse manualmente desde el código fuente.

## Opción A — Clonar el repositorio

Abre tu terminal y ejecuta:

```bash
git clone https://github.com/usuario/gemini-navigator.git
```

---

## Opción B — Descargar ZIP

1. Ve al repositorio en GitHub  
2. Haz clic en **Code**  
3. Selecciona **Download ZIP**  
4. Extrae el archivo en una carpeta

---

# ⚙️ Cargar la extensión en el navegador

### Chrome / Brave

Abre:

```
chrome://extensions/
```

### Microsoft Edge

Abre:

```
edge://extensions/
```

Luego:

1. Activa **Developer Mode** (Modo desarrollador)
2. Haz clic en **Load unpacked**
3. Selecciona la carpeta del proyecto
4. La extensión aparecerá instalada

---

# 🧑‍💻 Uso de la extensión

Una vez instalada:

1️⃣ Abre **https://gemini.google.com**

2️⃣ Entra a cualquier conversación

3️⃣ Aparecerá un **navigator lateral** en el lado derecho

4️⃣ Podrás ver pequeñas barras que representan tus mensajes

5️⃣ Al expandir el panel podrás ver el **índice completo**

6️⃣ Haz clic en cualquier mensaje para navegar rápidamente a esa parte del chat.

---

# 📂 Estructura del proyecto

El proyecto está organizado de forma modular para separar responsabilidades.

```
chat-extension-gemini/
│
├── manifest.json
│   Configuración principal de la extensión (Manifest V3)
│
├── popup.html
├── popup.js
├── popup.css
│   Interfaz del popup de la extensión
│
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│   Iconos utilizados por la extensión
│
├── styles/
│   └── content.css
│   Estilos del navigator lateral dentro de Gemini
│
└── src/
    └── content/
        │
        ├── main.js
        │   Punto de entrada del content script
        │
        ├── dom.js
        │   Utilidades para detectar elementos del DOM
        │
        ├── navigation.js
        │   Lógica para navegar entre mensajes
        │
        ├── storage.js
        │   Manejo de configuraciones en chrome.storage
        │
        ├── ui.js
        │   Renderizado del navigator lateral
        │
        └── platform/
            └── gemini.js
            Lógica específica para interactuar con la interfaz de Gemini
```

---

# 💻 Tecnologías utilizadas

- **JavaScript (ES6+)**
- **Chrome Extensions API (Manifest V3)**
- **HTML5**
- **CSS3**

---

*Diseñado para hacer que navegar conversaciones largas en Gemini sea mucho más fácil.* 🚀