const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ======================================================
// CARPETA DE DESTINO
// ======================================================

const carpetaUploads = path.join(
  __dirname,
  "../../uploads/productos"
);


// ======================================================
// CREAR CARPETA SI NO EXISTE
// ======================================================

if (!fs.existsSync(carpetaUploads)) {

  fs.mkdirSync(
    carpetaUploads,
    {
      recursive: true
    }
  );

}


// ======================================================
// CONFIGURACIÓN DEL STORAGE
// ======================================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      carpetaUploads
    );

  },


  filename: (req, file, cb) => {

    const extension =
      path.extname(file.originalname)
        .toLowerCase();


    const nombre =
      `${Date.now()}-${Math.round(
        Math.random() * 1E9
      )}${extension}`;


    cb(
      null,
      nombre
    );

  }

});


// ======================================================
// FILTRO DE IMÁGENES
// ======================================================

const fileFilter = (
  req,
  file,
  cb
) => {

  if (
    file.mimetype.startsWith("image/")
  ) {

    cb(
      null,
      true
    );

  } else {

    cb(
      new Error(
        "Solo se permiten archivos de imagen."
      )
    );

  }

};


// ======================================================
// MULTER
// ======================================================

const upload = multer({

  storage,

  fileFilter,

  limits: {

  files: 4,

  fileSize:
    5 * 1024 * 1024

}

});


module.exports = upload;