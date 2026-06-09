# ✈️ VoyageAI — Plataforma de Planificación de Viajes con IA

## 📌 Descripción de la Idea
VoyageAI es una plataforma web de planificación de viajes impulsada por inteligencia artificial. Permite a los usuarios explorar destinos turísticos, conocer las funcionalidades del servicio, comparar planes de precios y ponerse en contacto con el equipo. 

En esta actualización, la plataforma evoluciona a una **Single Page Application (SPA) avanzada con control de accesos**, incorporando un sistema de autenticación simulado por el lado del cliente basado en archivos estructurados JSON, persistencia de datos local y control de accesos por roles operativos, simulando el comportamiento de un producto real de producción con un diseño profesional y experiencia de usuario moderna.

---

## 🧩 Problema que Resuelve
Planificar un viaje implica horas de investigación: buscar vuelos, hoteles, actividades, calcular presupuestos y coordinar itinerarios en múltiples plataformas. VoyageAI centraliza todo este proceso en un solo lugar, usando IA para generar itinerarios personalizados en segundos, adaptados al estilo de viaje y presupuesto de cada usuario, protegiendo la información de la bitácora mediante sesiones de usuario personalizadas.

---

## 🎯 Público Objetivo
- Viajeros frecuentes que buscan optimizar su tiempo de planificación.
- Personas que viajan por primera vez y no saben por dónde empezar.
- Usuarios interesados en la privacidad y gestión de sus itinerarios turísticos.
- Administradores de plataformas que requieren analíticas del comportamiento de usuarios.

---

## ⚙️ Framework Seleccionado
**React 25** con **Vite** como herramienta de empaquetado, compilación y servidor de desarrollo ágil.

React fue seleccionado por su arquitectura reactiva basada en componentes modulares reutilizables, su eficiente manipulación del DOM virtual (*Virtual DOM reconciliation*) y la flexibilidad de su API de Contexto (`Context API`) para distribuir estados globales a lo largo de flujos complejos de navegación sin generar acoplamientos innecesarios.

---

## 🛡️ Características Técnicas Implementadas (Parcial II)
* **Autenticación Basada en JSON:** Validación de credenciales de acceso dinámicas extraídas en tiempo real desde un archivo centralizado `usuarios.json`.
* **Control de Acceso por Roles (RBAC):** Definición de perfiles operativos (`administrador` y `usuario`). Alteración dinámica de los componentes de la interfaz de usuario (como el *Sidebar* administrativo) según los privilegios del token del usuario activo.
* **Protección Avanzada de Rutas (Route Guards):** Implementación de componentes de envoltura especializados para el aislamiento de vistas:
  * `AuthGuard`: Restringe el acceso a la zona privada (`/dashboard`), redirigiendo a usuarios no autenticados hacia el login salvaguardando la ruta previa en el estado de navegación (`state.from`).
  * `GuestGuard`: Bloquea el acceso a las vistas de `/login` y `/registro` a usuarios que ya cuenten con una sesión activa.
  * `StepGuard`: Protege rutas procedimentales (como la confirmación de formularios) impidiendo su acceso directo por URL.
* **Persistencia de Datos Híbrida:** Uso del `localStorage` del navegador para sostener las credenciales de sesión activa, `useState` para interactividad síncrona de formularios y `Context API` para la distribución global del estado del tema de diseño y los datos del perfil de usuario.
* **Filtrado Optimizado con `useMemo`:** Implementación de un motor de búsqueda indexado bidireccional en tiempo real (por destino y estado del viaje) insensivo a mayúsculas y minúsculas (*case-insensitive*) que minimiza los ciclos de re-renderizado del navegador.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| React 25.0.2 | Framework principal (componentes, hooks, estado global) |
| Vite | Bundler, compilador y servidor de desarrollo |
| React Router Dom | Motor de enrutamiento SPA y protección de rutas (*Guards*) |
| CSS Puro (Variables, Grid, Flexbox) | Estilos elásticos, Responsive Design y modo oscuro nativo |
| react-icons | Kit de iconografía SVG |
| Google Fonts | Tipografías corporativas: Playfair Display y DM Sans |
| IntersectionObserver API | ScrollSpy y Scroll Reveal en la Landing Page |
| React Portal (`createPortal`) | Renderizado de modales e interfaces flotantes fuera del árbol DOM principal |

---

## 🚀 Pasos de Instalación y Ejecución

### Requisitos previos
- Node.js v18 o superior
- npm v9 o superior

### Instalación

```
# 1. Clonar el repositorio público
git clone [https://github.com/tu-usuario/voyageai.git](https://github.com/tu-usuario/voyageai.git)

# 2. Acceder al directorio raíz del proyecto
cd voyageai

# 3. Instalar la totalidad de dependencias requeridas (incluyendo React Router)
npm install

# 4. Levantar el servidor local en modo desarrollo
npm run dev
```
Una vez levantado el entorno, abre tu navegador e ingresa a http://localhost:5173.

##Compilación para Producción (Build)
Para empaquetar y optimizar la SPA para entornos de despliegue real, ejecuta:
npm run build

##🗂️ Estructura del Proyecto
```
voyageai/
├── public/
├── src/
│   ├── assets/           # Recursos multimedia e imágenes dinámicas
│   ├── components/       # Componentes visuales y reutilizables de la UI
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx   # Barra lateral reactiva al rol de usuario
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── Carousel.jsx
│   │   ├── Stats.jsx
│   │   ├── Pricing.jsx
│   │   ├── Modal.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── context/          # Inyección de estados globales (Context API)
│   │   ├── AuthContext.jsx   # Estado de sesión de usuario y localStorage
│   │   ├── ThemeContext.jsx  # Control centralizado de Modo Oscuro / Claro
│   │   └── FlowContext.jsx   # Búfer de datos transitorios de formularios
│   ├── data/             # Archivos estructurados JSON (Bases de datos estáticas)
│   │   ├── usuarios.json     # Credenciales, passwords y roles
│   │   ├── destinos.json     # Metadata del carrusel de viajes
│   │   ├── planes.json       # Datos y tarifas de suscripción
│   │   └── stats.json        # Estadísticas de la plataforma
│   ├── guards/           # Componentes de envoltura para control de acceso
│   │   ├── AuthGuard.jsx     # Bloqueo de rutas privadas
│   │   ├── GuestGuard.jsx    # Bloqueo de rutas para visitantes
│   │   └── StepGuard.jsx     # Verificación secuencial de formularios
│   ├── hooks/            # Hooks personalizados reactivos
│   │   ├── useScrollReveal.js
│   │   ├── useScrollSpy.js
│   │   └── useCounter.js
│   ├── views/            # Vistas principales de la aplicación SPA
│   │   ├── Home.jsx          # Landing page pública
│   │   ├── Login.jsx         # Formulario de acceso con validaciones
│   │   ├── Register.jsx      # Formulario de registro con Regex y control de duplicados
│   │   ├── Dashboard.jsx     # Panel privado de usuario (Filtros con useMemo)
│   │   ├── Admin.jsx         # Panel exclusivo para rol Administrador
│   │   └── Unauthorized.jsx  # Vista de denegación de acceso (Error 403)
│   ├── App.jsx           # Configuración central del Router y árbol de Guards
│   ├── index.css         # Configuración global de estilos y variables de tema
│   └── main.jsx          # Punto de entrada e inicialización de React
├── index.html
├── vite.config.js
└── package.json

---
