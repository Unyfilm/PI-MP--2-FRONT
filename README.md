## 🧾 **README.md**
---

## 🎬 **Plataforma de Películas – Unyfilm**

Este repositorio contiene el **frontend** del proyecto académico **“Unyfilm”**, desarrollado como parte del curso **Proyecto Integrador I (2025-2)**.

El objetivo es construir una plataforma web de streaming donde los usuarios puedan **explorar, reproducir, valorar y comentar películas**, disfrutando de una experiencia **accesible, moderna y responsiva**, en conexión con un **backend** y una **base de datos** en la nube.

---

## 🚀 Tecnologías utilizadas

| Categoría                   | Tecnologías                              |
| --------------------------- | ---------------------------------------- |
| ⚙️ **Framework base**       | Vite.js                                  |
| 💻 **Librería principal**   | React                                    |
| 🧩 **Lenguaje tipado**      | TypeScript                               |
| 🧭 **Enrutamiento SPA**     | React Router                             |
| 🎨 **Estilos**              | SASS (SCSS)                              |
| 🔗 **Consumo de API**       | Fetch API                                |
| ♿ **Accesibilidad**         | WCAG 2.1 + Heurísticas de Nielsen        |
| 🧰 **Documentación**        | JSDoc                                    |
| ⚙️ **Configuración**        | Variables de entorno `VITE_`             |

---

## 📂 Estructura del proyecto

```bash
src/
├── components/         # Componentes reutilizables
├── pages/              # Vistas principales
├── routes/             # Definición central de rutas
├── services/           # Consumo de API (fetch)
├── contexts/           # Contextos (auth, favoritos)
├── styles/             # SCSS global y parciales
└── main.tsx            # Punto de entrada
```

---

## ⚙️ Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/<usuario>/PI-MP2-Frontend.git
cd PI-MP2-Frontend
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crea un archivo `.env.local` con variables `VITE_` (ver `env.example`).

### 4️⃣ Ejecutar en modo desarrollo

```bash
npm run dev
```

---

## 🌐 Despliegues

| Entorno      | Servicio  | URL                                      |
| ------------ | --------- | ---------------------------------------- |
| Frontend     | Vercel    | https://pi-mp-2-front.vercel.app/        |

---

## ✅ Checklist de requisitos (Sprint 1–3)

- [x] Menú, Home, About, Footer y Site Map
- [x] Reproductor: reproducir/pausar/seek/volumen/fullscreen
- [x] Favoritos: añadir/ver/eliminar
- [x] Calificaciones: interactivo y estadísticas
- [x] Comentarios: CRUD con validaciones
- [x] Subtítulos activables ES/EN
- [x] Autenticación: registro, login, logout, recuperación por email
- [x] Perfil: editar datos y cambiar contraseña
- [x] Eliminar cuenta (confirmación por contraseña)
- [x] Fetch API puro para GET/POST/PUT/DELETE
- [x] Variables de entorno `VITE_`
- [x] Responsivo
- [x] Heurísticas de usabilidad (10) y WCAG 2.1 (4) explicadas en “Mostrar ayuda”

> Nota: el botón “Mostrar ayuda” documenta las 10 heurísticas y 4 pautas WCAG implementadas.

---

## ♿ Accesibilidad (WCAG)

Pautas cubiertas en la UI y documentadas en el modal de ayuda:
- 1.4.3 Contraste (mínimo)
- 2.1.1 Teclado
- 2.4.7 Focus visible
- 3.3.1 Identificación de errores

---

## 🧠 Gestión y control de versiones

- Metodología SCRUM (sprints)
- GitHub con PRs y revisiones

---

## 👥 Equipo

Proyecto académico – Frontend en React + TS + SASS.

