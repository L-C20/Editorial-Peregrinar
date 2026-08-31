const express = require("express");
const verificarToken = require("../middleware/auth");
const verificarAdmin = require("../middleware/admin");
const router = express.Router();

router.get("/protegido", verificarToken, (req, res) => {
  res.json({
    mensaje: "Acceso autorizado",
    usuario: req.usuario,
  });
});
router.get(
  "/admin",
  verificarToken,
  verificarAdmin,
  (req, res) => {
    res.json({
      mensaje: "Acceso de administrador autorizado",
      usuario: req.usuario,
    });
  }
);
module.exports = router;