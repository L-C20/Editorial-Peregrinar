const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const filterButtons = document.querySelectorAll(".filter-btn");
const catalogProducts = document.querySelectorAll(".catalog-grid .product-card");
const forms = document.querySelectorAll("form");

const closeMenu = () => {
  if (!navLinks || !menuToggle) {
    return;
  }

  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navItems.forEach((item) => {
  item.addEventListener("click", closeMenu);
});

const currentPage = document.body.dataset.page;

navItems.forEach((item) => {
  item.classList.toggle("active", item.dataset.pageLink === currentPage);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    catalogProducts.forEach((product) => {
      const productCategories = product.dataset.category.split(" ");
      const shouldShow = selectedCategory === "todos" || productCategories.includes(selectedCategory);
      product.classList.toggle("hidden", !shouldShow);
    });
  });
});

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.querySelector(".form-message");

    if (message) {
      message.textContent = "Gracias por escribirnos. Te responderemos pronto.";
    }

    form.reset();
  });
});

document.querySelectorAll(".agregar-carrito").forEach((boton) => {

  boton.addEventListener("click", () => {

    const carrito =
      JSON.parse(localStorage.getItem("carrito")) || [];

    carrito.push({
  nombre: boton.dataset.producto,
  precio: boton.dataset.precio
});

    localStorage.setItem(
      "carrito",
      JSON.stringify(carrito)
    );
    actualizarContadorCarrito();

    console.log("Producto agregado");
  });

});

function actualizarContadorCarrito() {

  const contador = document.getElementById("contador-carrito");

  if (!contador) return;

  const carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];

  contador.textContent = carrito.length;
}

actualizarContadorCarrito();
