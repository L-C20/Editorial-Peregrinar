const express = require("express");

const router = express.Router();

const pool = require("../database/connection");

const verificarToken = require("../middleware/auth");
const verificarAdmin = require("../middleware/admin");

const upload = require("../middleware/upload");


// =========================================================
// CONFIGURACIÓN
// =========================================================

const MAX_IMAGENES = 4;


// =========================================================
// OBTENER PRODUCTOS
// GET /api/productos
// =========================================================

router.get("/", async (req, res) => {

  try {

    const resultado = await pool.query(`
      SELECT
        p.id,
        p.tenant_id,
        p.categoria_id,
        p.nombre,
        p.slug,
        p.descripcion,
        p.precio,
        p.imagen_principal,
        p.destacado,
        p.novedad,
        p.disponible,
        p.orden,

        c.nombre AS categoria_nombre,
        c.slug AS categoria_slug,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', pi.id,
                'imagen_url', pi.imagen_url,
                'orden', pi.orden
              )
              ORDER BY pi.orden ASC
            )
            FROM producto_imagenes pi
            WHERE pi.producto_id = p.id
          ),
          '[]'::json
        ) AS imagenes

      FROM productos p

      LEFT JOIN categorias c
        ON c.id = p.categoria_id

      WHERE p.disponible = true

      ORDER BY
        p.orden ASC,
        p.nombre ASC
    `);

    res.json(resultado.rows);

  } catch (error) {

    console.error(
      "Error al obtener productos:",
      error
    );

    res.status(500).json({
      error: "Error al obtener productos"
    });

  }

});


// =========================================================
// CREAR PRODUCTO
// POST /api/productos
// =========================================================

router.post(
  "/",

  verificarToken,
  verificarAdmin,

  upload.fields([
    {
      name: "productoImagen1",
      maxCount: 1
    },
    {
      name: "productoImagen2",
      maxCount: 1
    },
    {
      name: "productoImagen3",
      maxCount: 1
    },
    {
      name: "productoImagen4",
      maxCount: 1
    }
  ]),

  async (req, res) => {

    try {

      const {
        categoria_id,
        nombre,
        slug,
        descripcion,
        precio,
        destacado,
        novedad,
        disponible,
        orden
      } = req.body;


      if (
        !nombre ||
        !slug ||
        precio === undefined
      ) {

        return res.status(400).json({
          error:
            "nombre, slug y precio son obligatorios"
        });

      }


      const resultado = await pool.query(
        `
        INSERT INTO productos (
          tenant_id,
          categoria_id,
          nombre,
          slug,
          descripcion,
          precio,
          imagen_principal,
          destacado,
          novedad,
          disponible,
          orden
        )

        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11
        )

        RETURNING *;
        `,
        [
          req.usuario.tenant_id,
          categoria_id || null,
          nombre,
          slug,
          descripcion || null,
          precio,
          null,
          destacado === true ||
          destacado === "true",
          novedad === true ||
          novedad === "true",
          disponible === false ||
          disponible === "false"
            ? false
            : true,
          Number(orden) || 0
        ]
      );


      const producto = resultado.rows[0];

      const imagenesGuardadas = [];


      // =====================================================
      // GUARDAR IMÁGENES
      // =====================================================

      for (
        let numero = 1;
        numero <= MAX_IMAGENES;
        numero++
      ) {

        const campo =
          `productoImagen${numero}`;

        const archivo =
          req.files?.[campo]?.[0];


        if (!archivo) {
          continue;
        }


        const imagenUrl =
          `/uploads/productos/${archivo.filename}`;


        const imagenResultado =
          await pool.query(
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
              producto.id,
              imagenUrl,
              numero - 1
            ]
          );


        imagenesGuardadas.push(
          imagenResultado.rows[0]
        );

      }


      // =====================================================
      // IMAGEN PRINCIPAL
      // =====================================================

      if (
        imagenesGuardadas.length > 0
      ) {

        const imagenPrincipal =
          imagenesGuardadas.find(
            imagen =>
              Number(imagen.orden) === 0
          );


        if (imagenPrincipal) {

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
              imagenPrincipal.imagen_url,
              producto.id,
              req.usuario.tenant_id
            ]
          );


          producto.imagen_principal =
            imagenPrincipal.imagen_url;

        }

      }


      res.status(201).json({

        mensaje:
          "Producto creado correctamente",

        producto,

        imagenes:
          imagenesGuardadas

      });


    } catch (error) {

      console.error(
        "Error al crear producto:",
        error
      );

      res.status(500).json({
        error:
          "Error al crear producto"
      });

    }

  }
);


// =========================================================
// ACTUALIZAR PRODUCTO
// PUT /api/productos/:id
// =========================================================

router.put(
  "/:id",

  verificarToken,
  verificarAdmin,

  upload.fields([
    {
      name: "productoImagen1",
      maxCount: 1
    },
    {
      name: "productoImagen2",
      maxCount: 1
    },
    {
      name: "productoImagen3",
      maxCount: 1
    },
    {
      name: "productoImagen4",
      maxCount: 1
    }
  ]),

  async (req, res) => {

    try {

      const {
        id
      } = req.params;


      const {
        categoria_id,
        nombre,
        slug,
        descripcion,
        precio,
        destacado,
        novedad,
        disponible,
        orden
      } = req.body;


      if (
        !nombre ||
        !slug ||
        precio === undefined
      ) {

        return res.status(400).json({
          error:
            "nombre, slug y precio son obligatorios"
        });

      }


      // =====================================================
      // BUSCAR PRODUCTO
      // =====================================================

      const productoResultado =
        await pool.query(
          `
          SELECT *
          FROM productos

          WHERE id = $1
            AND tenant_id = $2
          `,
          [
            id,
            req.usuario.tenant_id
          ]
        );


      if (
        productoResultado.rows.length === 0
      ) {

        return res.status(404).json({
          error:
            "Producto no encontrado"
        });

      }


      // =====================================================
      // ACTUALIZAR DATOS
      // =====================================================

      const resultado =
        await pool.query(
          `
          UPDATE productos

          SET
            categoria_id = $1,
            nombre = $2,
            slug = $3,
            descripcion = $4,
            precio = $5,
            destacado = $6,
            novedad = $7,
            disponible = $8,
            orden = $9,
            updated_at = NOW()

          WHERE id = $10
            AND tenant_id = $11

          RETURNING *;
          `,
          [
            categoria_id || null,
            nombre,
            slug,
            descripcion || null,
            precio,

            destacado === true ||
            destacado === "true",

            novedad === true ||
            novedad === "true",

            disponible === false ||
            disponible === "false"
              ? false
              : true,

            Number(orden) || 0,

            id,
            req.usuario.tenant_id
          ]
        );


      // =====================================================
      // OBTENER IMÁGENES ACTUALES
      // =====================================================

      const imagenesActualesResultado =
        await pool.query(
          `
          SELECT
            id,
            producto_id,
            imagen_url,
            orden

          FROM producto_imagenes

          WHERE producto_id = $1

          ORDER BY orden ASC
          `,
          [id]
        );


      const imagenesActuales =
        imagenesActualesResultado.rows;


      // =====================================================
      // PROCESAR IMÁGENES
      // =====================================================

      for (
        let numero = 1;
        numero <= MAX_IMAGENES;
        numero++
      ) {

        const campo =
          `productoImagen${numero}`;

        const archivo =
          req.files?.[campo]?.[0];


        if (!archivo) {
          continue;
        }


        const nuevoOrden =
          numero - 1;


        const nuevaImagenUrl =
          `/uploads/productos/${archivo.filename}`;


        const imagenExistente =
          imagenesActuales.find(
            imagen =>
              Number(imagen.orden) ===
              nuevoOrden
          );


        // ===================================================
        // REEMPLAZAR
        // ===================================================

        if (imagenExistente) {

          await pool.query(
            `
            UPDATE producto_imagenes

            SET
              imagen_url = $1

            WHERE id = $2
              AND producto_id = $3
            `,
            [
              nuevaImagenUrl,
              imagenExistente.id,
              id
            ]
          );

        }


        // ===================================================
        // CREAR
        // ===================================================

        else {

          await pool.query(
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
            `,
            [
              id,
              nuevaImagenUrl,
              nuevoOrden
            ]
          );

        }

      }


      // =====================================================
      // DETERMINAR IMAGEN PRINCIPAL
      // =====================================================

      const imagenPrincipalResultado =
        await pool.query(
          `
          SELECT imagen_url

          FROM producto_imagenes

          WHERE producto_id = $1
            AND orden = 0

          ORDER BY created_at ASC

          LIMIT 1;
          `,
          [id]
        );


      const imagenPrincipal =
        imagenPrincipalResultado.rows.length > 0
          ? imagenPrincipalResultado.rows[0].imagen_url
          : null;


      // =====================================================
      // ACTUALIZAR IMAGEN PRINCIPAL
      // =====================================================

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
          imagenPrincipal,
          id,
          req.usuario.tenant_id
        ]
      );


      // =====================================================
      // OBTENER IMÁGENES FINALES
      // =====================================================

      const imagenesFinalesResultado =
        await pool.query(
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
          [id]
        );


      res.json({

        mensaje:
          "Producto actualizado correctamente",

        producto: {
          ...resultado.rows[0],
          imagen_principal:
            imagenPrincipal
        },

        imagenes:
          imagenesFinalesResultado.rows

      });


    } catch (error) {

      console.error(
        "Error al actualizar producto:",
        error
      );

      res.status(500).json({
        error:
          "Error al actualizar producto"
      });

    }

  }
);


// =========================================================
// AGREGAR NUEVA IMAGEN
// POST /api/productos/:productoId/imagenes
// =========================================================

router.post(
  "/:productoId/imagenes",

  verificarToken,
  verificarAdmin,

  upload.single("imagen"),

  async (req, res) => {

    try {

      const {
        productoId
      } = req.params;


      console.log(
        "📥 POST IMAGEN:",
        productoId
      );


      if (!req.file) {

        return res.status(400).json({
          error:
            "No se recibió ninguna imagen."
        });

      }


      // =====================================================
      // VERIFICAR PRODUCTO
      // =====================================================

      const producto =
        await pool.query(
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


      if (
        producto.rows.length === 0
      ) {

        return res.status(404).json({
          error:
            "Producto no encontrado."
        });

      }


      // =====================================================
      // CONTAR IMÁGENES
      // =====================================================

      const cantidadResultado =
        await pool.query(
          `
          SELECT COUNT(*) AS cantidad

          FROM producto_imagenes

          WHERE producto_id = $1
          `,
          [productoId]
        );


      const cantidad =
        Number(
          cantidadResultado.rows[0].cantidad
        );


      if (
        cantidad >= MAX_IMAGENES
      ) {

        return res.status(400).json({
          error:
            "El producto ya tiene el máximo de 4 imágenes."
        });

      }


      // =====================================================
      // SIGUIENTE ORDEN
      // =====================================================

      const ultimoOrden =
        await pool.query(
          `
          SELECT
            COALESCE(
              MAX(orden),
              -1
            ) + 1 AS siguiente_orden

          FROM producto_imagenes

          WHERE producto_id = $1
          `,
          [productoId]
        );


      const siguienteOrden =
        Number(
          ultimoOrden.rows[0].siguiente_orden
        );


      const imagenUrl =
        `/uploads/productos/${req.file.filename}`;


      // =====================================================
      // GUARDAR
      // =====================================================

      const resultado =
        await pool.query(
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


      // =====================================================
      // IMAGEN PRINCIPAL
      // =====================================================

      if (
        siguienteOrden === 0
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

      }


      res.status(201).json({

        mensaje:
          "Imagen agregada correctamente.",

        imagen:
          resultado.rows[0]

      });


    } catch (error) {

      console.error(
        "Error al agregar imagen:",
        error
      );

      res.status(500).json({
        error:
          "Error al agregar imagen."
      });

    }

  }
);


// =========================================================
// REEMPLAZAR IMAGEN
// PUT /api/productos/:productoId/imagenes/:imagenId
// =========================================================

router.put(
  "/:productoId/imagenes/:imagenId",

  verificarToken,
  verificarAdmin,

  upload.single("imagen"),

  async (req, res) => {

    try {

      const {
        productoId,
        imagenId
      } = req.params;


      if (!req.file) {

        return res.status(400).json({
          error:
            "No se recibió ninguna imagen."
        });

      }


      const imagenActual =
        await pool.query(
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
          error:
            "Imagen no encontrada."
        });

      }


      const imagen =
        imagenActual.rows[0];


      const nuevaImagenUrl =
        `/uploads/productos/${req.file.filename}`;


      const resultado =
        await pool.query(
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
      // SI ES PRINCIPAL
      // =====================================================

      if (
        Number(imagen.orden) === 0
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
        error:
          "Error al reemplazar imagen"
      });

    }

  }
);


// =========================================================
// ELIMINAR IMAGEN
// DELETE /api/productos/:productoId/imagenes/:imagenId
// =========================================================

router.delete(
  "/:productoId/imagenes/:imagenId",

  verificarToken,
  verificarAdmin,

  async (req, res) => {

    try {

      const {
        productoId,
        imagenId
      } = req.params;


      const imagenResultado =
        await pool.query(
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
        imagenResultado.rows.length === 0
      ) {

        return res.status(404).json({
          error:
            "Imagen no encontrada"
        });

      }


      const imagen =
        imagenResultado.rows[0];


      await pool.query(
        `
        DELETE FROM producto_imagenes

        WHERE id = $1
          AND producto_id = $2;
        `,
        [
          imagenId,
          productoId
        ]
      );


      // =====================================================
      // SI ERA LA PRINCIPAL
      // =====================================================

      if (
        Number(imagen.orden) === 0
      ) {

        const siguienteImagen =
          await pool.query(
            `
            SELECT
              imagen_url

            FROM producto_imagenes

            WHERE producto_id = $1

            ORDER BY
              orden ASC,
              created_at ASC

            LIMIT 1;
            `,
            [productoId]
          );


        const nuevaPrincipal =
          siguienteImagen.rows.length > 0
            ? siguienteImagen.rows[0].imagen_url
            : null;


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
            nuevaPrincipal,
            productoId,
            req.usuario.tenant_id
          ]
        );

      }


      res.json({

        mensaje:
          "Imagen eliminada correctamente",

        imagen

      });


    } catch (error) {

      console.error(
        "Error al eliminar imagen:",
        error
      );

      res.status(500).json({
        error:
          "No se pudo eliminar la imagen"
      });

    }

  }
);


// =========================================================
// ELIMINAR PRODUCTO
// DELETE /api/productos/:id
// =========================================================

router.delete(
  "/:id",

  verificarToken,
  verificarAdmin,

  async (req, res) => {

    try {

      const {
        id
      } = req.params;


      const resultado =
        await pool.query(
          `
          DELETE FROM productos

          WHERE id = $1
            AND tenant_id = $2

          RETURNING *;
          `,
          [
            id,
            req.usuario.tenant_id
          ]
        );


      if (
        resultado.rows.length === 0
      ) {

        return res.status(404).json({
          error:
            "Producto no encontrado"
        });

      }


      res.json({

        mensaje:
          "Producto eliminado correctamente",

        producto:
          resultado.rows[0]

      });


    } catch (error) {

      console.error(
        "Error al eliminar producto:",
        error
      );

      res.status(500).json({
        error:
          "Error al eliminar producto"
      });

    }

  }
);


module.exports = router;
