
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

    if (!slides.length) return;

    // IMPORTANTE: inicializar estado
    slides.forEach((s, i) => {
      s.classList.remove("active");
      if (i === 0) s.classList.add("active");
    });

    setInterval(() => {

      slides[index].classList.remove("active");

      index = (index + 1) % slides.length;

      slides[index].classList.add("active");

    }, 3000);

  });
}

// iniciar cuando carga la página
document.addEventListener("DOMContentLoaded", iniciarCarruseles);
const buttons = document.querySelectorAll(".filter-btn");
const items = document.querySelectorAll(".product-card");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {

    // quitar activo
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    items.forEach(item => {
      const category = item.dataset.category;

      if (filter === "todos" || category.split(" ").includes(filter)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });

  });
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

function iniciarDetalleCatalogo() {
  const modal = document.getElementById("product-modal");
  if (!modal) return;

  const cards = document.querySelectorAll(".catalog-grid .product-card");
  const modalGallery = document.getElementById("modal-gallery");
  const modalSlides = document.getElementById("modal-slides");
  const modalTag = document.getElementById("modal-product-tag");
  const modalTitle = document.getElementById("modal-product-title");
  const modalPrice = document.getElementById("modal-product-price");
  const modalDetail = document.getElementById("modal-product-detail");
  const modalCounter = document.getElementById("modal-contador");
  const modalAdd = document.getElementById("modal-agregar-carrito");
  const btnPrev = modal.querySelector(".modal-prev");
  const btnNext = modal.querySelector(".modal-next");
  const btnMinus = document.getElementById("modal-restar");
  const btnPlus = document.getElementById("modal-sumar");

  let activeIndex = 0;
  let activeProduct = null;
  let touchStartX = 0;

  const showSlide = (nextIndex) => {
    const slides = modalSlides.querySelectorAll(".modal-slide");
    if (!slides.length) return;

    activeIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === activeIndex);
    });
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("product-modal-open");
  };

  const openModal = (card) => {
    const productContent = card.querySelector(".product-content");
    const addButton = card.querySelector(".agregar-carrito");
    const images = [...card.querySelectorAll(".carousel .slide")];
    const fallbackImage = card.querySelector(".product-image");

    activeProduct = {
      nombre: addButton?.dataset.producto || card.querySelector("h3")?.textContent.trim() || "Producto",
      precio: Number(addButton?.dataset.precio || 0)
    };

    modalSlides.innerHTML = "";

    images.forEach((image) => {
      const slide = document.createElement("div");
      slide.className = "modal-slide";

      const img = document.createElement("img");
      img.src = image.getAttribute("src");
      img.alt = image.getAttribute("alt") || activeProduct.nombre;

      slide.appendChild(img);
      modalSlides.appendChild(slide);
    });

    if (!images.length && fallbackImage) {
      const slide = document.createElement("div");
      const clone = fallbackImage.cloneNode(false);
      slide.className = "modal-slide";
      clone.classList.add("modal-slide-fallback");
      slide.appendChild(clone);
      modalSlides.appendChild(slide);
    }

    modalGallery.classList.toggle("single-image", modalSlides.children.length <= 1);
    modalTag.textContent = productContent.querySelector(".tag")?.textContent.trim() || "";
    modalTitle.textContent = card.querySelector("h3")?.textContent.trim() || activeProduct.nombre;
    modalPrice.textContent = productContent.querySelector("strong")?.textContent.trim() || "";
    modalDetail.textContent = productContent.querySelector("p")?.textContent.trim() || "";
    modalCounter.textContent = "1";

    showSlide(0);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("product-modal-open");
  };

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button, a")) return;
      openModal(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(card);
      }
    });
  });

  btnPrev?.addEventListener("click", () => showSlide(activeIndex - 1));
  btnNext?.addEventListener("click", () => showSlide(activeIndex + 1));

  modalGallery?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  modalGallery?.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 40) return;

    showSlide(distance > 0 ? activeIndex - 1 : activeIndex + 1);
  });

  btnMinus?.addEventListener("click", () => {
    const value = Number(modalCounter.textContent);
    if (value > 1) modalCounter.textContent = value - 1;
  });

  btnPlus?.addEventListener("click", () => {
    modalCounter.textContent = Number(modalCounter.textContent) + 1;
  });

  modalAdd?.addEventListener("click", () => {
    if (!activeProduct) return;

    const cantidad = Number(modalCounter.textContent) || 1;
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carrito.find(producto => producto.nombre === activeProduct.nombre);

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({
        nombre: activeProduct.nombre,
        precio: activeProduct.precio,
        cantidad
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    closeModal();
  });

  modal.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }

    if (event.key === "ArrowLeft" && modal.classList.contains("is-open")) {
      showSlide(activeIndex - 1);
    }

    if (event.key === "ArrowRight" && modal.classList.contains("is-open")) {
      showSlide(activeIndex + 1);
    }
  });
}

document.addEventListener("DOMContentLoaded", iniciarDetalleCatalogo);

document.addEventListener("DOMContentLoaded", () => {

  const carousel = document.querySelector(".carousel1");
  if (!carousel) return;

  const slides = carousel.querySelectorAll(".slide1");
  if (!slides.length) return;

  let index = 0;

  // estado inicial seguro
  slides.forEach((s, i) => {
    s.classList.remove("active");
    if (i === 0) s.classList.add("active");
  });

  setInterval(() => {

    slides[index].classList.remove("active");

    index = (index + 1) % slides.length;

    slides[index].classList.add("active");

  }, 3000);

});
