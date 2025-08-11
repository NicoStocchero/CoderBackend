import Swal from "sweetalert2";

const inputFirstName = document.getElementById("first_name");
const inputLastName = document.getElementById("last_name");
const inputAge = document.getElementById("age");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const buttonRegister = document.getElementById("register");

/**
 * Manejador de envío del formulario de registro
 * @param {Event} e - El evento de envío del formulario
 * @returns {void}
 */
if (buttonRegister) {
  buttonRegister.addEventListener("click", async (e) => {
    e.preventDefault();
    const first_name = inputFirstName.value.trim();
    const last_name = inputLastName.value.trim();
    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();
    const age = parseInt(inputAge.value, 10);

    if (!first_name || !last_name || !email || !password || Number.isNaN(age)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, complete todos los campos",
      });
      return;
    }

    try {
      const response = await fetch("/api/sessions/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email, password, age }),
      });
      const data = await response.json();
      if (data.message === "User created") {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "Cuenta creada exitosamente",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/login";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error durante el registro",
      });
    }
  });
}
