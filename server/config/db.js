import mongoose from "mongoose";

let isConnected; // Variable para almacenar el estado de la conexión

export async function connectDB() {
  if (isConnected) {
    console.log("Usando conexión existente a MongoDB");
    return mongoose.connection;
  }

  console.log("Estableciendo nueva conexión a MongoDB");

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {});

    isConnected = db.connections[0].readyState;
    console.log("Conectado a MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
    throw new Error("Error en la conexión a la base de datos");
  }
}
