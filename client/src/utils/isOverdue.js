export function isOverdue(dueDateStr) {
  if (!dueDateStr) return false;

  // Fecha de dueDate a medianoche local
  const dueDate = new Date(dueDateStr.split("T")[0]); // solo yyyy-mm-dd
  // Sumar un día para que venza recién al día siguiente
  dueDate.setDate(dueDate.getDate() + 1);
  // Fecha actual a medianoche local
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return dueDate.getTime() <= today.getTime();
}
