const API_BASE_URL = "http://localhost:3000";


// ======================================================
// ELEMENTOS DEL DASHBOARD
// ======================================================

const productosTotal = document.querySelector(
  ".stats-grid .stat-card:nth-child(1) .stat-number"
);

const pedidosTotal = document.querySelector(
  ".stats-grid .stat-card:nth-child(2) .stat-number"
);

const categoriasTotal = document.querySelector(
  ".stats-grid .stat-card:nth-child(3) .stat-number"
);

const estadoTienda = document.querySelector(
  ".stats-grid .stat-card:nth-child(4) .stat-status"
);


// ======================================================
// CARGAR DASHBOARD
// ======================================================

async function cargarDashboard() {

  try {

    // ==================================================
    // OBTENER TOKEN
    // ==================================================

    const token = localStorage.getItem("token");


    if (!token) {

      window.location.href = "../login.html";

      return;

    }


    // ==================================================
    // CONSULTAR API
    // ==================================================

    const respuesta = await fetch(
      `${API_BASE_URL}/api/dashboard`,
      {
        method: "GET",

        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );


    const datos = await respuesta.json();


    // ==================================================
    // TOKEN INVÁLIDO / SESIÓN VENCIDA
    // ==================================================

    if (respuesta.status === 401) {

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      window.location.href = "../login.html";

      return;

    }


    if (!respuesta.ok) {

      throw new Error(
        datos.error ||
        "No se pudieron cargar los datos del dashboard."
      );

    }


    // ==================================================
    // PRODUCTOS
    // ==================================================

    if (productosTotal) {

      productosTotal.textContent =
        datos.productos;

    }


    // ==================================================
    // CATEGORÍAS
    // ==================================================

    if (categoriasTotal) {

      categoriasTotal.textContent =
        datos.categorias;

    }


    // ==================================================
    // PEDIDOS
    // ==================================================

    /*
      Todavía no tenemos la tabla de pedidos.
      Por eso dejamos el valor en 0.
    */

    if (pedidosTotal) {

      pedidosTotal.textContent = "0";

    }


    // ==================================================
    // ESTADO DE LA TIENDA
    // ==================================================

    if (estadoTienda) {

      estadoTienda.textContent =
        datos.tienda_activa
          ? "Activa"
          : "Inactiva";

    }


  } catch (error) {

    console.error(
      "Error al cargar el dashboard:",
      error
    );

  }

}


// ======================================================
// INICIAR DASHBOARD
// ======================================================

cargarDashboard();