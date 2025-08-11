# Backend II: Diseño y Arquitectura Backend

Este documento complementa el proyecto existente y documenta los cambios de la Entrega Nº 1 (Usuarios, Autenticación y Autorización con JWT) del curso Backend II.

## Resumen de la entrega

- Modelo `User` con campos: `first_name`, `last_name`, `email` (único), `age`, `password` (hash), `cart` (ref a `Cart`), `role` (default `user`).
- Encriptación de contraseña con `bcrypt.hashSync` en el registro.
- Estrategias de Passport:
  - `register` (local): crea usuario y carrito asociado.
  - `login` (local): valida credenciales.
  - `jwt`: valida token desde cookie HTTP-only `token`.
- Sistema de login con JWT y endpoints bajo `/api/sessions`:
  - `POST /api/sessions/register`
  - `POST /api/sessions/login`
  - `GET /api/sessions/current` (requiere JWT)
  - `POST /api/sessions/logout`
- Vistas actualizadas a Bootstrap y menú global.

## Cómo correr

1. Variables de entorno:

```env
PORT=8080
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/coderbackend
JWT_SECRET=tuJWTSecreto
```

2. Instalar deps y correr:

```bash
npm install
npm run dev
```

## Estructura relevante

- `src/models/user.model.js`: esquema de usuario.
- `src/config/passport.config.js`: estrategias Local y JWT.
- `src/routes/sessions.router.js`: registro, login, current, logout.
- `app.js`: inicializa Passport y cookies; expone `/api/sessions`.
- `src/middlewares/ensureCart.js`: garantiza un carrito en `req.session.cartId`.
- Vistas: `src/views/*` con Bootstrap y `partials/menu`.

## Uso rápido de la API

- Registro

```http
POST /api/sessions/register
Content-Type: application/json
{
  "first_name": "Ada",
  "last_name": "Lovelace",
  "email": "ada@example.com",
  "password": "secret",
  "age": 28
}
```

- Login (setea cookie JWT `token` y sesión para vistas)

```http
POST /api/sessions/login
Content-Type: application/json
{ "email": "ada@example.com", "password": "secret" }
```

- Usuario actual (JWT)

```http
GET /api/sessions/current
Cookie: token=<jwt>
```

## Notas de diseño

- El `JWT` se entrega en cookie `httpOnly` para mitigar XSS. La validación se realiza con `passport-jwt` leyendo `req.cookies.token`.
- Se conserva `express-session` para carrito y renderizado SSR (no se eliminó lo que ya funcionaba).
- `ensureCart` mantiene `req.session.cartId` y se muestra acceso a `/carts/{{cartId}}` en el menú.

## Próximos pasos

- Incorporar autorización por `role` en endpoints de administración.
- Tests de integración de sesiones y vistas.
