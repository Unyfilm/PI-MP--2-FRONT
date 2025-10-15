# UnyFilm Components

## Estructura Organizada

### 📁 **sidebar/**
- `UnyFilmSidebar.jsx` - Barra lateral de navegación
- `UnyFilmSidebar.css` - Estilos del sidebar

### 📁 **header/**
- `UnyFilmHeader.jsx` - Barra superior con buscador y perfil
- `UnyFilmHeader.css` - Estilos del header

### 📁 **home/**
- `UnyFilmHome.jsx` - Página principal con secciones de películas
- `UnyFilmHome.css` - Estilos del home

### 📁 **catalog/**
- `UnyFilmCatalog.jsx` - Página de catálogo con filtros
- `UnyFilmCatalog.css` - Estilos del catálogo

### 📁 **card/**
- `UnyFilmCard.jsx` - Tarjeta de película reutilizable
- `UnyFilmCard.css` - Estilos de la tarjeta

### 📁 **player/**
- `UnyFilmPlayer.jsx` - Reproductor de video
- `UnyFilmPlayer.css` - Estilos del reproductor

## 🎯 **Archivos Principales**
- `MovieApp.jsx` - Componente principal que orquesta todo
- `MovieApp.css` - Estilos del contenedor principal

## 🔗 **Flujo de Datos**
1. **MovieApp** → Orquesta todos los componentes
2. **Sidebar** → Navegación entre vistas
3. **Header** → Búsqueda y perfil de usuario
4. **Home/Catalog** → Muestran listas de películas
5. **Card** → Tarjeta individual de película
6. **Player** → Reproductor de video

## 📱 **Responsive Design**
Todos los componentes están optimizados para:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)
