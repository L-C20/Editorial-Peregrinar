
// =========================
// 🟣 CONTADOR (+ / -)
// (IMPORTANTE: funciones globales para onclick)
// =========================

window.sumar = function (btn) {
  const contenedor = btn.closest(".cantidad");
  if (!contenedor) return;

  const contador = contenedor.querySelector(".contador");
  if (!contador) return;

  contador.textContent = Number(contador.textContent) + 1;
};

window.restar = function (btn) {
  const contenedor = btn.closest(".cantidad");
  if (!contenedor) return;

  const contador = contenedor.querySelector(".contador");
  if (!contador) return;

  let valor = Number(contador.textContent);

  if (valor > 1) {
    contador.textContent = valor - 1;
  }
};


// =========================
// 🟢 AGREGAR AL CARRITO (CATÁLOGO)
// =========================

document.addEventListener("DOMContentLoaded", () => {

  const botones = document.querySelectorAll(".agregar-carrito");

  botones.forEach(btn => {

    btn.addEventListener("click", () => {

      const card = btn.closest(".product-content");

      const nombre = btn.dataset.producto;
      const precio = Number(btn.dataset.precio);

      const contadorEl = card.querySelector(".contador");
      const cantidad = contadorEl ? Number(contadorEl.textContent) : 1;

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      const existente = carrito.find(p => p.nombre === nombre);

      if (existente) {
        existente.cantidad += cantidad;
      } else {
        carrito.push({
          nombre,
          precio,
          cantidad
        });
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));


    });

  });

});


// =========================
// 🟡 CARGAR CARRITO (carrito.html)
// =========================

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const lista = document.getElementById("lista-carrito");

let total = 0;

if (lista) {

  lista.innerHTML = "";

  carrito.forEach((producto, index) => {

    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    lista.innerHTML += `
      <div class="item-carrito">

        <div class="item-carrito-info">
          <h3>${producto.nombre}</h3>

          <p>$${producto.precio} c/u</p>

          <div class="cantidad-carrito">
            <button onclick="restarCarrito(${index})">-</button>
            <span>${producto.cantidad}</span>
            <button onclick="sumarCarrito(${index})">+</button>
          </div>

          <strong>Subtotal: $${subtotal}</strong>
        </div>

      </div>
    `;
  });

  const totalCarrito = document.getElementById("total-carrito");

  if (totalCarrito) {
    totalCarrito.textContent =
      `Total: $${total.toLocaleString()}`;
  }
}


// =========================
// ❌ ELIMINAR PRODUCTO
// =========================

window.eliminarProducto = function (index) {

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  carrito.splice(index, 1);

  localStorage.setItem("carrito", JSON.stringify(carrito));

  location.reload();
};


// =========================
// 🧹 VACIAR CARRITO
// =========================

const btnVaciar = document.getElementById("vaciar-carrito");

if (btnVaciar) {
  btnVaciar.addEventListener("click", () => {
    localStorage.removeItem("carrito");
    location.reload();
  });
}


// =========================
// 📲 WHATSAPP
// =========================

const btnWhatsapp = document.getElementById("enviar-whatsapp");

if (btnWhatsapp) {

  btnWhatsapp.addEventListener("click", () => {

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    let mensaje = "Hola, quisiera realizar el siguiente pedido:%0A%0A";
    let total = 0;

    carrito.forEach(p => {

      const subtotal = p.precio * p.cantidad;
      total += subtotal;

      mensaje += `• ${p.nombre} x${p.cantidad} = $${subtotal}%0A`;
    });

    mensaje += `%0A TOTAL: $${total}`;

    window.open(
      `https://wa.me/5492613846766?text=${mensaje}`,
      "_blank"
    );

  });

}
window.sumarCarrito = function(index) {

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  carrito[index].cantidad += 1;

  localStorage.setItem("carrito", JSON.stringify(carrito));

  location.reload();
};

window.restarCarrito = function(index) {

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad -= 1;
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  location.reload();
};


function iniciarCarruseles() {

  const carruseles = document.querySelectorAll(".carousel");

  carruseles.forEach(carousel => {

    const slides = carousel.querySelectorAll(".slide");
    let index = 0;

    setInterval(() => {

      slides[index].classList.remove("active");

      index = (index + 1) % slides.length;

      slides[index].classList.add("active");

    }, 3000); // cada 3 segundos

  });
}

// iniciar cuando carga la página
document.addEventListener("DOMContentLoaded", iniciarCarruseles);