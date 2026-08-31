require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const productosRoutes = require("./routes/productos");
const categoriasRoutes = require("./routes/categorias");
const tenantsRoutes = require("./routes/tenants");
const authRoutes = require("./routes/auth");
const debugRoutes = require("./routes/debug");
const dashboardRoutes = require("./routes/dashboard");
const aparienciaRoutes = require("./routes/apariencia");
const inicializarBD = require("./database/init");

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());


// =====================================================
// ARCHIVOS ESTÁTICOS
// =====================================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "../uploads")
    )
);

app.use(
    "/assets",
    express.static(
        path.join(__dirname, "../../assets")
    )
);


// =====================================================
// RUTAS API
// =====================================================

app.use("/api/auth", authRoutes);

app.use(
    "/api/categorias",
    categoriasRoutes
);

app.use(
    "/api/tenants",
    tenantsRoutes
);

app.use(
    "/api/productos",
    productosRoutes
);

app.use(
    "/api/debug",
    debugRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/apariencia",
    aparienciaRoutes
);


// =====================================================
// RUTA PRINCIPAL
// =====================================================

app.get("/", (req, res) => {

    res.json({
        mensaje:
            "API Editorial Peregrinar funcionando"
    });

});


// =====================================================
// PUERTO
// =====================================================

const PORT =
    process.env.PORT || 3000;


// =====================================================
// INICIALIZAR BASE DE DATOS
// =====================================================

inicializarBD()

    .then(() => {

        app.listen(
            PORT,
            () => {

                console.log(
                    `Servidor Editorial Peregrinar funcionando en el puerto ${PORT}`
                );

            }
        );

    })

    .catch((error) => {

        console.error(
            "Error fatal al inicializar:",
            error
        );

        process.exit(1);

    });