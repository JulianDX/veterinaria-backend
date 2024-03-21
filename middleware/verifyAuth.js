import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const verifyAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token && token.startsWith("Bearer ")) {
    try {
      const decoded = token.split(" ")[1];
      const resultado = jwt.verify(decoded, process.env.JWT_SECRET);
      req.veterinario = await Veterinario.findById(resultado.id).select(
        "-password -token -confirmado"
      );
    } catch (error) {
      res.json({ msg: error });
    }
    next();
  } else {
    const error = new Error("No se encontró el token");
    res.json({ msg: error.message });
  }
};

export default verifyAuth;
