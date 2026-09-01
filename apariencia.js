// =====================================================
// EDITORIAL PEREGRINAR
// APARIENCIA — EDITOR EN TIEMPO REAL
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // =================================================
        // API
        // =================================================

        const API_BASE_URL =
            "";


        // =================================================
        // VALORES PREDETERMINADOS
        // =================================================

        const valoresOriginales = {

            aparienciaNombre:
                "Mi tienda",

            aparienciaDescripcion:
                "",

            colorPrincipal:
                "#7C3AED",

            colorSecundario:
                "#F3F4F6",

            colorFondo:
                "#FFFFFF",

            colorTexto:
                "#111827",

            estiloBotones:
                "rounded",

            estiloTarjetas:
                "soft",

            textoBienvenida:
                "Bienvenido a nuestra tienda",

            textoSubtitulo:
                "Descubrí nuestros productos...",

            fuentePrincipal:
                "Inter",

            fuenteTitulos:
                "Inter",

            tamanoTitulos:
                "medium",

            pesoTitulos:
                "600"

        };


        // =================================================
        // ESTADO
        // =================================================

        let aparienciaGuardada = null;

        let cambiosSinGuardar = false;

        let cargandoApariencia = false;


        // =================================================
        // ELEMENTOS
        // =================================================

        const aparienciaNombre =
            document.getElementById(
                "aparienciaNombre"
            );

        const aparienciaDescripcion =
            document.getElementById(
                "aparienciaDescripcion"
            );

        const colorPrincipal =
            document.getElementById(
                "colorPrincipal"
            );

        const colorSecundario =
            document.getElementById(
                "colorSecundario"
            );

        const colorFondo =
            document.getElementById(
                "colorFondo"
            );

        const colorTexto =
            document.getElementById(
                "colorTexto"
            );

        const estiloBotones =
            document.getElementById(
                "estiloBotones"
            );

        const estiloTarjetas =
            document.getElementById(
                "estiloTarjetas"
            );

        const textoBienvenida =
            document.getElementById(
                "textoBienvenida"
            );

        const textoSubtitulo =
            document.getElementById(
                "textoSubtitulo"
            );

        const fuentePrincipal =
            document.getElementById(
                "fuentePrincipal"
            );

        const fuenteTitulos =
            document.getElementById(
                "fuenteTitulos"
            );

        const tamanoTitulos =
            document.getElementById(
                "tamanoTitulos"
            );

        const pesoTitulos =
            document.getElementById(
                "pesoTitulos"
            );


        // =================================================
        // VISTA PREVIA
        // =================================================

        const previewNombre =
            document.getElementById(
                "previewNombre"
            );

        const previewBienvenida =
            document.getElementById(
                "previewBienvenida"
            );

        const previewSubtitulo =
            document.getElementById(
                "previewSubtitulo"
            );

        const previewBoton =
            document.getElementById(
                "previewBoton"
            );

        const previewLogo =
            document.getElementById(
                "previewLogo"
            );


        // =================================================
        // VALORES DE COLORES
        // =================================================

        const colorPrincipalValor =
            document.getElementById(
                "colorPrincipalValor"
            );

        const colorSecundarioValor =
            document.getElementById(
                "colorSecundarioValor"
            );

        const colorFondoValor =
            document.getElementById(
                "colorFondoValor"
            );

        const colorTextoValor =
            document.getElementById(
                "colorTextoValor"
            );


        // =================================================
        // BOTONES
        // =================================================

        const btnRestablecerApariencia =
            document.getElementById(
                "btnRestablecerApariencia"
            );

        const btnGuardarApariencia =
            document.getElementById(
                "btnGuardarApariencia"
            );


        // =================================================
        // LOGO
        // =================================================

        const aparienciaLogo =
            document.getElementById(
                "aparienciaLogo"
            );


        // =================================================
        // TODOS LOS CAMPOS
        // =================================================

        const campos = [

            aparienciaNombre,

            aparienciaDescripcion,

            colorPrincipal,

            colorSecundario,

            colorFondo,

            colorTexto,

            estiloBotones,

            estiloTarjetas,

            textoBienvenida,

            textoSubtitulo,

            fuentePrincipal,

            fuenteTitulos,

            tamanoTitulos,

            pesoTitulos

        ];


        // =================================================
        // MOSTRAR RESTAURAR
        // =================================================

        function mostrarBotonRestaurar(
            id
        ) {

            const boton =
                document.querySelector(
                    `.appearance-reset[data-reset="${id}"]`
                );

            if (!boton) {

                return;

            }

            boton.hidden = false;

        }


        // =================================================
        // OCULTAR RESTAURAR
        // =================================================

        function ocultarBotonRestaurar(
            id
        ) {

            const boton =
                document.querySelector(
                    `.appearance-reset[data-reset="${id}"]`
                );

            if (!boton) {

                return;

            }

            boton.hidden = true;

        }


        // =================================================
        // COMPROBAR CAMBIO
        // =================================================

        function comprobarCambio(
            elemento
        ) {

            if (!elemento) {

                return;

            }

            const id =
                elemento.id;

            const valoresComparacion =
                aparienciaGuardada ||
                valoresOriginales;

            const valorOriginal =
                valoresComparacion[id];


            if (
                elemento.value !==
                valorOriginal
            ) {

                mostrarBotonRestaurar(
                    id
                );

            } else {

                ocultarBotonRestaurar(
                    id
                );

            }

        }

// =================================================
// APLICAR TIPOGRAFÍA
// =================================================

function aplicarTipografia() {

    const fuenteGeneral =
        fuentePrincipal?.value || "Inter";

    const fuenteTitulosSeleccionada =
        fuenteTitulos?.value || "Inter";

    const tamano =
        tamanoTitulos?.value || "medium";

    const peso =
        pesoTitulos?.value || "600";


    // =================================================
    // CARGAR FUENTES NECESARIAS
    // =================================================

    cargarFuenteGoogle(
        fuenteGeneral
    );

    cargarFuenteGoogle(
        fuenteTitulosSeleccionada
    );


    // =================================================
    // PANTALLA DEL TELÉFONO
    // =================================================

    const phoneScreen =
        document.querySelector(
            ".phone-screen"
        );

    if (!phoneScreen) {

        return;

    }


    // =================================================
    // FUENTE GENERAL
    // =================================================

    phoneScreen.style.fontFamily =
        `"${fuenteGeneral}", sans-serif`;


    // =================================================
    // TÍTULOS
    // =================================================

    const titulos =
        phoneScreen.querySelectorAll(
            `
            .phone-store-header strong,
            .phone-hero h3,
            .phone-product-card strong
            `
        );


    titulos.forEach(
        titulo => {

            titulo.style.fontFamily =
                `"${fuenteTitulosSeleccionada}", sans-serif`;


            titulo.style.fontWeight =
                peso;


            // =================================================
            // TAMAÑO
            // =================================================

            switch (tamano) {

                case "small":

                    titulo.style.fontSize =
                        "16px";

                    break;


                case "medium":

                    titulo.style.fontSize =
                        "19px";

                    break;


                case "large":

                    titulo.style.fontSize =
                        "23px";

                    break;

            }

        }
    );

}

// =================================================
// CARGAR FUENTE DE GOOGLE FONTS
// =================================================

function cargarFuenteGoogle(
    nombreFuente
) {

    if (
        !nombreFuente ||
        nombreFuente === "Arial" ||
        nombreFuente === "Georgia" ||
        nombreFuente === "Times New Roman" ||
        nombreFuente === "Verdana"
    ) {

        return;

    }


    const id =
        "google-font-" +
        nombreFuente
            .replace(
                /\s+/g,
                "-"
            )
            .toLowerCase();


    // Ya está cargada

    if (
        document.getElementById(
            id
        )
    ) {

        return;

    }


    const link =
        document.createElement(
            "link"
        );


    link.id =
        id;


    link.rel =
        "stylesheet";


    link.href =
        `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
            nombreFuente
        ).replace(
            /%20/g,
            "+"
        )}:wght@400;500;600;700&display=swap`;


    document.head.appendChild(
        link
    );

}


        // =================================================
        // ACTUALIZAR VISTA PREVIA
        // =================================================

        function actualizarVistaPrevia() {

            // ---------------------------------------------
            // NOMBRE
            // ---------------------------------------------

            if (previewNombre) {

                previewNombre.textContent =
                    aparienciaNombre?.value ||
                    "Mi tienda";

            }


            // ---------------------------------------------
            // TÍTULO
            // ---------------------------------------------

            if (previewBienvenida) {

                previewBienvenida.textContent =
                    textoBienvenida?.value ||
                    "Bienvenido a nuestra tienda";

            }


            // ---------------------------------------------
            // SUBTÍTULO
            // ---------------------------------------------

            if (previewSubtitulo) {

                previewSubtitulo.textContent =
                    textoSubtitulo?.value ||
                    "Descubrí nuestros productos...";

            }


            // ---------------------------------------------
            // COLORES
            // ---------------------------------------------

            const principal =
                colorPrincipal?.value ||
                "#7C3AED";

            const secundario =
                colorSecundario?.value ||
                "#F3F4F6";

            const fondo =
                colorFondo?.value ||
                "#FFFFFF";

            const texto =
                colorTexto?.value ||
                "#111827";


            if (colorPrincipalValor) {

                colorPrincipalValor.textContent =
                    principal.toUpperCase();

            }


            if (colorSecundarioValor) {

                colorSecundarioValor.textContent =
                    secundario.toUpperCase();

            }


            if (colorFondoValor) {

                colorFondoValor.textContent =
                    fondo.toUpperCase();

            }


            if (colorTextoValor) {

                colorTextoValor.textContent =
                    texto.toUpperCase();

            }


            // ---------------------------------------------
            // COLOR PRINCIPAL
            // ---------------------------------------------

            if (previewBoton) {

                previewBoton.style.background =
                    principal;

            }


            if (previewLogo) {

                const tieneImagen =
                    previewLogo.querySelector(
                        "img"
                    );

                if (!tieneImagen) {

                    previewLogo.style.background =
                        principal;

                }

            }


            // ---------------------------------------------
            // TEXTO
            // ---------------------------------------------

            if (previewBienvenida) {

                previewBienvenida.style.color =
                    texto;

            }


            if (previewNombre) {

                previewNombre.style.color =
                    texto;

            }


            // ---------------------------------------------
            // FONDO
            // ---------------------------------------------

            const phoneScreen =
                document.querySelector(
                    ".phone-screen"
                );

            if (phoneScreen) {

                phoneScreen.style.background =
                    fondo;

            }


            // ---------------------------------------------
            // COLOR SECUNDARIO
            // ---------------------------------------------

            const phoneHero =
                document.querySelector(
                    ".phone-hero"
                );

            if (phoneHero) {

                phoneHero.style.background =
                    secundario;

            }


            // ---------------------------------------------
            // TIPOGRAFÍA
            // ---------------------------------------------

            aplicarTipografia();


            // ---------------------------------------------
            // BOTONES
            // ---------------------------------------------

            aplicarEstiloBotones();


            // ---------------------------------------------
            // TARJETAS
            // ---------------------------------------------

            aplicarEstiloTarjetas();

        }


        // =================================================
        // CARGAR APARIENCIA
        // =================================================

        async function cargarApariencia() {

            try {

                cargandoApariencia =
                    true;


                const token =
                    localStorage.getItem(
                        "token"
                    );


                if (!token) {

                    console.error(
                        "No hay token de sesión."
                    );

                    return;

                }


                const respuesta =
                    await fetch(
                        `${API_BASE_URL}/api/apariencia`,
                        {

                            method: "GET",

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
                        "No se pudo cargar la apariencia."
                    );

                }


                // -----------------------------------------
                // NO EXISTE CONFIGURACIÓN
                // -----------------------------------------

                if (
                    !datos.existe ||
                    !datos.configuracion
                ) {

                    aparienciaGuardada = {
                        ...valoresOriginales
                    };


                    campos.forEach(
                        campo => {

                            if (!campo) {

                                return;

                            }

                            const valor =
                                valoresOriginales[
                                    campo.id
                                ];


                            if (
                                valor !== undefined
                            ) {

                                campo.value =
                                    valor;

                            }


                            ocultarBotonRestaurar(
                                campo.id
                            );

                        }
                    );
                if (
                    aparienciaGuardada.logoUrl
                ) {

                    const logoPreview =
                        document.getElementById(
                            "aparienciaLogoPreview"
                        );

                    const urlCompleta =
                        `${API_BASE_URL}${aparienciaGuardada.logoUrl}`;


                    if (logoPreview) {

                        logoPreview.innerHTML = `

                            <img
                                src="${urlCompleta}"
                                alt="Logo de la tienda"
                            >

                        `;

                    }


                    if (previewLogo) {

                        previewLogo.innerHTML = `

                            <img
                                src="${urlCompleta}"
                                alt="Logo"
                            >

                        `;


                        previewLogo.style.background =
                            "transparent";

                    }

                }

                    actualizarVistaPrevia();

                    cambiosSinGuardar =
                        false;

                    return;

                }


                // -----------------------------------------
                // CONFIGURACIÓN EXISTENTE
                // -----------------------------------------

                const configuracion =
                    datos.configuracion;


                aparienciaGuardada = {

                    aparienciaNombre:
                        configuracion.nombre_tienda ??
                        valoresOriginales.aparienciaNombre,

                    aparienciaDescripcion:
                        configuracion.descripcion_tienda ??
                        valoresOriginales.aparienciaDescripcion,

                    colorPrincipal:
                        configuracion.color_principal ??
                        valoresOriginales.colorPrincipal,

                    colorSecundario:
                        configuracion.color_secundario ??
                        valoresOriginales.colorSecundario,

                    colorFondo:
                        configuracion.color_fondo ??
                        valoresOriginales.colorFondo,

                    colorTexto:
                        configuracion.color_texto ??
                        valoresOriginales.colorTexto,

                    estiloBotones:
                        configuracion.estilo_botones ??
                        valoresOriginales.estiloBotones,

                    estiloTarjetas:
                        configuracion.estilo_tarjetas ??
                        valoresOriginales.estiloTarjetas,

                    textoBienvenida:
                        configuracion.texto_bienvenida ??
                        valoresOriginales.textoBienvenida,

                    textoSubtitulo:
                        configuracion.texto_subtitulo ??
                        valoresOriginales.textoSubtitulo,

                    fuentePrincipal:
                        configuracion.fuente_principal ??
                        valoresOriginales.fuentePrincipal,

                    fuenteTitulos:
                        configuracion.fuente_titulos ??
                        valoresOriginales.fuenteTitulos,

                    tamanoTitulos:
                        configuracion.tamano_titulos ??
                        valoresOriginales.tamanoTitulos,

                    pesoTitulos:
                        configuracion.peso_titulos ??
                        valoresOriginales.pesoTitulos

                };


                // -----------------------------------------
                // CARGAR CAMPOS
                // -----------------------------------------

                campos.forEach(
                    campo => {

                        if (!campo) {

                            return;

                        }


                        const valor =
                            aparienciaGuardada[
                                campo.id
                            ];


                        if (
                            valor !== undefined
                        ) {

                            campo.value =
                                valor;

                        }


                        ocultarBotonRestaurar(
                            campo.id
                        );

                    }
                );


                actualizarVistaPrevia();


                cambiosSinGuardar =
                    false;


                console.log(
                    "✓ Apariencia cargada:",
                    aparienciaGuardada
                );


            } catch (error) {

                console.error(
                    "Error cargando apariencia:",
                    error
                );


                alert(
                    error.message ||
                    "No se pudo cargar la apariencia."
                );


            } finally {

                cargandoApariencia =
                    false;

            }

        }


        // =================================================
        // GUARDAR APARIENCIA
        // =================================================

        async function guardarApariencia() {

            try {

                if (cargandoApariencia) {

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


                if (btnGuardarApariencia) {

                    btnGuardarApariencia.disabled =
                        true;

                    btnGuardarApariencia.textContent =
                        "Guardando...";

                }

                // -----------------------------------------
                // CONFIGURACIÓN
                // -----------------------------------------

                const configuracion = {

                    nombre_tienda:
                        aparienciaNombre?.value || "",

                    descripcion_tienda:
                        aparienciaDescripcion?.value || "",

                    logo_url_actual:
                        aparienciaGuardada?.logoUrl ||
                        "",

                    color_principal:
                        colorPrincipal?.value ||
                        "#7C3AED",

                    color_secundario:
                        colorSecundario?.value ||
                        "#F3F4F6",

                    color_fondo:
                        colorFondo?.value ||
                        "#FFFFFF",

                    color_texto:
                        colorTexto?.value ||
                        "#111827",

                    estilo_botones:
                        estiloBotones?.value ||
                        "rounded",

                    estilo_tarjetas:
                        estiloTarjetas?.value ||
                        "soft",

                    texto_bienvenida:
                        textoBienvenida?.value || "",

                    texto_subtitulo:
                        textoSubtitulo?.value || "",

                    fuente_principal:
                        fuentePrincipal?.value ||
                        "Inter",

                    fuente_titulos:
                        fuenteTitulos?.value ||
                        "Inter",

                    tamano_titulos:
                        tamanoTitulos?.value ||
                        "medium",

                    peso_titulos:
                        pesoTitulos?.value ||
                        "600"

                };


                console.log(
                    "Enviando configuración:",
                    configuracion
                );


                // -----------------------------------------
                // REQUEST
                // -----------------------------------------

                                const formData =
                    new FormData();


                Object.keys(configuracion).forEach(
                    campo => {

                        formData.append(
                            campo,
                            configuracion[campo]
                        );

                    }
                );


                if (
                    aparienciaLogo?.files?.[0]
                ) {

                    formData.append(
                        "logo",
                        aparienciaLogo.files[0]
                    );

                }


                const respuesta =
                    await fetch(
                        `${API_BASE_URL}/api/apariencia`,
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


                const datos =
                    await respuesta.json();


                if (!respuesta.ok) {

                    throw new Error(
                        datos.error ||
                        "No se pudieron guardar los cambios."
                    );

                }


                // -----------------------------------------
                // ACTUALIZAR ESTADO
                // -----------------------------------------

                aparienciaGuardada = {

                    aparienciaNombre:
                        configuracion.nombre_tienda ??
                        valoresOriginales.aparienciaNombre,

                    aparienciaDescripcion:
                        configuracion.descripcion_tienda ??
                        valoresOriginales.aparienciaDescripcion,

                    logoUrl:
                        configuracion.logo_url ??
                        "",

                    colorPrincipal:
                        colorPrincipal?.value ||
                        "#7C3AED",

                    colorSecundario:
                        colorSecundario?.value ||
                        "#F3F4F6",

                    colorFondo:
                        colorFondo?.value ||
                        "#FFFFFF",

                    colorTexto:
                        colorTexto?.value ||
                        "#111827",

                    estiloBotones:
                        estiloBotones?.value ||
                        "rounded",

                    estiloTarjetas:
                        estiloTarjetas?.value ||
                        "soft",

                    textoBienvenida:
                        textoBienvenida?.value || "",

                    textoSubtitulo:
                        textoSubtitulo?.value || "",

                    fuentePrincipal:
                        fuentePrincipal?.value ||
                        "Inter",

                    fuenteTitulos:
                        fuenteTitulos?.value ||
                        "Inter",

                    tamanoTitulos:
                        tamanoTitulos?.value ||
                        "medium",

                    pesoTitulos:
                        pesoTitulos?.value ||
                        "600"

                };


                cambiosSinGuardar =
                    false;


                // -----------------------------------------
                // OCULTAR RESTAURADORES
                // -----------------------------------------

                campos.forEach(
                    campo => {

                        if (!campo) {

                            return;

                        }

                        ocultarBotonRestaurar(
                            campo.id
                        );

                    }
                );


                console.log(
                    "✓ Apariencia guardada:",
                    datos
                );


                alert(
                    "Cambios guardados correctamente."
                );


            } catch (error) {

                console.error(
                    "Error guardando apariencia:",
                    error
                );


                alert(
                    error.message ||
                    "No se pudieron guardar los cambios."
                );


            } finally {

                if (btnGuardarApariencia) {

                    btnGuardarApariencia.disabled =
                        false;

                    btnGuardarApariencia.textContent =
                        "Guardar cambios";

                }

            }

        }


        // =================================================
        // EVENTOS DE CAMPOS
        // =================================================

        campos.forEach(
            campo => {

                if (!campo) {

                    return;

                }


                campo.addEventListener(
                    "input",
                    () => {

                        comprobarCambio(
                            campo
                        );


                        actualizarVistaPrevia();


                        if (
                            !cargandoApariencia
                        ) {

                            cambiosSinGuardar =
                                true;

                        }

                    }
                );


                campo.addEventListener(
                    "change",
                    () => {

                        comprobarCambio(
                            campo
                        );


                        actualizarVistaPrevia();


                        if (
                            !cargandoApariencia
                        ) {

                            cambiosSinGuardar =
                                true;

                        }

                    }
                );

            }
        );


        // =================================================
        // BOTÓN GUARDAR
        // =================================================

        if (
            btnGuardarApariencia
        ) {

            btnGuardarApariencia.addEventListener(
                "click",
                guardarApariencia
            );

        }


        // =================================================
        // RESTAURAR INDIVIDUAL
        // =================================================

        const botonesRestaurar =
            document.querySelectorAll(
                ".appearance-reset"
            );


        botonesRestaurar.forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const id =
                            boton.dataset.reset;


                        const campo =
                            document.getElementById(
                                id
                            );


                        if (!campo) {

                            return;

                        }


                        const valorRestaurar =
                            aparienciaGuardada &&
                            aparienciaGuardada[id] !==
                                undefined

                                ? aparienciaGuardada[id]

                                : valoresOriginales[id];


                        if (
                            valorRestaurar !== undefined
                        ) {

                            campo.value =
                                valorRestaurar;

                        }


                        ocultarBotonRestaurar(
                            id
                        );


                        actualizarVistaPrevia();


                        if (
                            !cargandoApariencia
                        ) {

                            cambiosSinGuardar =
                                true;

                        }

                    }
                );

            }
        );


        // =================================================
        // RESTABLECER TODA LA APARIENCIA
        // =================================================

        if (
            btnRestablecerApariencia
        ) {

            btnRestablecerApariencia.addEventListener(
                "click",
                () => {

                    const confirmar =
                        confirm(
                            "¿Querés restablecer toda la apariencia a sus valores iniciales?"
                        );


                    if (!confirmar) {

                        return;

                    }


                    campos.forEach(
                        campo => {

                            if (!campo) {

                                return;

                            }


                            const valor =
                                valoresOriginales[
                                    campo.id
                                ];


                            if (
                                valor !== undefined
                            ) {

                                campo.value =
                                    valor;

                            }


                            comprobarCambio(
                                campo
                            );

                        }
                    );


                    actualizarVistaPrevia();


                    if (
                        !cargandoApariencia
                    ) {

                        cambiosSinGuardar =
                            true;

                    }

                }
            );

        }


        // =================================================
        // LOGO — VISTA PREVIA
        // =================================================

        if (aparienciaLogo) {

            aparienciaLogo.addEventListener(
                "change",
                () => {

                    const archivo =
                        aparienciaLogo.files[0];


                    if (!archivo) {

                        return;

                    }


                    const url =
                        URL.createObjectURL(
                            archivo
                        );


                    const logoPreview =
                        document.getElementById(
                            "aparienciaLogoPreview"
                        );


                    if (logoPreview) {

                        logoPreview.innerHTML = `

                            <img
                                src="${url}"
                                alt="Vista previa del logo"
                            >

                        `;

                    }


                    if (previewLogo) {

                        previewLogo.innerHTML = `

                            <img
                                src="${url}"
                                alt="Logo"
                            >

                        `;


                        previewLogo.style.background =
                            "transparent";

                    }


                    cambiosSinGuardar =
                        true;

                }
            );

        }


        // =================================================
        // AVISO AL SALIR SIN GUARDAR
        // =================================================

        window.addEventListener(
            "beforeunload",
            event => {

                if (!cambiosSinGuardar) {

                    return;

                }


                event.preventDefault();

                event.returnValue = "";

            }
        );


        // =================================================
        // INICIALIZAR
        // =================================================

        cargarApariencia();


        console.log(
            "✓ Editor de apariencia iniciado"
        );

    }
);