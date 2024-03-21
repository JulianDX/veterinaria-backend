import express from "express";
const router = express.Router();
import {
  registrar,
  perfil,
  confirmar,
  login,
  forgot,
  verificarToken,
  reestablecer,
  actualizarPerfil,
  cambiarPassword,
} from "../controllers/veterinarioController.js";
import verifyAuth from "../middleware/verifyAuth.js";

// Acceso público

router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", login);
router.post("/forgot", forgot); // Validar email usuario

// Esto es lo mismo de abajo pero con 2 líneas
/* router.get("/forgot/:token", verificarToken);
router.post("/forgot/:token", reestablecer); */

router.route("/forgot/:token").get(verificarToken).post(reestablecer);

// Acceso privado

router.get("/perfil", verifyAuth, perfil);
router.put("/perfil/:id", verifyAuth, actualizarPerfil);
router.put("/cambiar-password", verifyAuth, cambiarPassword);

export default router;
