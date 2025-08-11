/**
 * Agrega un producto al carrito
 * @param {string} productId - El ID del producto
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtns = document.querySelectorAll("[data-product-id]");
  const cartId = window.cartId || null;

  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", async function () {
      const productId = this.dataset.productId;
      if (!cartId) {
        if (window.Swal) {
          window.Swal.fire({
            toast: true,
            position: "top-end",
            timer: 2000,
            showConfirmButton: false,
            icon: "error",
            title: "No se encontró tu carrito",
            text: "Refresca la página o crea uno nuevo",
          });
        }
        return;
      }
      const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: 1 }),
      });
      if (window.Swal) {
        if (res.ok) {
          window.Swal.fire({
            toast: true,
            position: "top-end",
            timer: 1500,
            showConfirmButton: false,
            icon: "success",
            title: "Producto agregado",
          });
        } else {
          window.Swal.fire({
            toast: true,
            position: "top-end",
            timer: 2000,
            showConfirmButton: false,
            icon: "error",
            title: "Error al agregar",
          });
        }
      }
    });
  });
});
