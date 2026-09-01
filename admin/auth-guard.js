// =====================================================
// EDITORIAL PEREGRINAR
// PROTECCIÓN DE PÁGINAS DE ADMINISTRACIÓN
// =====================================================

(function verificarSesionAdmin() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        window.location.href =
            "/login.html";

    }

})();