const socket = io();

const form = document.getElementById("productForm");
const productList = document.getElementById("productList");
const deleteLastBtn = document.getElementById("deleteLastBtn");

/**
 * Manejador de envío del formulario de creación de producto
 * @param {Event} e - El evento de envío del formulario
 * @returns {void}
 */
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

/**
 * Manejador de actualización de la lista de productos
 * @param {Array} products - Los productos actualizados
 * @returns {void}
 */
socket.on("update-products", (products) => {
  productList.innerHTML = "";
  products.forEach((prod) => {
    const li = document.createElement("li");
    li.classList.add("product-item");
    li.innerHTML = `<strong>${prod.title}</strong> <span>$${prod.price}</span>`;
    productList.appendChild(li);
  });
});

/**
 * Manejador de clic en el botón de eliminación del último producto
 * @returns {void}
 */
deleteLastBtn.addEventListener("click", () => {
  socket.emit("delete-last");
});
