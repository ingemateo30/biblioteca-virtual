const bcrypt = require("bcryptjs");

const password = "123"; // Reemplaza con la contraseña que quieres usar
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error al encriptar la contraseña:", err);
  } else {
    console.log("Contraseña encriptada:", hash);
  }
});
