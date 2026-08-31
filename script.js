// ======================================================
// EDITORIAL PEREGRINAR - SCRIPT PRINCIPAL
// ======================================================
const API_BASE_URL = "http://localhost:3000";
// ======================================================
// 🟢 CARGAR CATÁLOGO DESDE LA API
// ======================================================
function obtenerUrlImagen(url) {

  if (!url) {
    return "";
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `${API_BASE_URL}${url}`;

}

async function cargarCatalogo() {

  console.log("CARGAR CATALOGO EJECUTADO");

  const contenedor =
    document.getElementById("catalogo-productos");

  if (!contenedor) return;

  try {

   const respuesta =
  await fetch(
    "http://localhost:3000/api/productos"
  );

console.log(
  "STATUS PRODUCTOS:",
  respuesta.status
);

console.log(
  "STATUS TEXT PRODUCTOS:",
  respuesta.statusText
);

    if (!respuesta.ok) {
      throw new Error(
        "Error al obtener los productos"
      );
    }

    const productos =
      await respuesta.json();

    contenedor.innerHTML = "";


    productos.forEach(producto => {

      const tarjeta =
        document.createElement("article");


      tarjeta.className =
        "product-card";


      tarjeta.dataset.category =
        producto.categoria_slug || "";


      tarjeta.tabIndex = 0;


      // ==================================================
      // IMÁGENES DEL PRODUCTO
      // ==================================================

      const imagenes = [];


      // Imagen principal
      if (producto.imagen_principal) {

  imagenes.push(
    obtenerUrlImagen(
      producto.imagen_principal
    )
  );

}


      // Imágenes adicionales
      if (
        Array.isArray(
          producto.imagenes
        )
      ) {

        producto.imagenes.forEach(
          imagen => {

           if (
  imagen &&
  imagen.imagen_url
) {

  const urlImagen =
    obtenerUrlImagen(
      imagen.imagen_url
    );

  if (
    !imagenes.includes(
      urlImagen
    )
  ) {

    imagenes.push(
      urlImagen
    );

  }

}

          }
        );

      }


      // ==================================================
      // HTML DE LAS IMÁGENES
      // ==================================================

      const imagenesHTML =
        imagenes.length
          ? `
            <div class="carousel">

              ${imagenes
                .map(
                  (imagen, index) => `
                    <img
                      src="${imagen}"
                      class="slide ${
                        index === 0
                          ? "active"
                          : ""
                      }"
                      alt="${producto.nombre}"
                    >
                  `
                )
                .join("")}

            </div>
          `
          : "";


      // ==================================================
      // TARJETA
      // ==================================================

      tarjeta.innerHTML = `

        <div class="product-content">

          ${imagenesHTML}


          <span class="tag">
            ${
              producto.categoria_nombre ||
              "Sin categoría"
            }
          </span>


          <h3>
            ${producto.nombre}
          </h3>


          <p>
            ${producto.descripcion || ""}
          </p>


          <strong>
            $${Number(
              producto.precio
            ).toLocaleString("es-AR")}
          </strong>


          <div class="cantidad">

            <button
              type="button"
              class="btn-cantidad btn-restar"
            >
              -
            </button>


            <span class="contador">
              1
            </span>


            <button
              type="button"
              class="btn-cantidad btn-sumar"
            >
              +
            </button>

          </div>


          <button
            type="button"
            class="btn btn-primary agregar-carrito"
            data-producto="${producto.nombre}"
            data-precio="${producto.precio}"
          >
            Agregar al carrito
          </button>

        </div>

      `;


      contenedor.appendChild(
        tarjeta
      );


      // ==================================================
      // CONTADOR DEL PRODUCTO
      // ==================================================

      const btnSumar =
        tarjeta.querySelector(
          ".btn-sumar"
        );


      const btnRestar =
        tarjeta.querySelector(
          ".btn-restar"
        );


      const contador =
        tarjeta.querySelector(
          ".contador"
        );


      btnSumar.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();


          const valorActual =
            Number(
              contador.textContent
            );


          contador.textContent =
            valorActual + 1;

        }
      );


      btnRestar.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();


          const valorActual =
            Number(
              contador.textContent
            );


          if (
            valorActual > 1
          ) {

            contador.textContent =
              valorActual - 1;

          }

        }
      );


      // ==================================================
      // AGREGAR AL CARRITO
      // ==================================================

      const btnAgregar =
        tarjeta.querySelector(
          ".agregar-carrito"
        );


      btnAgregar.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();


          const nombre =
            btnAgregar.dataset.producto;


          const precio =
            Number(
              btnAgregar.dataset.precio
            );


          const cantidad =
            Number(
              contador.textContent
            ) || 1;


          let carrito =
            JSON.parse(
              localStorage.getItem(
                "carrito"
              )
            ) || [];


          const existente =
            carrito.find(
              producto =>
                producto.nombre ===
                nombre
            );


          if (existente) {

            existente.cantidad +=
              cantidad;

          } else {

            carrito.push({

              nombre:
                nombre,

              precio:
                precio,

              cantidad:
                cantidad

            });

          }


          localStorage.setItem(
            "carrito",
            JSON.stringify(
              carrito
            )
          );


          console.log(
            `Agregado al carrito: ${nombre} x${cantidad}`
          );

        }
      );

    });


    // ==================================================
    // INICIAR MODALES
    // ==================================================

    iniciarDetalleCatalogo();


    // ==================================================
    // INICIAR CARRUSELES
    // ==================================================

    iniciarCarruseles();


  } catch (error) {

    console.error(
      "Error cargando catálogo:",
      error
    );


    contenedor.innerHTML = `
      <p>
        No se pudieron cargar los productos.
      </p>
    `;

  }

}

// ======================================================
// 🖼️ CARRUSELES DEL CATÁLOGO
// ======================================================

function iniciarCarruseles() {

  const carruseles =
    document.querySelectorAll(".carousel");


  carruseles.forEach(carousel => {

    const slides =
      carousel.querySelectorAll(".slide");

    if (!slides.length) return;


    let index = 0;


    slides.forEach((slide, i) => {

      slide.classList.remove("active");

      if (i === 0) {
        slide.classList.add("active");
      }

    });


    if (slides.length <= 1) return;


    setInterval(() => {

      slides[index].classList.remove("active");

      index =
        (index + 1) % slides.length;

      slides[index].classList.add("active");

    }, 3000);

  });

}


// ======================================================
// 🟣 MODAL DE DETALLE DEL PRODUCTO
// ======================================================

function iniciarDetalleCatalogo() {

  const modal =
    document.getElementById("product-modal");

  if (!modal) return;


  const cards =
    document.querySelectorAll(
      ".catalog-grid .product-card"
    );


  const modalGallery =
    document.getElementById("modal-gallery");

  const modalSlides =
    document.getElementById("modal-slides");

  const modalTag =
    document.getElementById("modal-product-tag");

  const modalTitle =
    document.getElementById("modal-product-title");

  const modalPrice =
    document.getElementById("modal-product-price");

  const modalDetail =
    document.getElementById("modal-product-detail");

  const modalCounter =
    document.getElementById("modal-contador");

  const modalAdd =
    document.getElementById("modal-agregar-carrito");

  const btnPrev =
    modal.querySelector(".modal-prev");

  const btnNext =
    modal.querySelector(".modal-next");

  const btnMinus =
    document.getElementById("modal-restar");

  const btnPlus =
    document.getElementById("modal-sumar");


  let activeIndex = 0;
  let activeProduct = null;
  let touchStartX = 0;


  // ==================================================
  // MOSTRAR SLIDE
  // ==================================================

  const showSlide = (nextIndex) => {

    const slides =
      modalSlides.querySelectorAll(
        ".modal-slide"
      );

    if (!slides.length) return;


    activeIndex =
      (nextIndex + slides.length) %
      slides.length;


    slides.forEach((slide, index) => {

      slide.classList.toggle(
        "active",
        index === activeIndex
      );

    });

  };


  // ==================================================
  // CERRAR MODAL
  // ==================================================

  const closeModal = () => {

    modal.classList.remove("is-open");

    // Quitamos el foco antes de ocultar el modal.
    if (document.activeElement &&
        modal.contains(document.activeElement)) {

      document.activeElement.blur();

    }

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "product-modal-open"
    );

  };


  // ==================================================
  // ABRIR MODAL
  // ==================================================

  const openModal = (card) => {

    const productContent =
      card.querySelector(".product-content");

    const addButton =
      card.querySelector(".agregar-carrito");

    const images =
      [
        ...card.querySelectorAll(
          ".carousel .slide"
        )
      ];

    const fallbackImage =
      card.querySelector(".product-image");


    activeProduct = {

      nombre:
        addButton?.dataset.producto ||
        card.querySelector("h3")
          ?.textContent
          .trim() ||
        "Producto",

      precio:
        Number(
          addButton?.dataset.precio || 0
        )

    };


    modalSlides.innerHTML = "";


    // ================================================
    // CARGAR IMÁGENES
    // ================================================

    images.forEach(image => {

      const slide =
        document.createElement("div");

      slide.className =
        "modal-slide";


      const img =
        document.createElement("img");

      img.src =
        image.getAttribute("src");

      img.alt =
        image.getAttribute("alt") ||
        activeProduct.nombre;


      slide.appendChild(img);

      modalSlides.appendChild(slide);

    });


    // ================================================
    // IMAGEN FALLBACK
    // ================================================

    if (
      !images.length &&
      fallbackImage
    ) {

      const slide =
        document.createElement("div");

      slide.className =
        "modal-slide";


      const clone =
        fallbackImage.cloneNode(false);

      clone.classList.add(
        "modal-slide-fallback"
      );


      slide.appendChild(clone);

      modalSlides.appendChild(slide);

    }


    // ================================================
    // DATOS DEL PRODUCTO
    // ================================================

    modalGallery.classList.toggle(
      "single-image",
      modalSlides.children.length <= 1
    );
    const tieneVariasImagenes =
  modalSlides.children.length > 1;

btnPrev?.classList.toggle(
  "hidden",
  !tieneVariasImagenes
);

btnNext?.classList.toggle(
  "hidden",
  !tieneVariasImagenes
);


    modalTag.textContent =
      productContent
        .querySelector(".tag")
        ?.textContent
        .trim() || "";


    modalTitle.textContent =
      card.querySelector("h3")
        ?.textContent
        .trim() ||
      activeProduct.nombre;


    modalPrice.textContent =
      productContent
        .querySelector("strong")
        ?.textContent
        .trim() || "";


    modalDetail.textContent =
      productContent
        .querySelector("p")
        ?.textContent
        .trim() || "";


    // ================================================
    // CONTADOR DEL MODAL
    // ================================================

    modalCounter.textContent = "1";


    showSlide(0);


    // ================================================
    // MOSTRAR MODAL
    // ================================================

    modal.classList.add("is-open");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "product-modal-open"
    );

  };


  // ==================================================
  // EVENTOS DE LAS CARDS
  // ==================================================

  cards.forEach(card => {

    card.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "button, a"
          )
        ) {
          return;
        }

        openModal(card);

      }
    );


    card.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          openModal(card);

        }

      }
    );

  });


  // ==================================================
  // FLECHAS DEL MODAL
  // ==================================================

  btnPrev?.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      showSlide(
        activeIndex - 1
      );

    }
  );


  btnNext?.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      showSlide(
        activeIndex + 1
      );

    }
  );


  // ==================================================
  // SWIPE
  // ==================================================

  modalGallery?.addEventListener(
    "touchstart",
    event => {

      touchStartX =
        event.changedTouches[0].clientX;

    },
    { passive: true }
  );


  modalGallery?.addEventListener(
    "touchend",
    event => {

      const distance =
        event.changedTouches[0].clientX -
        touchStartX;


      if (
        Math.abs(distance) < 40
      ) {
        return;
      }


      showSlide(
        distance > 0
          ? activeIndex - 1
          : activeIndex + 1
      );

    }
  );


  // ==================================================
  // CONTADOR DEL MODAL
  // ==================================================

  btnMinus?.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      const value =
        Number(
          modalCounter.textContent
        );


      if (value > 1) {

        modalCounter.textContent =
          value - 1;

      }

    }
  );


  btnPlus?.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      const value =
        Number(
          modalCounter.textContent
        );


      modalCounter.textContent =
        value + 1;

    }
  );


  // ==================================================
  // AGREGAR DESDE EL MODAL
  // ==================================================

  modalAdd?.addEventListener(
    "click",
    event => {

      event.stopPropagation();


      if (!activeProduct) return;


      const cantidad =
        Number(
          modalCounter.textContent
        ) || 1;


      const carrito =
        JSON.parse(
          localStorage.getItem("carrito")
        ) || [];


      const existente =
        carrito.find(
          producto =>
            producto.nombre ===
            activeProduct.nombre
        );


      if (existente) {

        existente.cantidad +=
          cantidad;

      } else {

        carrito.push({

          nombre:
            activeProduct.nombre,

          precio:
            activeProduct.precio,

          cantidad:
            cantidad

        });

      }


      localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
      );


      closeModal();

    }
  );


  // ==================================================
  // BOTONES PARA CERRAR MODAL
  // ==================================================

  modal
    .querySelectorAll(
      "[data-close-modal]"
    )
    .forEach(element => {

      element.addEventListener(
        "click",
        closeModal
      );

    });


  // ==================================================
  // TECLADO
  // ==================================================

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        modal.classList.contains("is-open")
      ) {

        closeModal();

      }


      if (
        event.key === "ArrowLeft" &&
        modal.classList.contains("is-open")
      ) {

        showSlide(
          activeIndex - 1
        );

      }


      if (
        event.key === "ArrowRight" &&
        modal.classList.contains("is-open")
      ) {

        showSlide(
          activeIndex + 1
        );

      }

    }
  );

}


// ======================================================
// 🟡 CARGAR CARRITO
// ======================================================

function cargarCarrito() {

  const carrito =
    JSON.parse(
      localStorage.getItem("carrito")
    ) || [];


  const lista =
    document.getElementById(
      "lista-carrito"
    );


  if (!lista) return;


  let total = 0;


  lista.innerHTML = "";


  carrito.forEach(
    (producto, index) => {

      const subtotal =
        producto.precio *
        producto.cantidad;


      total += subtotal;


      lista.innerHTML += `
        <div class="item-carrito">

          <div class="item-carrito-info">

            <h3>
              ${producto.nombre}
            </h3>

            <p>
              $${Number(producto.precio).toLocaleString("es-AR")} c/u
            </p>

            <div class="cantidad-carrito">

              <button
                class="btn-mini"
                onclick="restarCarrito(${index})"
              >
                -
              </button>

              <span>
                ${producto.cantidad}
              </span>

              <button
                class="btn-mini"
                onclick="sumarCarrito(${index})"
              >
                +
              </button>

            </div>

            <strong>
              Subtotal:
              $${subtotal.toLocaleString("es-AR")}
            </strong>

          </div>

        </div>
      `;

    }
  );


  const totalCarrito =
    document.getElementById(
      "total-carrito"
    );


  if (totalCarrito) {

    totalCarrito.textContent =
      `Total: $${total.toLocaleString("es-AR")}`;

  }

}


// ======================================================
// ➕ SUMAR EN CARRITO
// ======================================================

window.sumarCarrito = function(index) {

  const carrito =
    JSON.parse(
      localStorage.getItem("carrito")
    ) || [];


  if (!carrito[index]) return;


  carrito[index].cantidad += 1;


  localStorage.setItem(
    "carrito",
    JSON.stringify(carrito)
  );


  cargarCarrito();

};


// ======================================================
// ➖ RESTAR EN CARRITO
// ======================================================

window.restarCarrito = function(index) {

  const carrito =
    JSON.parse(
      localStorage.getItem("carrito")
    ) || [];


  if (!carrito[index]) return;


  if (
    carrito[index].cantidad > 1
  ) {

    carrito[index].cantidad -= 1;

  }


  localStorage.setItem(
    "carrito",
    JSON.stringify(carrito)
  );


  cargarCarrito();

};


// ======================================================
// ❌ ELIMINAR PRODUCTO
// ======================================================

window.eliminarProducto =
  function(index) {

    const carrito =
      JSON.parse(
        localStorage.getItem("carrito")
      ) || [];


    carrito.splice(index, 1);


    localStorage.setItem(
      "carrito",
      JSON.stringify(carrito)
    );


    cargarCarrito();

  };


// ======================================================
// 🧹 VACIAR CARRITO
// ======================================================

function iniciarVaciarCarrito() {

  const btnVaciar =
    document.getElementById(
      "vaciar-carrito"
    );


  if (!btnVaciar) return;


  btnVaciar.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        "carrito"
      );


      cargarCarrito();

    }
  );

}



function iniciarWhatsapp() {

  const btnWhatsapp =
    document.getElementById("enviar-whatsapp");

  if (!btnWhatsapp) return;

  btnWhatsapp.addEventListener("click", () => {

    const carrito =
      JSON.parse(
        localStorage.getItem("carrito")
      ) || [];

    if (carrito.length === 0) {

      alert("El carrito está vacío");

      return;

    }

    let mensaje =
      "Hola, Editorial Peregrinar. Quisiera realizar el siguiente pedido:%0A%0A";

    let total = 0;


    carrito.forEach(producto => {

      const subtotal =
        producto.precio * producto.cantidad;

      total += subtotal;


      mensaje +=
        `📚 *${producto.nombre}*%0A`;

      mensaje +=
        `Cantidad: ${producto.cantidad}%0A`;

      mensaje +=
        `Precio unitario: $${Number(producto.precio).toLocaleString("es-AR")}%0A`;

      mensaje +=
        `Subtotal: $${subtotal.toLocaleString("es-AR")}%0A%0A`;

    });


    mensaje +=
      "─────────────%0A";

    mensaje +=
      `*TOTAL: $${total.toLocaleString("es-AR")}*%0A%0A`;

    mensaje +=
      "¡Muchas gracias!";


    window.open(
      `https://wa.me/5492613846766?text=${mensaje}`,
      "_blank"
    );

  });

}


// ======================================================
// 🟣 FILTROS DEL CATÁLOGO
// ======================================================

function iniciarFiltros() {

  const buttons =
    document.querySelectorAll(
      ".filter-btn"
    );


  buttons.forEach(btn => {

    btn.addEventListener(
      "click",
      () => {

        buttons.forEach(
          b =>
            b.classList.remove(
              "active"
            )
        );


        btn.classList.add(
          "active"
        );


        const filter =
          btn.dataset.filter;


        const items =
          document.querySelectorAll(
            "#catalogo-productos .product-card"
          );


        items.forEach(item => {

          const category =
            item.dataset.category || "";


          if (
            filter === "todos" ||
            category
              .split(" ")
              .includes(filter)
          ) {

            item.style.display =
              "block";

          } else {

            item.style.display =
              "none";

          }

        });

      }
    );

  });

}


// ======================================================
// 📱 MENÚ MÓVIL
// ======================================================

function iniciarMenu() {

  const menuToggle =
    document.querySelector(
      ".menu-toggle"
    );


  const navLinks =
    document.querySelector(
      ".nav-links"
    );


  if (
    !menuToggle ||
    !navLinks
  ) {
    return;
  }


  menuToggle.addEventListener(
    "click",
    () => {

      navLinks.classList.toggle(
        "open"
      );

    }
  );

}


// ======================================================
// 🖼️ CARRUSEL .carousel1
// ======================================================

function iniciarCarouselPrincipal() {

  const carousel =
    document.querySelector(
      ".carousel1"
    );


  if (!carousel) return;


  const slides =
    carousel.querySelectorAll(
      ".slide1"
    );


  if (!slides.length) return;


  let index = 0;


  slides.forEach(
    (slide, i) => {

      slide.classList.remove(
        "active"
      );


      if (i === 0) {

        slide.classList.add(
          "active"
        );

      }

    }
  );


  if (slides.length <= 1) return;


  setInterval(() => {

    slides[index].classList.remove(
      "active"
    );


    index =
      (index + 1) %
      slides.length;


    slides[index].classList.add(
      "active"
    );

  }, 3000);

}


// ======================================================
// 🚀 INICIALIZACIÓN
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    cargarCatalogo();

    cargarCarrito();

    iniciarVaciarCarrito();

    iniciarWhatsapp();

    iniciarFiltros();

    iniciarMenu();

    iniciarCarouselPrincipal();

  }
);