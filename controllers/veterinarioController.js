import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarToken from "../helpers/generarToken.js";
import enviarEmailRegistro from "../helpers/emailRegistro.js";
import enviarEmailForgot from "../helpers/emailForget.js";

const registrar = async (req, res) => {
  const { email } = req.body;

  const usuarioEncontrado = await Veterinario.findOne({ email });

  if (usuarioEncontrado) {
    const error = new Error("El email se encuentra en uso");
    // Error 400
    return res.status(400).json({ msg: error.message });
  }

  try {
    // Guardar un nuevo veterinario
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();

    // Enviar el email de confirmación

    res.json(
      "Usuario creado con éxito, se ha enviado un email de confirmación"
    );

    enviarEmailRegistro(veterinarioGuardado);
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  const { veterinario } = req;
  res.json({ veterinario });
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const veterinarioEncontrado = await Veterinario.findOne({ token });

  if (veterinarioEncontrado) {
    try {
      veterinarioEncontrado.token = null;
      veterinarioEncontrado.confirmado = true;
      await veterinarioEncontrado.save();
      res.json({ msg: "Usuario confirmado" });
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(400).json({ msg: "Token no válido" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const usuarioEncontrado = await Veterinario.findOne({ email });

  // Comprobar si el usuario existe
  if (usuarioEncontrado) {
    // Verificar el password
    const passwordCorrecto = await usuarioEncontrado.verificarPassword(
      password
    );

    if (passwordCorrecto) {
      if (usuarioEncontrado.confirmado) {
        res.json({
          _id: usuarioEncontrado._id,
          nombre: usuarioEncontrado.nombre,
          email: usuarioEncontrado.email,
          token: generarJWT(usuarioEncontrado.id),
        });
      } else {
        res.status(401).json({ msg: "Tu cuenta no ha sido confirmada" });
      }
    } else {
      res.status(401).json({ msg: "Password incorrecto" });
    }
  } else {
    res.status(401).json({ msg: "El usuario no existe" });
  }
};

const forgot = async (req, res) => {
  const { email } = req.body;

  const veterinarioEncontrado = await Veterinario.findOne({ email });

  if (!veterinarioEncontrado || veterinarioEncontrado.token) {
    return res.status(401).json({
      msg: "El usuario no existe o ya se envió un correo para reestablecer la contraseña",
    });
  }

  veterinarioEncontrado.token = generarToken();
  try {
    await veterinarioEncontrado.save();
    enviarEmailForgot(veterinarioEncontrado);
    res.json({
      msg: "Se ha enviado un correo para el reestablecimiento de la contraseña",
    });
  } catch (error) {
    console.log(error);
  }
};

const verificarToken = async (req, res) => {
  const { token } = req.params;

  const veterinarioEncontrado = await Veterinario.findOne({ token });

  if (!veterinarioEncontrado) {
    return res.status(401).json({
      msg: "Token no válido",
    });
  }

  res.json({
    msg: "Token válido",
  });
};

const reestablecer = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinarioEncontrado = await Veterinario.findOne({ token });

  console.log(password);
  console.log(token);

  if (!veterinarioEncontrado || !veterinarioEncontrado.confirmado) {
    return res.status(401).json({
      msg: "Token no válido o no se ha confirmado la cuenta",
    });
  }

  try {
    veterinarioEncontrado.token = null;
    veterinarioEncontrado.password = password;
    await veterinarioEncontrado.save();
    res.json({
      msg: "Contraseña reestablecida",
    });
  } catch (error) {
    console.log(error);
  }
};

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id);
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  // Si el usuario intenta actualizar el email
  if (veterinario.email != req.body.email) {
    const buscarEmail = await Veterinario.findOne({ email: req.body.email });

    if (buscarEmail)
      return res
        .status(400)
        .json({ msg: "El correo introducido se encuentra en uso" });
  }

  try {
    veterinario.nombre = req.body.nombre;
    veterinario.email = req.body.email;
    veterinario.web = req.body.web;
    veterinario.telefono = req.body.telefono;

    const veterinarioActualizado = await veterinario.save();
    res.json(veterinarioActualizado);
  } catch (error) {
    console.log(error);
  }
};

const cambiarPassword = async (req, res) => {
  const veterinario = await Veterinario.findById(req.veterinario._id);

  if (!veterinario) {
    return res.status(400).json({ msg: "No se encontró el veterinario" });
  }

  if (req.body.password === req.body.newPassword) {
    return res
      .status(400)
      .json({ msg: "La nueva contraseña no puede ser igual a la nueva" });
  }

  const passwordCorrecto = await veterinario.verificarPassword(
    req.body.password
  );

  if (!passwordCorrecto) {
    return res.status(400).json({ msg: "La contraseña actual es incorrecta" });
  }

  try {
    veterinario.password = req.body.newPassword;
    await veterinario.save();
    res.json("Contraseña cambiada");
  } catch (error) {
    return res.status(400).json({ msg: "Hubo un error" });
  }
};

export {
  registrar,
  perfil,
  confirmar,
  login,
  forgot,
  verificarToken,
  reestablecer,
  actualizarPerfil,
  cambiarPassword,
};
