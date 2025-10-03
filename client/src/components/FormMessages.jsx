const FormMessages = ({ message }) => {
  if (!message) return null;

  const messageObj =
    typeof message === "string"
      ? { status: "info", message, details: [] }
      : {
          status: message.status || "info",
          message: message.message || "",
          details: Array.isArray(message.details) ? message.details : [],
        };

  // Define clases de color según status
  let bgClass = "bg-accent"; // por defecto azul
  if (messageObj.status === "success") bgClass = "bg-success";
  else if (messageObj.status === "error") bgClass = "bg-danger";
  else if (messageObj.status === "warning") bgClass = "bg-warning";

  return (
    <>
      <p className={`${bgClass} padding-inline-5`}>
        {messageObj.status ? `${messageObj.status.toUpperCase()}: ` : ""}
        {messageObj.message}
      </p>
      {messageObj.details.length > 0 && (
        <ul className="reset-list fs-small">
          {messageObj.details.map((detail, index) => (
            <li key={index}>{detail.message}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default FormMessages;
