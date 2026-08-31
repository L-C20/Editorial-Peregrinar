const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const pool = require("../database/connection");


// ======================================================
// LOGIN
// ======================================================

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;


    // ==================================================
    // VALIDAR DATOS
    // ==================================================

    if (!email || !password) {

      return res.status(400).json({
        error: "Email y contraseña son obligatorios",
      });

    }


    // ==================================================
    // BUSCAR USUARIO + TENANT
    // ==================================================

    const resultado = await pool.query(
      `
      SELECT
        usuarios.id,
        usuarios.tenant_id,
        usuarios.nombre,
        usuarios.email,
        usuarios.password_hash,
        usuarios.rol,
        usuarios.activo,

        tenants.nombre AS tenant_nombre

      FROM usuarios

      INNER JOIN tenants
        ON tenants.id = usuarios.tenant_id

      WHERE usuarios.email = $1

      LIMIT 1
      `,
      [email]
    );


    // ==================================================
    // USUARIO NO ENCONTRADO
    // ==================================================

    if (resultado.rows.length === 0) {

      return res.status(401).json({
        error: "Email o contraseña incorrectos",
      });

    }


    const usuario = resultado.rows[0];


    // ==================================================
    // USUARIO DESACTIVADO
    // ==================================================

    if (!usuario.activo) {

      return res.status(403).json({
        error: "El usuario está desactivado",
      });

    }


    // ==================================================
    // COMPROBAR CONTRASEÑA
    // ==================================================

    const passwordCorrecta = await bcrypt.compare(
      password,
      usuario.password_hash
    );


    if (!passwordCorrecta) {

      return res.status(401).json({
        error: "Email o contraseña incorrectos",
      });

    }


    // ==================================================
    // CREAR TOKEN
    // ==================================================

    const token = jwt.sign(

      {
        usuario_id: usuario.id,
        tenant_id: usuario.tenant_id,
        rol: usuario.rol,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "8h",
      }

    );


    // ==================================================
    // RESPUESTA
    // ==================================================

    res.json({

      mensaje: "Login exitoso",

      token,

      usuario: {

        id: usuario.id,

        tenant_id: usuario.tenant_id,

        tenant_nombre: usuario.tenant_nombre,

        nombre: usuario.nombre,

        email: usuario.email,

        rol: usuario.rol,

      },

    });


  } catch (error) {

    console.error(
      "Error en login:",
      error
    );


    res.status(500).json({

      error:
        "Error interno del servidor",

    });

  }

});


module.exports = router;