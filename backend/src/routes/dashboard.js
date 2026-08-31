const express = require("express");

const router = express.Router();

const pool = require("../database/connection");
const verificarToken = require("../middleware/auth");


// ======================================================
// DASHBOARD
// ======================================================

router.get("/", verificarToken, async (req, res) => {

  try {

    const tenantId = req.usuario.tenant_id;


    // ==================================================
    // CONTAR PRODUCTOS
    // ==================================================

    const productos = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM productos
      WHERE tenant_id = $1
      `,
      [tenantId]
    );


    // ==================================================
    // CONTAR PRODUCTOS DISPONIBLES
    // ==================================================

    const productosDisponibles = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM productos
      WHERE tenant_id = $1
        AND disponible = true
      `,
      [tenantId]
    );


    // ==================================================
    // CONTAR CATEGORÍAS
    // ==================================================

    const categorias = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM categorias
      WHERE tenant_id = $1
      `,
      [tenantId]
    );


    // ==================================================
    // RESPUESTA
    // ==================================================

    res.json({

      productos: Number(
        productos.rows[0].total
      ),

      productos_disponibles: Number(
        productosDisponibles.rows[0].total
      ),

      categorias: Number(
        categorias.rows[0].total
      ),

      tienda_activa: true,

    });


  } catch (error) {

    console.error(
      "Error al obtener datos del dashboard:",
      error
    );


    res.status(500).json({

      error:
        "Error al obtener datos del dashboard",

    });

  }

});


module.exports = router;