# E-commerce Backend (Entrega Final - Backend II)

Servidor de e-commerce con arquitectura profesional: JWT-only, Repository + Service, DTOs, autorización por roles, recuperación de contraseña por email, compra con tickets y buenas prácticas (CORS, Helmet, rate limiting, etc.).

---

## 🆕 Funcionalidades Clave

- **JWT-only**: login, current y logout sin sesiones de Express
- **Repository + Service**: separación de acceso a datos y lógica
- **DTO de Usuario**: `/api/sessions/current` no expone campos sensibles
- **Autorización por roles**: `admin` gestiona productos/usuarios, `user` gestiona su carrito y compra
- **Recuperación de contraseña**: email con token (1h), no permite repetir la anterior
- **Compra con ticket**: verifica stock, descuenta, genera `Ticket` y devuelve ítems no procesados
- **Buenas prácticas**: CORS, Helmet, Compression, rate limiting (login/forgot), cookies seguras

## 📁 Estructura del proyecto

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
│   │   ├── users.controller.js
│   │   └── sessions.controller.js
│   ├── repositories/
│   │   ├── product.repository.js
│   │   ├── cart.repository.js
│   │   └── user.repository.js
│   ├── services/
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   ├── user.service.js
│   │   ├── purchase.service.js
│   │   └── mail.service.js
│   ├── dto/
│   │   └── user.dto.js
│   ├── models/
│   │   ├── products.model.js
│   │   ├── cart.model.js
│   │   ├── user.model.js
│   │   └── ticket.model.js
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
│   │   ├── ensureCart.js
│   │   ├── authentication.js
│   │   ├── authorization.js
│   │   └── rateLimit.js
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
NODE_ENV=development
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/coderbackend
JWT_SECRET=tu_jwt_secreto
RESET_SECRET=tu_reset_secreto
APP_URL=http://localhost:8080
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
# SMTP opcional
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
MAIL_FROM="Ecommerce <no-reply@example.com>"
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

- `repositories/*`: acceso a datos (Mongoose encapsulado)
- `services/*`: lógica de negocio (productos, carritos, usuarios, compras, mailing)
- `dto/user.dto.js`: salida segura de usuario
- `middlewares/authorization.js`: control por roles
- `models/ticket.model.js`: tickets de compra
- `services/purchase.service.js`: verificación de stock y generación de tickets

---

## 🌐 Rutas web

| Ruta             | Descripción                               |
| ---------------- | ----------------------------------------- |
| `/products`      | Listado con paginación y filtros          |
| `/products/:pid` | Detalle de producto                       |
| `/carts/:cid`    | Carrito del usuario (productos populados) |

---

## 🔐 Autenticación y Sesiones

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

- Login (setea cookie JWT `token`)

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

- JWT en cookie `httpOnly`; validación con `passport-jwt` leyendo `req.cookies.token`
- Sin `express-session` (JWT-only). `ensureCart` persiste `cartId` en cookie
- CORS con `credentials: true`; en producción `secure: true` + `sameSite: "none"`
- Helmet y Compression habilitados; rate limit en login/forgot

---

## 🧪 Endpoints destacados

- Recuperación de contraseña

  - `POST /api/sessions/forgot` → body `{ email }`
  - `POST /api/sessions/reset` → body `{ token, password }`

- Autorización por roles

  - Productos (admin): `POST/PUT/DELETE /api/products`
  - Usuarios (admin): `GET/POST/PUT/DELETE /api/users`
  - Carritos (user): mutaciones de carrito y `POST /api/carts/:cid/purchase`

- Compra y tickets
  - `POST /api/carts/:cid/purchase` → `{ ticket, notProcessed }`

> El archivo `README.Backend1.md` queda como histórico de la entrega I.
