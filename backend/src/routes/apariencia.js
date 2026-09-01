const express = require("express");

const router = express.Router();

const pool = require("../database/connection");

const verificarToken =
    require("../middleware/auth");

const verificarAdmin =
    require("../middleware/admin");

const uploadApariencia =
    require("../middleware/uploadApariencia");


// =====================================================
// OBTENER CONFIGURACIÓN DE APARIENCIA
// GET /api/apariencia
// =====================================================

router.get(
    "/",
    verificarToken,
    verificarAdmin,

    async (req, res) => {

        try {

            const tenantId =
                req.usuario.tenant_id;


            const resultado =
                await pool.query(
                    `
                    SELECT
                        id,
                        tenant_id,
                        nombre_tienda,
                        descripcion_tienda,
                        logo_url,
                        color_principal,
                        color_secundario,
                        color_fondo,
                        color_texto,
                        estilo_botones,
                        estilo_tarjetas,
                        texto_bienvenida,
                        texto_subtitulo,
                        fuente_principal,
                        fuente_titulos,
                        tamano_titulos,
                        peso_titulos,
                        created_at,
                        updated_at

                    FROM configuracion_apariencia

                    WHERE tenant_id = $1

                    LIMIT 1
                    `,
                    [
                        tenantId
                    ]
                );


            // =================================================
            // SI TODAVÍA NO EXISTE CONFIGURACIÓN
            // =================================================

            if (
                resultado.rows.length === 0
            ) {

                return res.json({

                    existe: false,

                    configuracion: null

                });

            }


            // =================================================
            // DEVOLVER CONFIGURACIÓN
            // =================================================

            return res.json({

                existe: true,

                configuracion:
                    resultado.rows[0]

            });


        } catch (error) {

            console.error(
                "Error al obtener apariencia:",
                error
            );


            return res.status(500).json({

                error:
                    "Error al obtener configuración de apariencia"

            });

        }

    }
);


// =====================================================
// GUARDAR CONFIGURACIÓN DE APARIENCIA
// PUT /api/apariencia
// =====================================================

router.put(
    "/",
    verificarToken,
    verificarAdmin,
    uploadApariencia.single("logo"),

    async (req, res) => {

        try {

            const tenantId =
                req.usuario.tenant_id;


            const {

                nombre_tienda,

                descripcion_tienda,

                logo_url_actual,

                color_principal,

                color_secundario,

                color_fondo,

                color_texto,

                estilo_botones,

                estilo_tarjetas,

                texto_bienvenida,

                texto_subtitulo,

                fuente_principal,

                fuente_titulos,

                tamano_titulos,

                peso_titulos

            } = req.body;

                        // =================================================
            // DETERMINAR LOGO
            // =================================================

            let logo_url =
                logo_url_actual ??
                null;


            if (req.file) {

                logo_url =
                    `/uploads/apariencia/${req.file.filename}`;

            }

            // =================================================
            // UPSERT
            // =================================================

            const resultado =
                await pool.query(
                    `
                    INSERT INTO configuracion_apariencia (

                        tenant_id,

                        nombre_tienda,

                        descripcion_tienda,

                        logo_url,

                        color_principal,

                        color_secundario,

                        color_fondo,

                        color_texto,

                        estilo_botones,

                        estilo_tarjetas,

                        texto_bienvenida,

                        texto_subtitulo,

                        fuente_principal,

                        fuente_titulos,

                        tamano_titulos,

                        peso_titulos,

                        updated_at

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
                        $11,
                        $12,
                        $13,
                        $14,
                        $15,
                        $16,
                        NOW()

                    )

                    ON CONFLICT (tenant_id)

                    DO UPDATE SET

                        nombre_tienda =
                            EXCLUDED.nombre_tienda,

                        descripcion_tienda =
                            EXCLUDED.descripcion_tienda,

                        logo_url =
                            EXCLUDED.logo_url,

                        color_principal =
                            EXCLUDED.color_principal,

                        color_secundario =
                            EXCLUDED.color_secundario,

                        color_fondo =
                            EXCLUDED.color_fondo,

                        color_texto =
                            EXCLUDED.color_texto,

                        estilo_botones =
                            EXCLUDED.estilo_botones,

                        estilo_tarjetas =
                            EXCLUDED.estilo_tarjetas,

                        texto_bienvenida =
                            EXCLUDED.texto_bienvenida,

                        texto_subtitulo =
                            EXCLUDED.texto_subtitulo,

                        fuente_principal =
                            EXCLUDED.fuente_principal,

                        fuente_titulos =
                            EXCLUDED.fuente_titulos,

                        tamano_titulos =
                            EXCLUDED.tamano_titulos,

                        peso_titulos =
                            EXCLUDED.peso_titulos,

                        updated_at =
                            NOW()

                    RETURNING *

                    `,
                    [

                        tenantId,

                        nombre_tienda ??
                            null,

                        descripcion_tienda ??
                            null,

                        logo_url ??
                            null,

                        color_principal ??
                            "#7C3AED",

                        color_secundario ??
                            "#F3F4F6",

                        color_fondo ??
                            "#FFFFFF",

                        color_texto ??
                            "#111827",

                        estilo_botones ??
                            "rounded",

                        estilo_tarjetas ??
                            "soft",

                        texto_bienvenida ??
                            "Bienvenido a nuestra tienda",

                        texto_subtitulo ??
                            "Descubrí nuestros productos...",

                        fuente_principal ??
                            "Inter",

                        fuente_titulos ??
                            "Inter",

                        tamano_titulos ??
                            "medium",

                        peso_titulos ??
                            "600"

                    ]
                );


            // =================================================
            // RESPUESTA
            // =================================================

            return res.json({

                mensaje:
                    "Configuración de apariencia guardada correctamente",

                configuracion:
                    resultado.rows[0]

            });


        } catch (error) {

            console.error(
                "Error al guardar apariencia:",
                error
            );


            return res.status(500).json({

                error:
                    "Error al guardar configuración de apariencia"

            });

        }

    }
);


module.exports = router;