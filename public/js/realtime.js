const socket = io();

const form = document.getElementById("productForm");
const productList = document.getElementById("productList");
const deleteLastBtn = document.getElementById("deleteLastBtn");

// Evento para agregar un nuevo producto
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const product = {
    title: formData.get("title"),
    price: parseFloat(formData.get("price")),
  };
  socket.emit("new-product", product);
  form.reset();
});

// Evento para actualizar la lista de productos
socket.on("update-products", (products) => {
  productList.innerHTML = "";
  products.forEach((prod) => {
    const li = document.createElement("li");
    li.classList.add("product-item");
    li.innerHTML = `<strong>${prod.title}</strong> <span>$${prod.price}</span>`;
    productList.appendChild(li);
  });
});

// Evento para eliminar el último producto
deleteLastBtn.addEventListener("click", () => {
  socket.emit("delete-last");
});
