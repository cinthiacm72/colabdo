// Crea manualmente un error con un mensaje y un status (para lanzar con next()).
export function createError(status, message, details = []) {
  const err = new Error();

  err.status = status;
  err.message = message;
  err.details = details;

  return err;
}

// Middleware de manejo de errores centralizado
export function errorHandler(err, req, res, next) {
  console.error(err);

  // Manejo de errores de Mongoose
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Error de validación.",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: `ID no válido: ${err.value}`,
    });
  }

  // Otro tipo de error (genérico)
  const status = err.status || 500;
  const message = err.message || "Algo salió mal.";
  const details = err.details || [];
  return res.status(status).json({ message, details });
}
