# API de Productos y Carritos 🛒

Este proyecto corresponde a la **Entrega Final de Programación Backend I (Coderhouse)**.  
Servidor avanzado que permite gestionar productos y carritos con persistencia en **MongoDB**, vistas dinámicas, paginación profesional, sesiones y gestión de carritos real como en un e-commerce moderno.

---

## 🆕 Nuevas funcionalidades

✅ **MongoDB como persistencia principal**  
✅ **Consultas profesionales:** Filtros, paginación y orden en productos  
✅ **Carrito profesional:** actualizar, vaciar, eliminar y populate  
✅ **Carrito único por usuario (sessions)**  
✅ **Vistas web modernas:** Productos, detalle y carrito  
✅ **Handlebars:** Vistas dinámicas y limpias  
✅ **Socket.io:** Actualizaciones en tiempo real  
✅ **Variables de entorno:** dotenv  
✅ **Arquitectura profesional:** Código modular y documentado

---

## 📁 Estructura del proyecto (Actualizada)

```
CoderBackend/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── views/
│   ├── middlewares/
│   └── config/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── .env
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

| Ruta               | Descripción                                         |
| ------------------ | --------------------------------------------------- |
| **/products**      | Listado de productos con paginación, filtros, orden |
| **/products/:pid** | Detalle de producto y botón “Agregar al carrito”    |
| **/carts/:cid**    | Vista de carrito con productos populados            |

---

## 📦 Endpoints API (Actualizados)

---

### 🔹 Productos `/api/products`

| Método | Endpoint | Descripción                                      | Query Params                     |
| ------ | -------- | ------------------------------------------------ | -------------------------------- |
| GET    | `/`      | Listar productos con filtros, paginación y orden | `limit`, `page`, `sort`, `query` |
| GET    | `/:pid`  | Obtener un producto por ID                       | -                                |
| POST   | `/`      | Agregar un nuevo producto                        | -                                |
| PUT    | `/:pid`  | Actualizar un producto                           | -                                |
| DELETE | `/:pid`  | Eliminar un producto                             | -                                |

### 🔹 Carritos `/api/carts`

| Método | Endpoint              | Descripción                                          |
| ------ | --------------------- | ---------------------------------------------------- |
| POST   | `/`                   | Crear un nuevo carrito vacío                         |
| GET    | `/:cid`               | Ver los productos de un carrito (con populate)       |
| POST   | `/:cid/products/:pid` | Agregar producto al carrito (o incrementar cantidad) |
| PUT    | `/:cid/products/:pid` | Actualizar cantidad de un producto en el carrito     |
| PUT    | `/:cid`               | Reemplazar todos los productos del carrito           |
| DELETE | `/:cid/products/:pid` | Eliminar un producto específico del carrito          |
| DELETE | `/:cid`               | Vaciar completamente el carrito                      |

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

| Tecnología      | Uso principal                       |
| --------------- | ----------------------------------- |
| Express         | Servidor web/API                    |
| Handlebars      | Motor de vistas                     |
| Mongoose        | ODM para MongoDB                    |
| express-session | Sessions de usuario/carrito         |
| connect-mongo   | Persistencia de sessions en MongoDB |
| dotenv          | Configuración segura                |
| Socket.io       | (opcional) tiempo real en productos |

---

## 🧪 Datos de prueba recomendados

> ⚠️ Ahora los datos se gestionan 100% en MongoDB (`coderbackend`).
> Ya no se usan ni `products.json` ni `carts.json`.  
> Podés cargar productos desde la API o scripts de carga inicial.

### 📁 `.env`

```env
PORT=8080
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/coderbackend
SESSION_SECRET=tuSecretoUltraPro
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

### 🛠 Requisitos técnicos cumplidos - Entrega Final

- Persistencia principal en MongoDB (Mongoose)
- API RESTful profesional para productos y carritos
- Filtros, orden y paginación avanzada en productos
- Populate de productos en carritos
- Vistas Handlebars modernas para productos y carrito
- Carrito único por usuario (session)
- Código modular, limpio y documentado

---

## 🚧 Próximas funcionalidades

🔜 **Autenticación:** Sistema de usuarios  
🔜 **Validaciones:** Middleware de validación  
🔜 **Testing:** Suite de pruebas unitarias

---

## 📬 Autor

Desarrollado por **Nicolás Stocchero**  
**Entrega Final** para el curso **Programación Backend I: Desarrollo Avanzado de Backend - Coderhouse**

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**.  
Podés usarlo, modificarlo y distribuirlo libremente.
