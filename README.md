# ✈️ VoyageAI — Plataforma de Planificación de Viajes con IA

## 📌 Descripción de la Idea

VoyageAI es una plataforma web de planificación de viajes impulsada por inteligencia artificial. 
Permite a los usuarios explorar destinos turísticos, conocer las funcionalidades del servicio, 
comparar planes de precios y ponerse en contacto con el equipo. Desarrollada como Single Page 
Application (SPA) con React + Vite, simula un producto real con diseño profesional y experiencia 
de usuario moderna.

---

## 🧩 Problema que Resuelve

Planificar un viaje implica horas de investigación: buscar vuelos, hoteles, actividades, 
calcular presupuestos y coordinar itinerarios en múltiples plataformas. VoyageAI centraliza 
todo este proceso en un solo lugar, usando IA para generar itinerarios personalizados en 
segundos, adaptados al estilo de viaje y presupuesto de cada usuario.

---

## 🎯 Público Objetivo

- Viajeros frecuentes que buscan optimizar su tiempo de planificación.
- Personas que viajan por primera vez y no saben por dónde empezar.
- Usuarios interesados en experiencias de viaje personalizadas.
- Empresas que gestionan viajes corporativos.

---

## ⚙️ Framework Seleccionado

**React 18** con **Vite** como herramienta de bundling y servidor de desarrollo.

React fue seleccionado por su arquitectura basada en componentes reutilizables, su sistema 
de hooks para manejo de estado y efectos, y por ser el framework más utilizado en la industria 
para el desarrollo de SPAs modernas.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| React 18 | Framework principal (componentes, hooks, estado) |
| Vite | Bundler y servidor de desarrollo |
| CSS puro (variables, Grid, Flexbox) | Estilos globales y responsive |
| react-icons | Íconos SVG |
| Google Fonts | Tipografías: Playfair Display y DM Sans |
| IntersectionObserver API | ScrollSpy y Scroll Reveal |
| React Portal (createPortal) | Renderizado del modal fuera del árbol DOM |

---

## 🚀 Pasos de Instalación y Ejecución

### Requisitos previos
- Node.js v18 o superior
- npm v9 o superior

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/voyageai.git

# 2. Entrar a la carpeta del proyecto
cd voyageai

# 3. Instalar dependencias
npm install

# 4. Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build para producción

```bash
npm run build
```

---

## 🗂️ Estructura del Proyecto
```
voyageai/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── Carousel.jsx
│   │   ├── Stats.jsx
│   │   ├── Pricing.jsx
│   │   ├── Modal.jsx
│   │   ├── Contact.jsx
│   │   ├── Tooltip.jsx
│   │   └── Footer.jsx
│   ├── hooks/
│   │   ├── useScrollReveal.js
│   │   ├── useScrollSpy.js
│   │   └── useCounter.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```
