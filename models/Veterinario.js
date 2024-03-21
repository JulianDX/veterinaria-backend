import { mongoose } from "mongoose";
import generarToken from "../helpers/generarToken.js";
import bcrypt from "bcrypt";

const veterinarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  telefono: {
    type: String,
    default: null,
  },
  web: {
    type: String,
    default: null,
    trim: true,
  },
  token: {
    type: String,
    default: generarToken(),
  },
  confirmado: {
    type: Boolean,
    default: false,
  },
});

// No se puede usar arrow function porque arrow function apunta a la ventana global
veterinarioSchema.pre("save", async function (next) {
  // Si un password ya está hasheado, no lo vuelva a hashear
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

veterinarioSchema.methods.verificarPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Veterinario = mongoose.model("Veterinario", veterinarioSchema);
export default Veterinario;
