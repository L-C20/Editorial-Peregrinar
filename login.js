const API_BASE_URL = "http://localhost:3000";

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginError = document.getElementById("loginError");


// ======================================================
// LOGIN
// ======================================================

loginForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  loginError.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;


  if (!email || !password) {

    loginError.textContent =
      "Completá el email y la contraseña.";

    return;
  }


  loginButton.disabled = true;

  loginButton.textContent = "Ingresando...";


  try {

    const respuesta = await fetch(
      `${API_BASE_URL}/api/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })
      }
    );


    const datos = await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        datos.error || "No se pudo iniciar sesión."
      );
    }


    // ==================================================
    // GUARDAR SESIÓN
    // ==================================================

    localStorage.setItem(
      "token",
      datos.token
    );


    localStorage.setItem(
      "usuario",
      JSON.stringify(datos.usuario)
    );


    // ==================================================
    // REDIRIGIR AL ADMIN
    // ==================================================

    window.location.href = "admin/index.html";


  } catch (error) {

    console.error("Error al iniciar sesión:", error);

    loginError.textContent =
      error.message ||
      "Ocurrió un error al iniciar sesión.";

    loginButton.disabled = false;

    loginButton.textContent = "Iniciar sesión";
  }

});