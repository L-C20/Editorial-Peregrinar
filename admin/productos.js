const API_BASE_URL = "";

// =========================================================
// ELEMENTOS
// =========================================================

const modalProducto =
  document.getElementById("modalProducto");

const btnNuevoProducto =
  document.getElementById("btnNuevoProducto");

const btnNuevoProductoVacio =
  document.getElementById("btnNuevoProductoVacio");

const btnCerrarModalProducto =
  document.getElementById("btnCerrarModalProducto");

const btnCancelarProducto =
  document.getElementById("btnCancelarProducto");

const btnGuardarProducto =
  document.getElementById("btnGuardarProducto");

const formProducto =
  document.getElementById("formProducto");

const productoFormError =
  document.getElementById("productoFormError");

const productosTabla =
  document.getElementById("productosTabla");

const productosCantidad =
  document.getElementById("productosCantidad");

const productosVacio =
  document.getElementById("productosVacio");

const buscarProducto =
  document.getElementById("buscarProducto");

// =========================================================
// MODAL VER PRODUCTO
// =========================================================

const modalVerProducto =
  document.getElementById("modalVerProducto");

const btnCerrarVerProducto =
  document.getElementById("btnCerrarVerProducto");

const productoVistaContenido =
  document.getElementById("productoVistaContenido");

// =========================================================
// SISTEMA DE IMÁGENES
// =========================================================

const MAX_IMAGENES = 4;

const imagenPrincipal =
  document.getElementById("productoImagen1");

const imagenesAdicionales =
  document.getElementById("imagenesAdicionales");

const btnAgregarImagen =
  document.getElementById("btnAgregarImagen");

let cantidadImagenes = MAX_IMAGENES;
let productoEditandoId = null;

// =========================================================
// PRODUCTOS
// =========================================================

let productos = [];

let productoEditando = null;

// =========================================================
// ABRIR MODAL NUEVO PRODUCTO
// =========================================================

function abrirModalProducto() {

  productoEditandoId = null;

  document.getElementById(
    "modalProductoTitulo"
  ).textContent = "Nuevo producto";

  btnGuardarProducto.textContent =
    "Guardar producto";

  formProducto.reset();

  productoFormError.textContent = "";

  cantidadImagenes = 1;

  if (imagenesAdicionales) {
    imagenesAdicionales.innerHTML = "";
  }

  if (imagenPrincipal) {

    imagenPrincipal.value = "";

    imagenPrincipal.dataset.imagenId = "";

    imagenPrincipal.dataset.imagenModificada =
      "false";

    const contenedor =
      imagenPrincipal.closest(
        ".product-image-upload"
      );

    const label =
      contenedor?.querySelector(
        ".product-image-upload-label"
      );

    if (label) {

      label.innerHTML = `
        <span class="product-image-upload-icon">
          ↑
        </span>

        <span class="product-image-upload-content">

          <strong>
            Imagen principal
          </strong>

          <small>
            JPG, PNG o WEBP
          </small>

        </span>
      `;

    }

  }

  actualizarBotonAgregarImagen();

  modalProducto.hidden = false;

  document.body.style.overflow = "hidden";

}

// =========================================================
// CERRAR MODAL PRODUCTO
// =========================================================

function cerrarModalProducto() {

  modalProducto.hidden = true;

  document.body.style.overflow = "";

  formProducto.reset();

  productoFormError.textContent = "";

  productoEditandoId = null;

  btnGuardarProducto.textContent =
    "Guardar producto";

  cantidadImagenes = 1;

  if (imagenesAdicionales) {
    imagenesAdicionales.innerHTML = "";
  }

  actualizarBotonAgregarImagen();

}

// =========================================================
// BOTONES MODAL PRODUCTO
// =========================================================

if (btnNuevoProducto) {

  btnNuevoProducto.addEventListener(
    "click",
    abrirModalProducto
  );

}

if (btnNuevoProductoVacio) {

  btnNuevoProductoVacio.addEventListener(
    "click",
    abrirModalProducto
  );

}

if (btnCerrarModalProducto) {

  btnCerrarModalProducto.addEventListener(
    "click",
    cerrarModalProducto
  );

}

if (btnCancelarProducto) {

  btnCancelarProducto.addEventListener(
    "click",
    cerrarModalProducto
  );

}

// =========================================================
// OVERLAY MODAL PRODUCTO
// =========================================================

if (modalProducto) {

  const modalProductoOverlay =
    modalProducto.querySelector(
      ".product-modal-overlay"
    );

  if (modalProductoOverlay) {

    modalProductoOverlay.addEventListener(
      "click",
      cerrarModalProducto
    );

  }

}

// =========================================================
// OBTENER PRODUCTOS
// =========================================================

async function cargarProductos() {

  try {

    productosTabla.innerHTML = `
      <tr>
        <td
          colspan="7"
          class="products-loading"
        >
          Cargando productos...
        </td>
      </tr>
    `;

    const respuesta =
      await fetch(
        `${API_BASE_URL}/api/productos`
      );

    if (!respuesta.ok) {

      throw new Error(
        "No se pudieron cargar los productos."
      );

    }

    productos =
      await respuesta.json();

    console.log(
      "Productos cargados:",
      productos
    );

    renderizarProductos(
      productos
    );

  } catch (error) {

    console.error(
      "Error cargando productos:",
      error
    );

    productosTabla.innerHTML = `
      <tr>
        <td
          colspan="7"
          class="products-loading"
        >
          No se pudieron cargar los productos.
        </td>
      </tr>
    `;

  }

}

// =========================================================
// RENDERIZAR PRODUCTOS
// =========================================================

function renderizarProductos(
  listaProductos
) {

  productosCantidad.textContent =
    listaProductos.length;

  if (
    listaProductos.length === 0
  ) {

    productosTabla.innerHTML = "";

    productosVacio.hidden = false;

    return;

  }

  productosVacio.hidden = true;

  productosTabla.innerHTML =
    listaProductos
      .map(
        producto =>
          crearFilaProducto(
            producto
          )
      )
      .join("");

}

// =========================================================
// CREAR FILA PRODUCTO
// =========================================================

function crearFilaProducto(
  producto
) {

  const imagen =
    obtenerImagenProducto(
      producto
    );

  const imagenUrl =
    imagen
      ? `${API_BASE_URL}${imagen}`
      : null;

  const categoria =
    producto.categoria_nombre ||
    "Sin categoría";

  const precio =
    formatearPrecio(
      producto.precio
    );

  return `
    <tr>

      <td>

        <div class="product-table-product">

          <div class="product-table-image">

            ${
              imagenUrl
                ? `
                  <img
                    src="${escaparHTML(imagenUrl)}"
                    alt="${escaparHTML(
                      producto.nombre
                    )}"
                  >
                `
                : `
                  <div class="product-table-no-image">
                    Sin imagen
                  </div>
                `
            }

          </div>

          <div class="product-table-info">

            <strong>
              ${escaparHTML(
                producto.nombre
              )}
            </strong>

          </div>

        </div>

      </td>

      <td>
        ${escaparHTML(categoria)}
      </td>

      <td>

        <strong>
          ${precio}
        </strong>

      </td>

      <td>

        ${
          producto.disponible
            ? `
              <span class="product-status available">
                Disponible
              </span>
            `
            : `
              <span class="product-status unavailable">
                No disponible
              </span>
            `
        }

      </td>

      <td>

        ${
          producto.destacado
            ? `
              <span class="product-badge yes">
                Sí
              </span>
            `
            : `
              <span class="product-badge no">
                No
              </span>
            `
        }

      </td>

      <td>

        ${
          producto.novedad
            ? `
              <span class="product-badge yes">
                Sí
              </span>
            `
            : `
              <span class="product-badge no">
                No
              </span>
            `
        }

      </td>

      <td>

        <div class="table-actions">

          <button
            type="button"
            class="table-action btn-ver-producto"
            title="Ver producto"
            data-producto-id="${producto.id}"
          >

            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >

              <path
                d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
              />

              <circle
                cx="12"
                cy="12"
                r="3"
              />

            </svg>

          </button>

          <button
            type="button"
            class="table-action btn-editar-producto"
            title="Editar producto"
            data-producto-id="${producto.id}"
          >

            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >

              <path
                d="M12 20h9"
              />

              <path
                d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"
              />

            </svg>

          </button>

          <button
            type="button"
            class="table-action btn-eliminar-producto"
            title="Eliminar producto"
            data-producto-id="${producto.id}"
          >

            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >

              <path
                d="M3 6h18"
              />

              <path
                d="M8 6V4h8v2"
              />

              <path
                d="M19 6l-1 14H6L5 6"
              />

              <path
                d="M10 11v5M14 11v5"
              />

            </svg>

          </button>

        </div>

      </td>

    </tr>
  `;

}

// =========================================================
// OBTENER IMAGEN
// =========================================================

function obtenerImagenProducto(
  producto
) {

  if (
    producto.imagen_principal
  ) {

    return producto.imagen_principal;

  }

  if (
    producto.imagenes &&
    producto.imagenes.length > 0
  ) {

    const imagenesOrdenadas =
      producto.imagenes
        .slice()
        .sort(
          (a, b) =>
            Number(a.orden) -
            Number(b.orden)
        );

    return imagenesOrdenadas[0]
      .imagen_url;

  }

  return null;

}

// =========================================================
// FORMATEAR PRECIO
// =========================================================

function formatearPrecio(
  precio
) {

  return new Intl.NumberFormat(
    "es-AR",
    {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0
    }
  ).format(
    Number(precio)
  );

}

// =========================================================
// ESCAPAR HTML
// =========================================================

function escaparHTML(
  texto
) {

  return String(texto ?? "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}

// =========================================================
// BUSCADOR
// =========================================================

if (buscarProducto) {

  buscarProducto.addEventListener(
    "input",
    () => {

      const texto =
        buscarProducto.value
          .trim()
          .toLowerCase();

      if (!texto) {

        renderizarProductos(
          productos
        );

        return;

      }

      const filtrados =
        productos.filter(
          producto => {

            const nombre =
              (
                producto.nombre ||
                ""
              ).toLowerCase();

            const categoria =
              (
                producto.categoria_nombre ||
                ""
              ).toLowerCase();

            return (
              nombre.includes(texto) ||
              categoria.includes(texto)
            );

          }
        );

      renderizarProductos(
        filtrados
      );

    }
  );

}

// =========================================================
// FORMULARIO CREAR / EDITAR PRODUCTO
// =========================================================

formProducto.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    console.log(
      "=== SUBMIT PRODUCTO ==="
    );

    productoFormError.textContent = "";

    // =====================================================
    // DATOS
    // =====================================================

    const nombre =
      document.getElementById(
        "productoNombre"
      ).value.trim();

    const descripcion =
      document.getElementById(
        "productoDescripcion"
      ).value.trim();

    const precio =
      document.getElementById(
        "productoPrecio"
      ).value;

    const categoriaId =
      document.getElementById(
        "productoCategoria"
      ).value;

    const disponible =
      document.getElementById(
        "productoDisponible"
      ).checked;

    const destacado =
      document.getElementById(
        "productoDestacado"
      ).checked;

    const novedad =
      document.getElementById(
        "productoNovedad"
      ).checked;

    // =====================================================
    // VALIDACIÓN
    // =====================================================

    if (!nombre) {

      productoFormError.textContent =
        "Ingresá el nombre del producto.";

      return;

    }

    if (
      precio === "" ||
      Number(precio) < 0
    ) {

      productoFormError.textContent =
        "Ingresá un precio válido.";

      return;

    }

    // =====================================================
    // TOKEN
    // =====================================================

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {

      productoFormError.textContent =
        "No hay sesión iniciada.";

      return;

    }

    // =====================================================
    // SLUG
    // =====================================================

    const slug =
      nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-+|-+$/g,
          ""
        );

    // =====================================================
// EDITAR PRODUCTO
// =====================================================

if (productoEditandoId) {

  try {

    console.log(
      "ACTUALIZANDO PRODUCTO:",
      productoEditandoId
    );

    // =================================================
    // DATOS
    // =================================================

    const formData =
      new FormData();

    formData.append(
      "categoria_id",
      categoriaId || ""
    );

    formData.append(
      "nombre",
      nombre
    );

    formData.append(
      "slug",
      slug
    );

    formData.append(
      "descripcion",
      descripcion
    );

    formData.append(
      "precio",
      Number(precio)
    );

    formData.append(
      "destacado",
      destacado
    );

    formData.append(
      "novedad",
      novedad
    );

    formData.append(
      "disponible",
      disponible
    );

    formData.append(
      "orden",
      0
    );


    // =================================================
    // IMÁGENES
    // =================================================

    for (
      let numero = 1;
      numero <= cantidadImagenes;
      numero++
    ) {

      const input =
        document.getElementById(
          `productoImagen${numero}`
        );

      if (
        !input ||
        !input.files ||
        input.files.length === 0
      ) {

        continue;

      }

      const archivo =
        input.files[0];

      console.log(
        `IMAGEN ${numero}:`,
        archivo.name
      );

      formData.append(
        `productoImagen${numero}`,
        archivo
      );

    }


    // =================================================
    // ACTUALIZAR PRODUCTO
    // =================================================

    const respuesta =
      await fetch(
        `${API_BASE_URL}/api/productos/${productoEditandoId}`,
        {

          method: "PUT",

          headers: {

            Authorization:
              `Bearer ${token}`

          },

          body:
            formData

        }
      );


    const textoRespuesta =
      await respuesta.text();


    let datos = {};

    try {

      datos =
        JSON.parse(
          textoRespuesta
        );

    } catch {

      console.error(
        "Respuesta no JSON:",
        textoRespuesta
      );

    }


    if (!respuesta.ok) {

      throw new Error(
        datos.error ||
        "No se pudo actualizar el producto."
      );

    }


    console.log(
      "PRODUCTO ACTUALIZADO CORRECTAMENTE:",
      datos
    );


    // =================================================
    // FINALIZAR
    // =================================================

    alert(
      "Producto actualizado correctamente."
    );

    cerrarModalProducto();

    await cargarProductos();


  } catch (error) {

    console.error(
      "Error actualizando producto:",
      error
    );

    productoFormError.textContent =
      error.message ||
      "Ocurrió un error al actualizar el producto.";

  }

  return;

}
    // =====================================================
    // CREAR PRODUCTO
    // =====================================================

    const archivosImagenes = [];

    for (
      let i = 1;
      i <= cantidadImagenes;
      i++
    ) {

      const input =
        document.getElementById(
          `productoImagen${i}`
        );

      if (
        input &&
        input.files &&
        input.files.length > 0
      ) {

        archivosImagenes.push(
          input.files[0]
        );

      }

    }

    // =====================================================
    // FORM DATA
    // =====================================================

    const formData =
      new FormData();

    formData.append(
      "nombre",
      nombre
    );

    formData.append(
      "slug",
      slug
    );

    formData.append(
      "descripcion",
      descripcion
    );

    formData.append(
      "precio",
      Number(precio)
    );

    if (categoriaId) {

      formData.append(
        "categoria_id",
        categoriaId
      );

    }

    formData.append(
      "disponible",
      disponible
    );

    formData.append(
      "destacado",
      destacado
    );

    formData.append(
      "novedad",
      novedad
    );

    // IMPORTANTE:
    // El backend de creación espera:
    // productoImagen1
    // productoImagen2
    // productoImagen3
    // productoImagen4

    archivosImagenes.forEach(
      (archivo, indice) => {

        formData.append(
          `productoImagen${indice + 1}`,
          archivo
        );

      }
    );

    // =====================================================
    // ENVIAR CREACIÓN
    // =====================================================

    try {

      const respuesta =
        await fetch(
          `${API_BASE_URL}/api/productos`,
          {

            method: "POST",

            headers: {

              Authorization:
                `Bearer ${token}`

            },

            body:
              formData

          }
        );

      const datos =
        await respuesta.json();

      if (!respuesta.ok) {

        throw new Error(
          datos.error ||
          "No se pudo crear el producto."
        );

      }

      alert(
        "Producto creado correctamente."
      );

      cerrarModalProducto();

      await cargarProductos();

    } catch (error) {

      console.error(
        "Error creando producto:",
        error
      );

      productoFormError.textContent =
        error.message ||
        "Ocurrió un error al crear el producto.";

    }

  }
);

// =========================================================
// VISTA PREVIA IMAGEN PRINCIPAL
// =========================================================

if (imagenPrincipal) {

  imagenPrincipal.addEventListener(
    "change",
    () => {

      actualizarVistaPrevia(
        imagenPrincipal,
        imagenPrincipal.closest(
          ".product-image-upload"
        )
      );

    }
  );

}

// =========================================================
// AGREGAR OTRA IMAGEN
// =========================================================

if (btnAgregarImagen) {

  btnAgregarImagen.addEventListener(
    "click",
    () => {

      if (
        cantidadImagenes >=
        MAX_IMAGENES
      ) {

        return;

      }

      cantidadImagenes++;

      crearImagenAdicional(
        cantidadImagenes
      );

      actualizarBotonAgregarImagen();

    }
  );

}

// =========================================================
// CREAR IMAGEN ADICIONAL
// =========================================================

function crearImagenAdicional(
  numero
) {

  const contenedor =
    document.createElement(
      "div"
    );

  contenedor.className =
    "product-image-item";

  contenedor.innerHTML = `

    <div class="product-image-upload">

      <input
        type="file"
        id="productoImagen${numero}"
        name="productoImagen${numero}"
        accept="image/*"
      >

      <label
        for="productoImagen${numero}"
        class="product-image-upload-label"
      >

        <span class="product-image-upload-icon">
          ↑
        </span>

        <span class="product-image-upload-content">

          <strong>
            Imagen ${numero}
          </strong>

          <small>
            JPG, PNG o WEBP
          </small>

        </span>

      </label>

    </div>

  `;

  imagenesAdicionales.appendChild(
    contenedor
  );

  const input =
    document.getElementById(
      `productoImagen${numero}`
    );

  input.dataset.imagenModificada =
    "false";

  input.addEventListener(
    "change",
    () => {

      if (
        input.files &&
        input.files.length > 0
      ) {

        input.dataset.imagenModificada =
          "true";

      }

      actualizarVistaPrevia(
        input,
        input.closest(
          ".product-image-upload"
        )
      );

    }
  );

}

// =========================================================
// VISTA PREVIA
// =========================================================

function actualizarVistaPrevia(
  input,
  contenedor
) {

  if (
    !input ||
    !contenedor
  ) {

    return;

  }

  const archivo =
    input.files[0];

  if (!archivo) {

    return;

  }

  input.dataset.imagenModificada =
    "true";

  if (
    !archivo.type.startsWith(
      "image/"
    )
  ) {

    input.value = "";

    return;

  }

  const reader =
    new FileReader();

  reader.onload =
    (event) => {

      const label =
        contenedor.querySelector(
          ".product-image-upload-label"
        );

      if (!label) {

        return;

      }

      label.innerHTML = `

        <img
          src="${event.target.result}"
          class="product-image-preview"
          alt="Vista previa del producto"
        >

        <span class="product-image-preview-content">

          <strong>
            Imagen seleccionada
          </strong>

          <small>
            Hacé clic para cambiarla
          </small>

        </span>

      `;

    };

  reader.readAsDataURL(
    archivo
  );

}

// =========================================================
// BOTÓN AGREGAR IMAGEN
// =========================================================

function actualizarBotonAgregarImagen() {

  if (!btnAgregarImagen) {
    return;
  }

  if (cantidadImagenes < MAX_IMAGENES) {

    btnAgregarImagen.hidden = false;
    btnAgregarImagen.disabled = false;

  } else {

    btnAgregarImagen.hidden = true;
    btnAgregarImagen.disabled = true;

  }

}

// =========================================================
// CREAR BOTÓN ELIMINAR IMAGEN
// =========================================================

function crearBotonEliminarImagen(
  imagenId
) {

  const boton =
    document.createElement(
      "button"
    );

  boton.type =
    "button";

  boton.className =
    "product-image-delete";

  boton.dataset.imagenId =
    imagenId;

  boton.title =
    "Eliminar imagen";

  boton.innerHTML =
    "🗑️";

  boton.addEventListener(
    "click",
    eliminarImagenProducto
  );

  return boton;

}

// =========================================================
// ELIMINAR IMAGEN
// =========================================================

async function eliminarImagenProducto(
  event
) {

  const boton =
    event.currentTarget;

  const imagenId =
    boton.dataset.imagenId;

  if (!productoEditandoId) {

    console.error(
      "No hay producto en edición."
    );

    return;

  }

  const confirmar =
    confirm(
      "¿Querés eliminar esta imagen?"
    );

  if (!confirmar) {

    return;

  }

  const token =
    localStorage.getItem(
      "token"
    );

  if (!token) {

    alert(
      "No hay sesión iniciada."
    );

    return;

  }

  try {

    boton.disabled =
      true;

    const respuesta =
      await fetch(
        `${API_BASE_URL}/api/productos/${productoEditandoId}/imagenes/${imagenId}`,
        {

          method: "DELETE",

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }
      );

    const datos =
      await respuesta.json();

    if (!respuesta.ok) {

      throw new Error(
        datos.error ||
        "No se pudo eliminar la imagen."
      );

    }

    console.log(
      "Imagen eliminada:",
      datos
    );

    await cargarProductos();

    cerrarModalProducto();

    alert(
      "Imagen eliminada correctamente."
    );

  } catch (error) {

    console.error(
      "Error eliminando imagen:",
      error
    );

    alert(
      error.message ||
      "No se pudo eliminar la imagen."
    );

    boton.disabled =
      false;

  }

}

// =========================================================
// ABRIR VER PRODUCTO
// =========================================================

function abrirVerProducto(
  productoId
) {

  console.log(
    "ABRIENDO PRODUCTO:",
    productoId
  );

  const producto =
    productos.find(
      producto =>
        String(producto.id) ===
        String(productoId)
    );

  if (!producto) {

    console.error(
      "No se encontró el producto:",
      productoId
    );

    return;

  }

  const categoriaNombre =
    producto.categoria_nombre ||
    producto.categoria ||
    "Sin categoría";

  const imagen =
    producto.imagen_principal ||
    (
      producto.imagenes &&
      producto.imagenes.length > 0
        ? producto.imagenes
            .slice()
            .sort(
              (a, b) =>
                Number(a.orden) -
                Number(b.orden)
            )[0]
            .imagen_url
        : ""
    );

  const imagenUrl =
    imagen
      ? `${API_BASE_URL}${imagen}`
      : "";

  const estado =
    producto.disponible
      ? "Disponible"
      : "No disponible";

  let badges = "";

  if (producto.destacado) {

    badges += `
      <span class="product-view-badge">
        ★ Destacado
      </span>
    `;

  }

  if (producto.novedad) {

    badges += `
      <span class="product-view-badge">
        ✦ Novedad
      </span>
    `;

  }

  badges += `
    <span class="product-view-badge">
      ${estado}
    </span>
  `;

  productoVistaContenido.innerHTML = `

    <div class="product-view-product">

      ${
        imagen
          ? `
            <div class="product-view-image">

              <img
                src="${escaparHTML(imagenUrl)}"
                alt="${escaparHTML(producto.nombre)}"
              >

            </div>
          `
          : ""
      }

      <div class="product-view-info">

        <span class="product-view-category">

          ${escaparHTML(categoriaNombre)}

        </span>

        <h3 class="product-view-name">

          ${escaparHTML(
            producto.nombre
          )}

        </h3>

        <div class="product-view-price">

          ${formatearPrecio(
            producto.precio
          )}

        </div>

        <div class="product-view-badges">

          ${badges}

        </div>

        <div class="product-view-description">

          <strong>
            Descripción
          </strong>

          <p>

            ${escaparHTML(
              producto.descripcion ||
              "Sin descripción."
            )}

          </p>

        </div>

        <div class="product-view-actions">

          <button
            type="button"
            class="product-view-edit"
            data-producto-id="${producto.id}"
          >
            Editar producto
          </button>

        </div>

      </div>

    </div>

  `;

  modalVerProducto.hidden =
    false;

  document.body.style.overflow =
    "hidden";

}

// =========================================================
// CERRAR VER PRODUCTO
// =========================================================

function cerrarVerProducto() {

  modalVerProducto.hidden =
    true;

  document.body.style.overflow =
    "";

}

// =========================================================
// BOTÓN CERRAR VER PRODUCTO
// =========================================================

if (btnCerrarVerProducto) {

  btnCerrarVerProducto.addEventListener(
    "click",
    cerrarVerProducto
  );

}

// =========================================================
// OVERLAY VER PRODUCTO
// =========================================================

if (modalVerProducto) {

  const modalVerProductoOverlay =
    modalVerProducto.querySelector(
      ".product-modal-overlay"
    );

  if (modalVerProductoOverlay) {

    modalVerProductoOverlay.addEventListener(
      "click",
      cerrarVerProducto
    );

  }

}

// =========================================================
// BOTÓN VER PRODUCTO
// =========================================================

productosTabla.addEventListener(
  "click",
  (event) => {

    const boton =
      event.target.closest(
        ".btn-ver-producto"
      );

    if (!boton) {

      return;

    }

    const productoId =
      boton.dataset.productoId;

    abrirVerProducto(
      productoId
    );

  }
);

// =========================================================
// BOTÓN EDITAR PRODUCTO
// =========================================================

productosTabla.addEventListener(
  "click",
  (event) => {

    const boton =
      event.target.closest(
        ".btn-editar-producto"
      );

    if (!boton) {

      return;

    }

    const productoId =
      boton.dataset.productoId;

    console.log(
      "EDITANDO PRODUCTO:",
      productoId
    );

    const producto =
      productos.find(
        producto =>
          String(producto.id) ===
          String(productoId)
      );

    if (!producto) {

      console.error(
        "No se encontró el producto:",
        productoId
      );

      return;

    }

    // =====================================================
    // GUARDAR PRODUCTO EN EDICIÓN
    // =====================================================

    productoEditandoId =
      producto.id;

    productoEditando =
      producto;

    // =====================================================
    // CARGAR DATOS
    // =====================================================

    document.getElementById(
      "productoNombre"
    ).value =
      producto.nombre || "";

    document.getElementById(
      "productoDescripcion"
    ).value =
      producto.descripcion || "";

    document.getElementById(
      "productoPrecio"
    ).value =
      producto.precio ?? "";

    document.getElementById(
      "productoCategoria"
    ).value =
      producto.categoria_id || "";

    document.getElementById(
      "productoDisponible"
    ).checked =
      Boolean(
        producto.disponible
      );

    document.getElementById(
      "productoDestacado"
    ).checked =
      Boolean(
        producto.destacado
      );

    document.getElementById(
      "productoNovedad"
    ).checked =
      Boolean(
        producto.novedad
      );

    // =====================================================
    // CARGAR IMÁGENES EXISTENTES
    // =====================================================

    cantidadImagenes = 1;

    imagenesAdicionales.innerHTML =
      "";

    const imagenes =
      Array.isArray(producto.imagenes)
        ? producto.imagenes
            .slice()
            .sort(
              (a, b) =>
                Number(a.orden) -
                Number(b.orden)
            )
            .slice(
              0,
              MAX_IMAGENES
            )
        : [];

    // =====================================================
    // REINICIAR IMAGEN PRINCIPAL
    // =====================================================

    if (imagenPrincipal) {

      imagenPrincipal.value =
        "";

      imagenPrincipal.dataset.imagenId =
        "";

      imagenPrincipal.dataset.imagenModificada =
        "false";

      const contenedorPrincipal =
        imagenPrincipal.closest(
          ".product-image-upload"
        );

      const labelPrincipal =
        contenedorPrincipal?.querySelector(
          ".product-image-upload-label"
        );

      const imagenPrincipalData =
        imagenes.find(
          imagen =>
            Number(imagen.orden) === 0
        ) ||
        imagenes[0];

      if (
        imagenPrincipalData &&
        labelPrincipal
      ) {

        imagenPrincipal.dataset.imagenId =
          imagenPrincipalData.id;

        imagenPrincipal.dataset.imagenModificada =
          "false";

        const url =
          `${API_BASE_URL}${imagenPrincipalData.imagen_url}`;

        labelPrincipal.innerHTML = `

          <img
            src="${escaparHTML(url)}"
            class="product-image-preview"
            alt="Imagen principal"
          >

          <span class="product-image-preview-content">

            <strong>
              Imagen principal
            </strong>

            <small>
              Imagen actual del producto
            </small>

          </span>

        `;

        const botonExistente =
          contenedorPrincipal.querySelector(
            ".product-image-delete"
          );

        if (botonExistente) {

          botonExistente.remove();

        }

        const botonEliminar =
          crearBotonEliminarImagen(
            imagenPrincipalData.id
          );

        contenedorPrincipal.appendChild(
          botonEliminar
        );

      }

    }

    // =====================================================
    // CARGAR IMÁGENES SECUNDARIAS
    // =====================================================

    imagenes
      .filter(
        imagen =>
          Number(imagen.orden) !== 0
      )
      .forEach(
        imagen => {

          if (
            cantidadImagenes >=
            MAX_IMAGENES
          ) {

            return;

          }

          cantidadImagenes++;

          crearImagenAdicional(
            cantidadImagenes
          );

          const input =
            document.getElementById(
              `productoImagen${cantidadImagenes}`
            );

          if (!input) {

            return;

          }

          input.dataset.imagenId =
            imagen.id;

          input.dataset.imagenModificada =
            "false";

          const contenedor =
            input.closest(
              ".product-image-upload"
            );

          const label =
            contenedor?.querySelector(
              ".product-image-upload-label"
            );

          if (
            !contenedor ||
            !label
          ) {

            return;

          }

          const url =
            `${API_BASE_URL}${imagen.imagen_url}`;

          label.innerHTML = `

            <img
              src="${escaparHTML(url)}"
              class="product-image-preview"
              alt="Imagen ${cantidadImagenes}"
            >

            <span class="product-image-preview-content">

              <strong>
                Imagen ${cantidadImagenes}
              </strong>

              <small>
                Imagen actual del producto
              </small>

            </span>

          `;

          const botonEliminar =
            crearBotonEliminarImagen(
              imagen.id
            );

          contenedor.appendChild(
            botonEliminar
          );

        }
      );
    // =====================================================
    // DEJAR DISPONIBLE LA SIGUIENTE IMAGEN
    // =====================================================

    if (
      cantidadImagenes < MAX_IMAGENES
    ) {

      // No creamos automáticamente la caja.
      // El botón "Agregar otra imagen" seguirá
      // permitiendo agregar la siguiente.

    }

    actualizarBotonAgregarImagen();

    // =====================================================
    // TÍTULO
    // =====================================================

    document.getElementById(
      "modalProductoTitulo"
    ).textContent =
      "Editar producto";

    // =====================================================
    // BOTÓN
    // =====================================================

    btnGuardarProducto.textContent =
      "Actualizar producto";

    // =====================================================
    // ABRIR MODAL
    // =====================================================

    modalProducto.hidden =
      false;

    document.body.style.overflow =
      "hidden";

    console.log(
      "Producto cargado para editar:",
      producto
    );

  }
);

// =========================================================
// INICIALIZAR
// =========================================================

cargarProductos();