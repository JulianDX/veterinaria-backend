import nodemailer from "nodemailer";

const enviarEmailRegistro = async (veterinario) => {
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
    subject: "Confirmación de registro",
    text: `Hola ${nombre}, gracias por registrarte en el sistema de veterinaria. Para confirmar tu cuenta, haz click en el siguiente enlace: ${process.env.URL_FRONTEND}/api/veterinarios/confirmar/${token}`,
    html: `<p>Hola ${nombre}</p> 
    <p>Gracias por registrarte en el sistema de veterinaria. Para confirmar tu cuenta, haz click en el siguiente enlace: <a href="${process.env.URL_FRONTEND}/confirmar/${token}">Confirmar mi cuenta</a></p>`,
  });
};

export default enviarEmailRegistro;
