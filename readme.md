# Sistema de Gestión

Sistema para la gestión de usuarios, empresas y puntos de venta, permitiendo establecer relaciones entre ellos. La aplicación cuenta con actualizaciones en tiempo real mediante Socket.IO.

## Características Principales

- Gestión de usuarios
- Gestión de empresas
- Gestión de puntos de venta
- Asociaciones entre entidades
- Actualizaciones en tiempo real
- Interfaz con Materialize CSS

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm (incluido con Node.js)

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/romeroedward18/prueba-tecnica.git
cd <nombre-del-directorio>
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar la base de datos:

- Crear una base de datos MySQL con el nombre `prueba_tecnica`
- Importar el archivo `database.sql`

4. Configurar las credenciales de la base de datos:
- user: root
- password: 123456
- host: localhost

## Iniciar la aplicación

```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

## Estructura del Proyecto

.
├── bin/
│   └── www # Punto de entrada de la aplicación
├── views/
│   ├── index.ejs # Vista principal
│   └── error.ejs # Vista de errores
├── app.js # Configuración principal de Express
├── package.json # Dependencias y scripts
└── README.md # Este archivo

## Tecnologías Utilizadas

- Express.js - Framework web
- MySQL - Base de datos
- Socket.IO - Actualizaciones en tiempo real
- EJS - Motor de plantillas
- Materialize CSS - Framework CSS
- Node.js - Entorno de ejecución

## Funcionalidades

1. **Usuarios**
   - Crear nuevos usuarios
   - Listar usuarios existentes
   - Asociar usuarios a empresas

2. **Empresas**
   - Crear nuevas empresas
   - Listar empresas
   - Ver usuarios asociados
   - Ver puntos de venta asociados

3. **Puntos de Venta**
   - Crear puntos de venta
   - Listar puntos de venta
   - Asociar a empresas

4. **Asociaciones**
   - Usuarios-Empresas con roles
   - Empresas-Puntos de venta
