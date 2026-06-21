const carrito =
  JSON.parse(localStorage.getItem("carrito")) || [];

const lista = document.getElementById("lista-carrito");

let total = 0;

if (lista) {

  carrito.forEach((producto, index) => {

    total += Number(producto.precio);

    lista.innerHTML += `
      <div class="item-carrito">

        <div class="item-carrito-info">
          <h3>${producto.nombre}</h3>
          <p>$${producto.precio}</p>
        </div>

        <button
          onclick="eliminarProducto(${index})"
          class="btn btn-secondary"
        >
          Eliminar
        </button>

      </div>
    `;

  });

  const totalCarrito =
    document.getElementById("total-carrito");

  if (totalCarrito) {
    totalCarrito.textContent =
      `Total: $${total.toLocaleString()}`;
  }
}

function eliminarProducto(index) {

  const carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];

  carrito.splice(index, 1);

  localStorage.setItem(
    "carrito",
    JSON.stringify(carrito)
  );

  location.reload();
}

const btnVaciar =
  document.getElementById("vaciar-carrito");

if (btnVaciar) {

  btnVaciar.addEventListener("click", () => {

    localStorage.removeItem("carrito");

    location.reload();

  });

}

const btnWhatsapp =
  document.getElementById("enviar-whatsapp");

if (btnWhatsapp) {

  btnWhatsapp.addEventListener("click", () => {

    const carrito =
      JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    let mensaje =
      "Hola, quisiera realizar el siguiente pedido:%0A%0A";

    carrito.forEach((producto) => {

      mensaje +=
        `• ${producto.nombre} - $${producto.precio}%0A`;

    });

    mensaje += `%0A Total: $${total.toLocaleString()}`;

    window.open(
      `https://wa.me/5492613846766?text=${mensaje}`,
      "_blank"
    );

  });

}