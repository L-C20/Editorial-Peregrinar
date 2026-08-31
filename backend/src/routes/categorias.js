const express = require("express");
const router = express.Router();

const pool = require("../database/connection");
const verificarToken = require("../middleware/auth");


router.get("/", verificarToken, async (req, res) => {
  try {
    const resultado = await pool.query(
  `
  SELECT *
  FROM categorias
  WHERE tenant_id = $1
  ORDER BY nombre ASC
  `,
  [req.usuario.tenant_id]
);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener categorías:", error);

    res.status(500).json({
      error: "Error al obtener categorías",
    });
  }
});

router.post("/", verificarToken, async (req, res) => {
  try {
    const { nombre, slug } = req.body;

    if (!nombre || !slug ) {
      return res.status(400).json({
        error: "nombre y slug son obligatorios",
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO categorias (
        tenant_id,
        nombre,
        slug
      )
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
[req.usuario.tenant_id, nombre, slug]    );

    res.status(201).json(resultado.rows[0]);

  } catch (error) {
    console.error("Error al crear categoría:", error);

    res.status(500).json({
      error: "Error al crear categoría",
    });
  }
});

router.put("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, slug } = req.body;

    if (!nombre || !slug) {
      return res.status(400).json({
        error: "nombre y slug son obligatorios",
      });
    }

    const resultado = await pool.query(
      `
      UPDATE categorias
      SET
        nombre = $1,
        slug = $2
      WHERE id = $3
        AND tenant_id = $4
      RETURNING *;
      `,
      [
        nombre,
        slug,
        id,
        req.usuario.tenant_id
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Categoría no encontrada",
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error("Error al actualizar categoría:", error);

    res.status(500).json({
      error: "Error al actualizar categoría",
    });
  }
}); 

router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      DELETE FROM categorias
      WHERE id = $1
        AND tenant_id = $2
      RETURNING *;
      `,
      [
        id,
        req.usuario.tenant_id
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Categoría no encontrada",
      });
    }

    res.json({
      mensaje: "Categoría eliminada correctamente",
      categoria: resultado.rows[0],
    });

  } catch (error) {
    console.error("Error al eliminar categoría:", error);

    res.status(500).json({
      error: "Error al eliminar categoría",
    });
  }
});

module.exports = router;