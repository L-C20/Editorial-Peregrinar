const express = require("express");

const router = express.Router({
  mergeParams: true
});

const pool = require("../database/connection");

const verificarToken = require("../middleware/auth");
const verificarAdmin = require("../middleware/admin");

const upload = require("../middleware/upload");


// =========================================================
// OBTENER IMÁGENES DEL PRODUCTO
// GET /api/productos/:productoId/imagenes
// =========================================================

router.get(
  "/",
  verificarToken,
  verificarAdmin,

  async (req, res) => {

    try {

      const {
        productoId
      } = req.params;


      // =====================================================
      // VERIFICAR PRODUCTO Y TENANT
      // =====================================================

      const producto = await pool.query(
        `
        SELECT id
        FROM productos
        WHERE id = $1
          AND tenant_id = $2
        `,
        [
          productoId,
          req.usuario.tenant_id
        ]
      );


      if (producto.rows.length === 0) {

        return res.status(404).json({
          error: "Producto no encontrado"
        });

      }


      // =====================================================
      // OBTENER IMÁGENES
      // =====================================================

      const resultado = await pool.query(
        `
        SELECT
          id,
          producto_id,
          imagen_url,
          orden,
          created_at
        FROM producto_imagenes
        WHERE producto_id = $1
        ORDER BY
          orden ASC,
          created_at ASC
        `,
        [
          productoId
        ]
      );


      res.json(
        resultado.rows
      );


    } catch (error) {

      console.error(
        "Error al obtener imágenes:",
        error
      );

      res.status(500).json({
        error: "Error al obtener imágenes"
      });

    }

  }
);


// =========================================================
// AGREGAR UNA IMAGEN
// POST /api/productos/:productoId/imagenes
// =========================================================

router.post(
  "/",
  verificarToken,
  verificarAdmin,

  // IMPORTANTE:
  // El frontend envía:
  // imagenFormData.append("imagen", archivo)
  upload.single("imagen"),

  async (req, res) => {

    try {

      const {
        productoId
      } = req.params;


      // =====================================================
      // VERIFICAR PRODUCTO
      // =====================================================

      const producto = await pool.query(
        `
        SELECT
          id,
          imagen_principal
        FROM productos
        WHERE id = $1
          AND tenant_id = $2
        `,
        [
          productoId,
          req.usuario.tenant_id
        ]
      );


      if (producto.rows.length === 0) {

        return res.status(404).json({
          error: "Producto no encontrado"
        });

      }


      // =====================================================
      // VERIFICAR ARCHIVO
      // =====================================================

      if (!req.file) {

        return res.status(400).json({
          error: "No se recibió ninguna imagen"
        });

      }


      // =====================================================
      // OBTENER SIGUIENTE ORDEN
      // =====================================================

      const ultimoOrden = await pool.query(
        `
        SELECT
          COALESCE(
            MAX(orden),
            -1
          ) + 1 AS siguiente_orden
        FROM producto_imagenes
        WHERE producto_id = $1
        `,
        [
          productoId
        ]
      );


      const siguienteOrden =
        Number(
          ultimoOrden.rows[0].siguiente_orden
        );


      // =====================================================
      // CREAR URL DE LA IMAGEN
      // =====================================================

      const imagenUrl =
        `/uploads/productos/${req.file.filename}`;


      // =====================================================
      // GUARDAR IMAGEN
      // =====================================================
console.log("PASO 3: intentando guardar imagen en BD");
      const resultado = await pool.query(
        `
        INSERT INTO producto_imagenes (
          producto_id,
          imagen_url,
          orden
        )
        VALUES (
          $1,
          $2,
          $3
        )
        RETURNING *;
        `,
        [
          productoId,
          imagenUrl,
          siguienteOrden
        ]
      );


      const imagenGuardada =
        resultado.rows[0];


      // =====================================================
      // ACTUALIZAR IMAGEN PRINCIPAL
      // =====================================================

      const imagenPrincipalActual =
        producto.rows[0].imagen_principal;


      if (
        !imagenPrincipalActual
      ) {

        await pool.query(
          `
          UPDATE productos

          SET
            imagen_principal = $1,
            updated_at = NOW()

          WHERE id = $2
            AND tenant_id = $3
          `,
          [
            imagenUrl,
            productoId,
            req.usuario.tenant_id
          ]
        );
console.log("PASO 4: imagen guardada en BD");
      }


      // =====================================================
      // LOGS
      // =====================================================

      console.log(
        "📥 POST IMAGEN - PRODUCTO:",
        productoId
      );
console.log("PASO 1: producto verificado");

      console.log(
        "📸 ARCHIVO RECIBIDO:",
        req.file.originalname
      );

      console.log(
        "💾 IMAGEN GUARDADA:",
        imagenGuardada
      );


      // =====================================================
      // RESPUESTA
      // =====================================================

      return res.status(201).json({

        mensaje:
          "Imagen guardada correctamente",

        imagen:
          imagenGuardada

      });


    } catch (error) {

      console.error(
        "Error al subir imagen:",
        error
      );

      return res.status(500).json({
        error: "Error al subir imagen"
      });

    }

  }
);


// =========================================================
// REEMPLAZAR IMAGEN
// PUT /api/productos/:productoId/imagenes/:imagenId
// =========================================================

router.put(
  "/:imagenId",
  verificarToken,
  verificarAdmin,

  upload.single("imagen"),

  async (req, res) => {

    try {

      const {
        productoId,
        imagenId
      } = req.params;


      // =====================================================
      // VERIFICAR ARCHIVO
      // =====================================================
console.log("PASO 2: req.file:", req.file);
      if (!req.file) {

        return res.status(400).json({
          error: "No se recibió ninguna imagen"
        });

      }


      // =====================================================
      // BUSCAR IMAGEN
      // =====================================================

      const imagenActual = await pool.query(
        `
        SELECT
          pi.id,
          pi.producto_id,
          pi.imagen_url,
          pi.orden

        FROM producto_imagenes pi

        INNER JOIN productos p
          ON p.id = pi.producto_id

        WHERE pi.id = $1
          AND pi.producto_id = $2
          AND p.tenant_id = $3
        `,
        [
          imagenId,
          productoId,
          req.usuario.tenant_id
        ]
      );


      if (
        imagenActual.rows.length === 0
      ) {

        return res.status(404).json({
          error: "Imagen no encontrada"
        });

      }


      const imagenAnterior =
        imagenActual.rows[0];


      // =====================================================
      // NUEVA URL
      // =====================================================

      const nuevaImagenUrl =
        `/uploads/productos/${req.file.filename}`;


      // =====================================================
      // ACTUALIZAR IMAGEN
      // =====================================================

      const resultado = await pool.query(
        `
        UPDATE producto_imagenes

        SET
          imagen_url = $1

        WHERE id = $2
          AND producto_id = $3

        RETURNING *;
        `,
        [
          nuevaImagenUrl,
          imagenId,
          productoId
        ]
      );


      // =====================================================
      // SI ERA LA IMAGEN PRINCIPAL
      // =====================================================

      if (
        Number(imagenAnterior.orden) === 0
      ) {

        await pool.query(
          `
          UPDATE productos

          SET
            imagen_principal = $1,
            updated_at = NOW()

          WHERE id = $2
            AND tenant_id = $3
          `,
          [
            nuevaImagenUrl,
            productoId,
            req.usuario.tenant_id
          ]
        );

      }


      // =====================================================
      // RESPUESTA
      // =====================================================

      res.json({

        mensaje:
          "Imagen reemplazada correctamente",

        imagen:
          resultado.rows[0]

      });


    } catch (error) {

      console.error(
        "Error al reemplazar imagen:",
        error
      );

      res.status(500).json({
        error: "Error al reemplazar imagen"
      });

    }

  }
);


// =========================================================
// EDITAR ORDEN DE IMAGEN
// PUT /api/productos/:productoId/imagenes/:imagenId/orden
// =========================================================

router.put(
  "/:imagenId/orden",
  verificarToken,
  verificarAdmin,

  async (req, res) => {

    try {

      const {
        productoId,
        imagenId
      } = req.params;


      const {
        orden
      } = req.body;


      // =====================================================
      // VALIDAR ORDEN
      // =====================================================

      if (
        orden === undefined ||
        orden === null
      ) {

        return res.status(400).json({
          error: "El orden es obligatorio"
        });

      }


      // =====================================================
      // ACTUALIZAR ORDEN
      // =====================================================

      const resultado = await pool.query(
        `
        UPDATE producto_imagenes pi

        SET
          orden = $1

        FROM productos p

        WHERE pi.id = $2
          AND pi.producto_id = $3
          AND p.id = pi.producto_id
          AND p.tenant_id = $4

        RETURNING pi.*;
        `,
        [
          Number(orden),
          imagenId,
          productoId,
          req.usuario.tenant_id
        ]
      );


      if (
        resultado.rows.length === 0
      ) {

        return res.status(404).json({
          error: "Imagen no encontrada"
        });

      }


      // =====================================================
      // SI PASA A SER PRINCIPAL
      // =====================================================

      if (
        Number(orden) === 0
      ) {

        await pool.query(
          `
          UPDATE productos

          SET
            imagen_principal = $1,
            updated_at = NOW()

          WHERE id = $2
            AND tenant_id = $3
          `,
          [
            resultado.rows[0].imagen_url,
            productoId,
            req.usuario.tenant_id
          ]
        );

      }


      // =====================================================
      // RESPUESTA
      // =====================================================

      res.json({

        mensaje:
          "Orden actualizada correctamente",

        imagen:
          resultado.rows[0]

      });


    } catch (error) {

      console.error(
        "Error al actualizar orden:",
        error
      );

      res.status(500).json({
        error: "Error al actualizar orden"
      });

    }

  }
);


// =========================================================
// ELIMINAR IMAGEN
// DELETE /api/productos/:productoId/imagenes/:imagenId
// =========================================================

router.delete(
  "/:imagenId",
  verificarToken,
  verificarAdmin,

  async (req, res) => {

    try {

      const {
        productoId,
        imagenId
      } = req.params;


      // =====================================================
      // BUSCAR IMAGEN
      // =====================================================

      const imagen = await pool.query(
        `
        SELECT
          pi.id,
          pi.producto_id,
          pi.imagen_url,
          pi.orden

        FROM producto_imagenes pi

        INNER JOIN productos p
          ON p.id = pi.producto_id

        WHERE pi.id = $1
          AND pi.producto_id = $2
          AND p.tenant_id = $3
        `,
        [
          imagenId,
          productoId,
          req.usuario.tenant_id
        ]
      );


      if (
        imagen.rows.length === 0
      ) {

        return res.status(404).json({
          error: "Imagen no encontrada"
        });

      }


      const imagenEliminada =
        imagen.rows[0];


      // =====================================================
      // ELIMINAR IMAGEN
      // =====================================================

      await pool.query(
        `
        DELETE FROM producto_imagenes

        WHERE id = $1
          AND producto_id = $2
        `,
        [
          imagenId,
          productoId
        ]
      );

// =====================================================
// SI ERA LA PRINCIPAL
// DEJAR SIN IMAGEN PRINCIPAL
// =====================================================

if (
  Number(imagenEliminada.orden) === 0
) {

  await pool.query(
    `
    UPDATE productos

    SET
      imagen_principal = NULL,
      updated_at = NOW()

    WHERE id = $1
      AND tenant_id = $2
    `,
    [
      productoId,
      req.usuario.tenant_id
    ]
  );

}

      // =====================================================
      // RESPUESTA
      // =====================================================

      res.json({

        mensaje:
          "Imagen eliminada correctamente",

        imagen:
          imagenEliminada

      });


    } catch (error) {

      console.error(
        "Error al eliminar imagen:",
        error
      );

      res.status(500).json({
        error: "Error al eliminar imagen"
      });

    }

  }
);


module.exports = router;