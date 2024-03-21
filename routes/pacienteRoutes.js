import express from "express";
import {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente
} from "../controllers/pacienteController.js";
import verifyAuth from "../middleware/verifyAuth.js";

const router = express.Router();

router
  .route("/")
  .get(verifyAuth, obtenerPacientes)
  .post(verifyAuth, agregarPaciente);

router
  .route("/:id")
  .get(verifyAuth, obtenerPaciente)
  .put(verifyAuth, actualizarPaciente)
  .delete(verifyAuth, eliminarPaciente);

export default router;
