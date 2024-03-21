import express from 'express';
import conectarDB from './config/db.js';
import dotenv from 'dotenv';
import routerVeterinario from './routes/veterinarioRoutes.js';
import routerPaciente from './routes/pacienteRoutes.js';
import cors from "cors";

const app = express();
// Body parser
app.use(express.json());
dotenv.config();
conectarDB();

const dominiosPermitidos = [process.env.URL_FRONTEND];

const corsOptions = {
    origin: (origin, callback) => {
        if (dominiosPermitidos.indexOf(origin)!== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}

app.use(cors( {origin: '*'}));

const port = process.env.PORT;

app.listen(port || 4000, () =>{
    console.log('Server running on port 4000');
})

app.use('/api/veterinarios', routerVeterinario);
app.use('/api/pacientes', routerPaciente);