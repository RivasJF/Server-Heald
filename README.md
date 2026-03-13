<div align="center">
  <img src="./doc/logo.png" width="120" alt="Heald Logo" style="border-radius: 50%;"/>
</div>

<h1 align="center">Heald - Backend</h1>

## Description

Heald es el sistema backend para una aplicación de gestión de citas médicas, diseñado para agilizar la interacción entre pacientes, doctores y clínicas. Construido con [NestJS](https://nestjs.com/), un marco de trabajo progresivo de Node.js, ofrece una arquitectura robusta y escalable.

Este proyecto utiliza [Prisma](https://www.prisma.io/) como ORM para una interacción segura y eficiente con la base de datos PostgreSQL, y está completamente escrito en [TypeScript](https://www.typescriptlang.org/), lo que garantiza un código tipado y mantenible. Además, incluye configuraciones para [Docker](https://www.docker.com/), facilitando la contenerización y el despliegue de la aplicación.

### Características Principales

-   **Autenticación de Usuarios:** Sistema de registro e inicio de sesión seguro.
-   **Gestión dse Clínicas:** Registro y administración de la información de las clínicas.
-   **Gestión de Doctores:** Manejo de perfiles, horarios y disponibilidad de los doctores.
-   **Agendamiento de Citas:** Creación, consulta y cancelación de citas médicas.
-   **Búsqueda de Disponibilidad:** Endpoints para consultar los horarios disponibles de los doctores.
-   **Gestión de Horarios:** Configuración de los horarios de trabajo y descansos de los doctores.

![ImgDiagramDB](./doc/db_diagram.png)

## Getting Started

A continuación se describen dos métodos principales para levantar el proyecto:

### A. Desarrollo en Local (Recomendado)
Este método ejecuta la aplicación en tu máquina local y la base de datos en un contenedor de Docker.

#### 1. Pre-requisitos
Asegúrate de tener Node.js y Docker instalados. Luego, instala las dependencias del proyecto.
```bash
$ npm install
```

#### 2. Configuración del Entorno
Crea un archivo `.env` a partir del ejemplo.
```bash
# En Windows (Command Prompt)
copy .env.example .env

# En Windows (PowerShell) o Linux/macOS
cp .env.example .env
```
**Importante:** Abre el archivo `.env` y cambia el valor de `DB_HOST` a `localhost` para que tu aplicación local pueda conectarse a la base de datos en Docker.
```diff
- DB_HOST=db
+ DB_HOST=localhost
```

#### 3. Iniciar la Base de Datos
Levanta el contenedor de la base de datos PostgreSQL con Docker Compose.
```bash
# Inicia solo la base de datos en modo detached
$ docker compose -f docker-compose.dev.yml up -d
```

#### 4. Aplicar Migraciones
Aplica el esquema de la base de datos utilizando Prisma.
```bash
$ npx prisma migrate dev
```

#### 5. Ejecutar la Aplicación
Finalmente, inicia la aplicación de NestJS.
```bash
# Iniciar en modo de desarrollo con recarga automática
$ npm run start:dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

### B. Despliegue con Docker
Este método ejecuta tanto la aplicación como la base de datos en contenedores Docker, utilizando la imagen pre-construida `rivasjf/backendheald:0.1`.

#### 1. Configuración del Entorno
Crea el archivo `.env` si no existe. Para este método, los valores por defecto del archivo `.env.example` deberían funcionar correctamente, ya que los servicios se comunican a través de la red interna de Docker.
```bash
# En Windows (Command Prompt)
copy .env.example .env

# En Windows (PowerShell) o Linux/macOS
cp .env.example .env
```

#### 2. Levantar los Servicios
Construye y levanta todos los servicios definidos en `docker-compose.yml`.
```bash
# Construye (si es necesario) y levanta los contenedores en modo detached
$ docker compose up -d --build
```
Con esto, tanto la aplicación como la base de datos estarán corriendo en contenedores.

#### 3. Gestión de Contenedores
```bash
# Para detener y eliminar los contenedores y redes
$ docker compose down
```

## License
Este proyecto está licenciado bajo los términos de la [Licencia MIT](LICENSE).
