const express = require("express");
const router = express.Router();

const pool = require("../database/connection");

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT id, nombre, slug
      FROM tenants
      ORDER BY nombre ASC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener tenants:", error);

    res.status(500).json({
      error: "Error al obtener tenants",
    });
  }
});

module.exports = router;