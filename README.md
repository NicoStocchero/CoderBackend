# API de Usuarios, Autenticación y Autorización (Backend II)

Este proyecto corresponde a la Entrega Nº 1 de Backend II (Coderhouse).
Se implementa CRUD de usuarios, autenticación con JWT, y validación de sesión.

---

## 🆕 Nuevas funcionalidades

✅ Modelo `User` con todos los campos requeridos (incluye `age`, `role`, `cart`)  
✅ Contraseñas encriptadas con `bcrypt.hashSync`  
✅ Estrategias de Passport: Local (register/login) y JWT (current)  
✅ Login con JWT (cookie httpOnly)  
✅ Endpoint `/api/sessions/current` para validar token y devolver el usuario  
✅ Vistas y menú en Bootstrap, con flujo de login/registro  
✅ Routers usando `CustomRouter` y controladores modularizados

## 📁 Estructura del proyecto (Actualizada)

```
CoderBackend/
├── src/
│   ├── routes/
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   ├── sessions.router.js
│   │   └── router.js  (CustomRouter)
│   ├── controller/
│   │   ├── products.controller.js
│   │   ├── cart.controller.js
│   │   └── sessions.controller.js
│   ├── models/
│   │   ├── products.model.js
│   │   ├── cart.model.js
│   │   └── user.model.js
│   ├── views/
│   │   ├── layouts/main.handlebars
│   │   ├── partials/menu.handlebars
│   │   ├── products.handlebars
│   │   ├── productDetail.handlebars
│   │   ├── cartDetail.handlebars
│   │   ├── login.handlebars
│   │   └── register.handlebars
│   ├── middlewares/
│   │   ├── authentication.js
│   │   └── ensureCart.js
│   └── config/
│       ├── database.js
│       └── passport.config.js
├── public/
│   ├── js/
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── cart.js
│   │   └── realtime.js
│   └── css/
├── app.js
├── README.Backend1.md
└── README.md (este archivo)
```

---

## 🚀 Cómo ejecutar el proyecto

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

### 🔐 Generar y configurar JWT_SECRET

- Node.js:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- OpenSSL:
  ```bash
  openssl rand -hex 48
  ```
- Agregalo a tu `.env` en una sola línea:
  ```env
  JWT_SECRET=EL_VALOR_GENERADO
  ```
- Tips: no uses comillas; si lo cambiás, los tokens previos dejan de ser válidos; tras editar `.env`, reiniciá el servidor (en nodemon: `rs`).

---

## 📦 Módulos clave

- `src/models/user.model.js`: esquema de usuario.
- `src/config/passport.config.js`: estrategias Local y JWT.
- `src/routes/sessions.router.js`: registro, login, current, logout.
- `src/controller/sessions.controller.js`: controladores de sesiones (modularización de `/api/sessions`).
- `src/routes/router.js`: `CustomRouter` reutilizado en todos los routers.
- `app.js`: inicializa Passport y cookies; expone `/api/sessions`.
- `src/middlewares/ensureCart.js`: garantiza un carrito en `req.session.cartId`.
- Vistas: `src/views/*` con Bootstrap y `partials/menu`.

---

## 🌐 Rutas web

| Ruta             | Descripción                               |
| ---------------- | ----------------------------------------- |
| `/products`      | Listado con paginación y filtros          |
| `/products/:pid` | Detalle de producto                       |
| `/carts/:cid`    | Carrito del usuario (productos populados) |

---

## 📦 Endpoints API (Usuarios y Sesiones)

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

---

## 🧠 Notas de diseño

- El `JWT` se entrega en cookie `httpOnly` para mitigar XSS. La validación se realiza con `passport-jwt` leyendo `req.cookies.token`.
- Se conserva `express-session` para carrito y renderizado SSR (no se eliminó lo que ya funcionaba).
- `ensureCart` mantiene `req.session.cartId` y se muestra acceso a `/carts/{{cartId}}` en el menú.

---

## 📄 Formato de entrega y criterios (Coderhouse)

Entrega N° 1 – Consigna: CRUD de usuarios, autenticación y autorización sobre el ecommerce base.

### Criterios de evaluación

- Modelo de Usuario y Encriptación:
  - `User` con campos: `first_name`, `last_name`, `email` (único), `age`, `password` (hash), `cart`, `role` (default `user`).
  - Contraseña encriptada correctamente con `bcrypt.hashSync`.
- Estrategias de Passport:
  - Configuradas para registro/login (Local) y validación de token (JWT).
  - Correcta autenticación/autorización de usuarios.
- Sistema de Login y JWT:
  - Login genera JWT válido y se asigna al usuario autenticado.
  - Token JWT válido para acciones protegidas.
- Estrategia “current” y endpoint `/api/sessions/current`:
  - Valida el usuario logueado y devuelve datos asociados al JWT.
  - Manejo de errores ante token inválido o inexistente.

> Nota: Se conserva `README.Backend1.md` para la entrega del curso I.

## Próximos pasos

- Incorporar autorización por `role` en endpoints de administración.
- Tests de integración de sesiones y vistas.
