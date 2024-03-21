import { mongoose } from "mongoose";
import Veterinario from "./Veterinario.js";

const pacienteSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    propietario: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    fecha_alta: {
      type: Date,
      required: true,
    },
    sintomas: {
      type: String,
      required: true,
      trim: true,
    },
    veterinario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Veterinario, // Almacenar referencia del Id del veterinario
    },
  },
  {
    timestamps: true,
  }
);

const Paciente = mongoose.model("Paciente", pacienteSchema);
export default Paciente;
