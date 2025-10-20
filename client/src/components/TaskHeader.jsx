import { formatDate } from "../utils/formatDate";

const TaskHeader = ({ fetchTasks, setTaskTypeText, item }) => {
  return (
    <header className="task-item-header">
      <p className="fs-large ">{formatDate(item.dueDate)}</p>

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
