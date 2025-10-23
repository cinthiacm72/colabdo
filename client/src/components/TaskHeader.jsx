import { formatDate } from "../utils/formatDate";

const parseLocalDate = (yyyyMmDd) => {
  if (!yyyyMmDd) return null;
  const parts = yyyyMmDd.split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // meses 0-11
  const day = parseInt(parts[2], 10);
  const d = new Date(year, month, day);
  d.setHours(0, 0, 0, 0);
  return d;
};

const TaskHeader = ({ fetchTasks, setTaskTypeText, item }) => {
  const dueDate = parseLocalDate(item.dueDate); // safe local date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // comparaciones basadas en valor (milisegundos)
  const isToday = dueDate && dueDate.getTime() === today.getTime();
  const isPast = dueDate && dueDate.getTime() < today.getTime();
  const isFuture = dueDate && dueDate.getTime() > today.getTime();

  return (
    <header
      className={`${
        isToday
          ? "task-item-header task-item-header-danger"
          : "task-item-header"
      }`}
    >
      <p className="fs-large ">
        {isToday ? "Vence hoy" : formatDate(item.dueDate)}
      </p>

      <button
        className={`button-solid-s ${
          item.priority === "urgente"
            ? "button-solid-s-danger"
            : item.priority === "importante"
            ? "button-solid-s-warning"
            : "button-solid-s-success"
        }`}
        onClick={() => {
          fetchTasks({ priority: item.priority });
          setTaskTypeText(item.priority);
        }}
      >
        {item.priority}
      </button>
    </header>
  );
};
export default TaskHeader;
