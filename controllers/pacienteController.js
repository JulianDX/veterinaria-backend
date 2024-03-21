import Paciente from "../models/Paciente.js";

const obtenerPacientes = async (req, res) => {
  const { veterinario } = req;
  const pacientes = await Paciente.find().where({
    veterinario: veterinario._id,
  });
  res.json(pacientes);
};

const obtenerPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await Paciente.findById(id);
    if (
      !(paciente.veterinario._id.toString() === req.veterinario._id.toString())
    ) {
      return res.status(401).json({
        msg: "No tienes permisos para acceder a este paciente",
      });
    }
    console.log(paciente);
    res.json({ msg: "Paciente encontrado" });
  } catch (error) {
    error = new Error("No se encontró el paciente");
    res.json({ msg: error.message });
  }
};

const actualizarPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await Paciente.findById(id);
    if (
      !(paciente.veterinario._id.toString() === req.veterinario._id.toString())
    ) {
      return res.status(401).json({
        msg: "No tienes permisos para acceder a este paciente",
      });
    }
    const { nombre, propietario, email, fecha_alta, sintomas } = req.body;
    paciente.nombre = nombre || paciente.nombre;
    paciente.propietario = propietario || paciente.propietario;
    paciente.email = email || paciente.email;
    paciente.fecha_alta = fecha_alta || paciente.fecha_alta;
    paciente.sintomas = sintomas || paciente.sintomas;
    paciente.save();
    res.json(paciente);
  } catch (error) {
    error = new Error("No se encontró el paciente");
    res.json({ msg: error.message });
  }
};

const eliminarPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await Paciente.findById(id);
    if (
      !(paciente.veterinario._id.toString() === req.veterinario._id.toString())
    ) {
      return res.status(401).json({
        msg: "No tienes permisos para acceder a este paciente",
      });
    }
    await paciente.deleteOne();
    res.json({ msg: "Paciente eliminado" });
  } catch (error) {
    console.log(error);
  }
};

const agregarPaciente = async (req, res) => {
  const { veterinario } = req;
  const paciente = new Paciente(req.body);
  paciente.veterinario = veterinario._id;
  try {
    await paciente.save();
    res.json(paciente);
  } catch (error) {
    console.log(error);
  }
};

export {
  obtenerPacientes,
  agregarPaciente,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
