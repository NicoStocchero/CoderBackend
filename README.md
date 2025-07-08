# API de Productos y Carritos 🛒

Este proyecto corresponde a la **Programación Backend I: Desarrollo Avanzado de Backend (Coderhouse) - Segunda Entrega**. Se trata de un servidor avanzado que permite gestionar productos y carritos con persistencia de archivos JSON, vistas dinámicas y actualizaciones en tiempo real.

---

## 🆕 Nuevas funcionalidades

✅ **Handlebars** - Motor de plantillas para vistas dinámicas  
✅ **Socket.io** - Actualizaciones en tiempo real  
✅ **Variables de entorno** - Configuración segura con dotenv  
✅ **Arquitectura mejorada** - Separación de responsabilidades  
✅ **Configuración robusta** - Manejo profesional de errores  
✅ **Vistas web** - Interfaz para gestionar productos

---

## 📁 Estructura del proyecto (Actualizada)

```
CoderBackend/
├── src/
│   ├── routes/
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   └── views.router.js          🆕
│   ├── managers/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   ├── views/                       🆕
│   │   ├── layouts/
│   │   └── [plantillas handlebars]
│   ├── config/                      🆕
│   │   └── database.js
│   ├── data/
│   │   ├── products.json
│   │   └── carts.json
│   └── models/                      🆕
├── public/                          🆕
│   ├── css/
│   ├── js/
│   └── images/
├── .env                             🆕
├── .env.example                     🆕
├── .gitignore
├── package.json
├── app.js
└── README.md
```

---

## 🚀 Cómo ejecutar el proyecto

1. Clonar el repositorio:

```bash
git clone https://github.com/NicoStocchero/CoderBackend
cd CoderBackend
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Iniciar el servidor en desarrollo:

```bash
npm run dev
```

O en producción:

```bash
npm start
```

El servidor estará disponible en: **http://localhost:8080**

---

## 🌐 Nuevas rutas web

| Ruta                  | Descripción                                    |
| --------------------- | ---------------------------------------------- |
| **/**                 | Vista principal con listado de productos       |
| **/realtimeproducts** | Vista con productos en tiempo real (Socket.io) |

---

## 📦 Endpoints API (Actualizados)

---

## 🔹 Productos `/api/products`

| Método | Endpoint | Descripción                | Query Params |
| ------ | -------- | -------------------------- | ------------ |
| GET    | `/`      | Listar todos los productos | `?limit=10`  |
| GET    | `/:pid`  | Obtener un producto por ID | -            |
| POST   | `/`      | Agregar un nuevo producto  | -            |
| PUT    | `/:pid`  | Actualizar un producto     | -            |
| DELETE | `/:pid`  | Eliminar un producto       | -            |

💡 **Los productos se guardan en `products.json` y contienen:**

`id`, `title`, `description`, `code`, `price`, `status`, `stock`, `category`, `thumbnails[]`

---

## 🔹 Carritos `/api/carts`

| Método | Endpoint             | Descripción                                        |
| ------ | -------------------- | -------------------------------------------------- |
| POST   | `/`                  | Crear un nuevo carrito vacío                       |
| GET    | `/:cid`              | Ver los productos de un carrito específico         |
| POST   | `/:cid/product/:pid` | Agregar un producto al carrito (o incrementar qty) |

💡 **Los carritos se guardan en `carts.json` y contienen:**

`id`, `products: [ { product, quantity } ]`

---

## ⚡ Funcionalidades en tiempo real

### 🔥 Socket.io Events

**Cliente → Servidor:**

- `new-product` - Agregar producto en tiempo real
- `delete-last` - Eliminar último producto

**Servidor → Cliente:**

- `update-products` - Actualización de lista de productos

---

## 🛠 Tecnologías utilizadas - Entrega 2

| Tecnología     | Versión | Propósito                    |
| -------------- | ------- | ---------------------------- |
| **Express**    | ^5.1.0  | Framework web                |
| **Handlebars** | ^8.0.3  | Motor de plantillas          |
| **Socket.io**  | ^4.8.1  | Comunicación en tiempo real  |
| **Mongoose**   | ^8.16.2 | ODM para MongoDB (preparado) |
| **dotenv**     | ^17.1.0 | Variables de entorno         |
| **Moment**     | ^2.30.1 | Manejo de fechas             |
| **Nodemon**    | ^3.1.10 | Desarrollo con hot reload    |

---

## 🧪 Datos de prueba recomendados

### 📁 `products.json`

```json
[
  {
    "id": 1,
    "title": "Paleta Pro Control",
    "description": "Paleta de pádel profesional con gran control",
    "code": "PPC001",
    "price": 220000,
    "status": true,
    "stock": 15,
    "category": "paletas",
    "thumbnails": ["images/paleta1.png"]
  },
  {
    "id": 2,
    "title": "Zapatillas Match Play",
    "description": "Zapatillas especiales para pádel indoor",
    "code": "ZMP002",
    "price": 150000,
    "status": true,
    "stock": 30,
    "category": "calzado",
    "thumbnails": ["images/zapatillas1.png"]
  }
]
```

### 📁 `.env`

```env
PORT=8080
NODE_ENV=development
```

---

## 🛠 Requisitos técnicos cumplidos - Entrega 2

### ✅ Funcionalidades básicas

- Servidor Express escuchando en puerto 8080
- Rutas `/api/products` y `/api/carts` usando router de Express
- Manejo completo de productos: GET, POST, PUT, DELETE
- Manejo de carritos: crear, consultar, agregar productos
- Persistencia con sistema de archivos (`products.json`, `carts.json`)
- ID autogenerado para productos y carritos

### ✅ Nuevas funcionalidades - Entrega 2

- Motor de plantillas Handlebars configurado
- Vistas dinámicas para mostrar productos
- Socket.io para actualizaciones en tiempo real
- Variables de entorno con dotenv
- Arquitectura modular y escalable
- Manejo profesional de errores
- Código documentado y organizado

---

## 🚧 Próximas funcionalidades

🔜 **Entrega 3:** Integración con base de datos  
🔜 **Autenticación:** Sistema de usuarios  
🔜 **Validaciones:** Middleware de validación  
🔜 **Testing:** Suite de pruebas unitarias

---

## 📬 Autor

Desarrollado por **Nicolás Stocchero**  
**Entrega 2** para el curso **Programación Backend I: Desarrollo Avanzado de Backend - Coderhouse**

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**.  
Podés usarlo, modificarlo y distribuirlo libremente.
