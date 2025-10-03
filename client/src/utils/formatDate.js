export function formatDate(isoString) {
  if (!isoString) return "";

  // Extraemos la fecha sin considerar la hora
  const [year, month, day] = isoString.split("T")[0].split("-");

  // Meses abreviados en español
  const monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const monthText = monthNames[Number(month) - 1]; // mes correcto

  return `${day} ${monthText} ${year}`;
}
