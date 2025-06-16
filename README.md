# API de Productos y Carritos 🛒

Este proyecto corresponde a la **Primera Entrega del curso de Backend en Node.js (Coderhouse)**. Se trata de un servidor Express que permite gestionar productos y carritos con persistencia de archivos JSON.

---

## 📁 Estructura del proyecto
```
CoderBackend/
├── src/
│ ├── routes/
│ │ ├── products.router.js
│ │ └── carts.router.js
│ ├── managers/
│ │ ├── ProductManager.js
│ │ └── CartManager.js
│ ├── data/
│ │ ├── products.json
│ │ └── carts.json
│ └── app.js
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Cómo ejecutar el proyecto

1. Clonar el repositorio:

```bash
git git clone https://github.com/nicolas-stocchero/CoderBackend
cd CoderBackend
```

2. Instalar dependencias:

```bash
npm install
```

3.  Iniciar el servidor:

```bash
node src/app.js
```

---

# 📦 Endpoints disponibles

---

## 🔹 Productos `/api/products`

| Método | Endpoint   | Descripción                    |
|--------|------------|--------------------------------|
| GET    | `/`        | Listar todos los productos     |
| GET    | `/:pid`    | Obtener un producto por ID     |
| POST   | `/`        | Agregar un nuevo producto      |
| PUT    | `/:pid`    | Actualizar un producto         |
| DELETE | `/:pid`    | Eliminar un producto           |

💡 **Los productos se guardan en `products.json` y contienen:**

`id`, `title`, `description`, `code`, `price`, `status`, `stock`, `category`, `thumbnails[]`

---

## 🔹 Carritos `/api/carts`

| Método | Endpoint                       | Descripción                                         |
|--------|--------------------------------|-----------------------------------------------------|
| POST   | `/`                            | Crear un nuevo carrito vacío                        |
| GET    | `/:cid`                        | Ver los productos de un carrito específico          |
| POST   | `/:cid/product/:pid`           | Agregar un producto al carrito (o incrementar qty)  |

💡 **Los carritos se guardan en `carts.json` y contienen:**

`id`, `products: [ { product, quantity } ]`

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
  }
]
```

### 📁 `carts.json`

```json
[]
```

---

## 🛠 Requisitos técnicos cumplidos

✅ Servidor Express escuchando en puerto 8080  
✅ Rutas `/api/products` y `/api/carts` usando router de Express  
✅ Manejo completo de productos: GET, POST, PUT, DELETE  
✅ Manejo de carritos: crear, consultar, agregar productos  
✅ Persistencia con sistema de archivos (`products.json`, `carts.json`)  
✅ ID autogenerado para productos y carritos  
✅ Código ordenado y comentado profesionalmente

---

## 📬 Autor

Desarrollado por **Nicolás Stocchero**  
Entrega para el curso **Programación Backend I: Desarrollo Avanzado de Backend- Coderhouse**

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**.  
Podés usarlo, modificarlo y distribuirlo libremente.