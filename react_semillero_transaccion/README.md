# Portal Institucional de Semilleros de Investigación (UFPS) — Frontend React

Aplicación frontend desarrollada en **React 18 + TypeScript + Vite + Tailwind CSS + React Router** que consume los servicios REST y autenticación JWT del backend `spring_semillero_transaccion`.

## Características de esta primera iteración

1. **Login Institucional (`/login`)**:
   - Consume `POST /api/auth/login` para obtener el token JWT (`accessToken`, `expiresInSeconds`) y `GET /api/auth/yo` para identificar el correo y rol (`ROLE_ADMINISTRADOR`, `ROLE_DIRECTOR`, `ROLE_MIEMBRO`).
   - Incluye selector rápido de **Perfiles JWT de Demostración (`DemoData`)** con las 6 cuentas precargadas del backend (`admin@universidad.edu.co`, `director.software@universidad.edu.co`, `director.datos@universidad.edu.co`, `miembro1@universidad.edu.co`, `miembro2@universidad.edu.co`, `miembro3@universidad.edu.co`).
   - Manejo visual de errores `HTTP 401 Unauthorized` y errores de conexión.

2. **Catálogo General y Detalle de Semilleros (`/semilleros`)**:
   - Consume `GET /api/semilleros` (rol `ADMINISTRADOR`) y `GET /api/semilleros/{id}` para el panel de detalle.
   - Tarjetas de indicadores KPI dinámicos calculados a partir de los datos reales de PostgreSQL.
   - Buscador en tiempo real por nombre, sigla, director o línea de investigación, filtro por grupo de investigación y ordenamiento.
   - Vista maestro-detalle con información del director, misión, visión, objetivo general, líneas de investigación y tabla de **Nómina de Integrantes Estudiantiles** destacando al estudiante líder (`esLider = true`).

3. **Portal Mis Semilleros (`/mis-semilleros`)**:
   - Consume `GET /api/semilleros/mios` para los roles `DIRECTOR` y `MIEMBRO`.
   - Incluye barra de contexto técnico JWT, cambio rápido entre cuentas de prueba y probador interactivo de control de acceso `GET /api/semilleros/{id}` para evidenciar respuestas `200 OK` vs `403 Forbidden`.

## Ejecución

1. Asegúrate de tener el backend Spring Boot ejecutándose en `http://localhost:8080`:
   ```bash
   cd ../spring_semillero_transaccion
   ./mvnw spring-boot:run
   ```
2. Inicia el servidor de desarrollo de React:
   ```bash
   cd ../react_semillero_transaccion
   npm install
   npm run dev
   ```
3. Abre [http://localhost:5173](http://localhost:5173) en el navegador.

