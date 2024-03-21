import nodemailer from "nodemailer";

const enviarEmailForgot = async (veterinario) => {
  const { nombre, email, token } = veterinario;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Enviar el email
  await transport.sendMail({
    from: '"APV - Veterinaria" <apv@veterinaria.com>',
    to: email,
    subject: "Reestablecimiento de contraseña",
    text: `Hola ${nombre}, solicitaste un cambio de contraseña. Para cambiar tu contraseña, haz click en el siguiente enlace: ${process.env.URL_FRONTEND}/api/veterinarios/reestablecer-password/${token}`,
    html: `<p>Hola ${nombre}</p> 
    <p>Solicitaste un cambio de contraseña. Para cambiar tu contraseña, haz click en el siguiente enlace: <a href="${process.env.URL_FRONTEND}/reestablecer-password/${token}">Actualizar contraseña</a></p>`,
  });
};

export default enviarEmailForgot;
