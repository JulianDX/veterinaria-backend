const generarToken = () => {
    // Generar un token random
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return token;
}

export default generarToken;