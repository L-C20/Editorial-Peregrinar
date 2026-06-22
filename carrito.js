
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const lista = document.getElementById("lista-carrito");
const totalHTML = document.getElementById("total-carrito");

function guardar() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function renderCarrito() {

  if (!lista) return;

  lista.innerHTML = "";

  let total = 0;

  carrito.forEach((p, index) => {

    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    lista.innerHTML += `
      <div class="item-carrito">

        <div class="item-carrito-info">
          <h3>${p.nombre}</h3>

          <p>$${p.precio} x ${p.cantidad}</p>

          <div class="cantidad-carrito">
            <button class="btn-mini" onclick="restarCarrito(${index})">-</button>
            <span>${p.cantidad}</span>
            <button class="btn-mini" onclick="sumarCarrito(${index})">+</button>
          </div>

          <strong>Subtotal: $${subtotal}</strong>
        </div>

      </div>
    `;
  });

  if (totalHTML) {
    totalHTML.textContent = `Total: $${total.toLocaleString()}`;
  }
}

// =========================
// ➕ SUMAR
// =========================

window.sumarCarrito = function(index) {
  carrito[index].cantidad++;
  guardar();
  renderCarrito();
};

// =========================
// ➖ RESTAR
// =========================

window.restarCarrito = function(index) {

  carrito[index].cantidad--;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  guardar();
  renderCarrito();
};

// =========================
// 🧹 VACIAR
// =========================

const btnVaciar = document.getElementById("vaciar-carrito");

if (btnVaciar) {
  btnVaciar.addEventListener("click", () => {
    carrito = [];
    guardar();
    renderCarrito();
  });
}

// =========================
// 📲 WHATSAPP
// =========================

const btnWhatsapp = document.getElementById("enviar-whatsapp");

if (btnWhatsapp) {

  btnWhatsapp.addEventListener("click", (e) => {

    e.preventDefault();

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

// iniciar
renderCarrito();

function actualizarContadorNavbar() {

  const contador = document.getElementById("contador-carrito");
  if (!contador) return;

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  let totalItems = 0;

  carrito.forEach(p => {
    totalItems += p.cantidad;
  });

  contador.textContent = totalItems;
}

// correr al cargar
actualizarContadorNavbar();