export function sanitizeFileName(filename) {
  return filename
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/[^a-zA-Z0-9._-]/g, "_") // solo caracteres seguros
    .toLowerCase();
}
