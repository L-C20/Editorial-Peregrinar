function verificarAdmin(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({
      error: "Usuario no autenticado",
    });
  }

  if (req.usuario.rol !== "admin") {
    return res.status(403).json({
      error: "Acceso restringido a administradores",
    });
  }

  next();
}

module.exports = verificarAdmin;