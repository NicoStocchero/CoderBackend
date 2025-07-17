document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtns = document.querySelectorAll(".btn-cart[data-product-id]");
  const cartId = window.cartId || null;

  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", async function () {
      const productId = this.dataset.productId;
      if (!cartId) {
        alert(
          "No se encontró tu carrito. Refresca la página o crea uno nuevo."
        );
        return;
      }
      const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: 1 }),
      });
      if (res.ok) {
        alert("Producto agregado al carrito!");
      } else {
        alert("Error al agregar al carrito");
      }
    });
  });
});
