import Swal from "sweetalert2";

const loginForm = document.getElementById("loginForm");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

/**
 * Manejador de envío del formulario de inicio de sesión
 * @param {Event} e - El evento de envío del formulario
 * @returns {void}
 */
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, complete todos los campos",
      });
      return;
    }

    try {
      const response = await fetch("/api/sessions/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status >= 400) {
        Swal.fire({
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
          icon: "error",
          title: data.message || "Inicio de sesión fallido",
        });
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          timer: 1200,
          showConfirmButton: false,
          icon: "success",
          title: "Inicio de sesión exitoso",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 900);
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
        icon: "error",
        title: "Ocurrió un error durante el inicio de sesión",
      });
    }
  });
}
