## 🧾 **README.md**

````markdown
# 🎬 Plataforma de Películas – Unyfilm

Este repositorio contiene el **frontend** del proyecto académico **“Unyfilm”**, desarrollado como parte del curso **Proyecto Integrador I (2025-2)**.

El objetivo es construir una plataforma web de streaming donde los usuarios puedan **explorar, reproducir, valorar y comentar películas**, disfrutando de una experiencia **accesible, moderna y responsiva**, en conexión con un backend desplegado en **Render** y una base de datos en **MongoDB Atlas**.

---

## 🚀 Tecnologías utilizadas

| Categoría | Tecnologías |
|------------|--------------|
| ⚙️ Framework base | **Vite.js** |
| 💻 Librería principal | **React** |
| 🧩 Lenguaje tipado | **TypeScript** |
| 🧭 Enrutamiento SPA | **React Router** |
| 🎨 Estilos | **SASS (SCSS)** + **Tailwind CSS** |
| 🔗 Consumo de API | **Fetch API** |
| ♿ Accesibilidad | **WCAG 2.1** + 10 heurísticas de usabilidad |
| 🧰 Documentación | **JSDoc** |
| ⚙️ Configuración | Variables de entorno con prefijo `VITE_` |
| 🧾 Gestión del proyecto | **Metodología SCRUM** con **Taiga** |

---

## 📂 Estructura del proyecto

```bash
src/
├── components/         # Componentes reutilizables
│   ├── footer/
│   └── navbar/
├── layout/             # Layouts generales
├── pages/              # Vistas principales
│   ├── home/
│   ├── about/
│   ├── movie/
│   └── site-map/
├── routes/             # Definición central de rutas
├── index.scss          # Estilos globales (Tailwind + SASS)
├── main.tsx            # Punto de entrada
````

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

### 4️⃣ Ejecutar en modo desarrollo

```bash
npm run dev
```
---

## 🌐 Despliegues

| Entorno           | Servicio                                             | URL                                                                |
| ----------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| **Frontend**      | [Vercel](https://vercel.com/)                        | 🔗 *URL del proyecto (pendiente de despliegue)*                    |
| **Backend**       | [Render](https://render.com/)                        | 🔗 *URL del backend (API)*                                         |
| **Base de datos** | [MongoDB Atlas]|

---

## 🧩 Funcionalidades por Sprint

### 🎯 **Sprint 1: Gestión de usuarios + exploración**

* Registro, login, logout y recuperación de contraseña.
* Edición y eliminación de cuenta.
* Exploración del catálogo y reproducción de películas.
* Implementación de **2 heurísticas** y **1 pauta WCAG**.

### ⭐ **Sprint 2: Favoritos y calificaciones**

* CRUD de favoritos y calificaciones (1–5 estrellas).
* Mapa del sitio y mejoras de navegación.
* Aplicación de **4 heurísticas adicionales**.

### 💬 **Sprint 3: Comentarios y subtítulos**

* CRUD de comentarios por película.
* Activar/desactivar subtítulos en español e inglés.
* Cumplimiento de **7 heurísticas** y **3 pautas WCAG**.

---

## 🌈 Buenas prácticas implementadas

* Código **modular, documentado y tipado (JSDoc + TypeScript)**.
* Diseño **responsivo y accesible**.
* Uso de **variables de entorno** y buenas prácticas de seguridad.
* Estilos organizados con **SASS parciales** y utilidades de **Tailwind**.
* Cumplimiento progresivo de **heurísticas de Nielsen** y **pautas WCAG 2.1**.

---

## 🧠 Gestión y control de versiones

* Metodología **SCRUM**, gestionada con **Taiga**.
* Control de versiones con **GitHub** (una rama por integrante).
* **Pull Requests** con etiquetas de versión: `sprint-x-release`.
* Revisión y aprobación de código por el equipo antes del merge.

---

## 🔌 Integraciones

* **Backend:** Node.js + Express (Render).
* **Base de datos:** MongoDB Atlas.
* **Proveedores de video:** Cloudinary o Pexels API.
* **Despliegue CI/CD:** GitHub + Vercel.

---

## 🧾 Accesibilidad (WCAG)

Cumplimiento progresivo de las pautas:

* **Perceptible:** contraste, etiquetas, subtítulos.
* **Operable:** navegación por teclado, foco visible.
* **Comprensible:** consistencia visual y mensajes claros.
* **Robusto:** estructura semántica y compatibilidad con lectores de pantalla.

---

## 👥 Equipo de desarrollo

Proyecto desarrollado por un equipo de **5 integrantes**

| Rol                               | Responsabilidad                                  |
| --------------------------------- | ------------------------------------------------ |
| 🧩 **Frontend**                   | Interfaz en React + TypeScript + SASS + Tailwind |
| ⚙️ **Backend**                    | Lógica en Node.js + Express                      |
| 🗃️ **Base de datos**             | Modelos y colecciones en MongoDB Atlas           |
| 🧭 **Gestión de proyectos & VCS** | Taiga + GitHub (SCRUM)                           |
| 🧪 **Pruebas**                    | Heurísticas, WCAG y experiencia de usuario       |

---

## 🏁 Estado actual

✔️ Proyecto inicializado con configuración de entorno
✔️ Estructura base React + Vite + TS
✔️ Tailwind + SASS configurados
✔️ Rutas y layouts iniciales
⬜ Integración API backend (en progreso)
⬜ Implementación de heurísticas Sprint 1
---

## 📜 Licencia

Proyecto académico - Universidad del Valle
Curso **750018C - Proyecto Integrador I (2025-2)**