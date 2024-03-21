import { mongoose } from "mongoose";

const conectarDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    const url = `${db.connection.host}:${db.connection.port}`;
    console.log(`Conectado a ${url}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default conectarDB;
