const MainMenu = ({
  fetchTasks,
  setTaskTypeText,
  todayCount,
  priorityCounts,
  overdueCount,
  INITIAL_TASK_TYPE,
}) => {
  return (
    <div className="main-menu-list-wraper">
      <ul className="main-menu-list">
        <li
          className="button-outline-m button-outline-m-accent"
          onClick={() => {
            fetchTasks({});
            setTaskTypeText(INITIAL_TASK_TYPE);
          }}
        >
          Todos
        </li>
        <li
          className="button-outline-m button-outline-m-accent"
          onClick={() => {
            fetchTasks({ today: true });
            setTaskTypeText("vencen hoy");
          }}
        >
          Vencen Hoy <span>{todayCount || 0}</span>
        </li>
        <li
          className="button-outline-m button-outline-m-danger"
          onClick={() => {
            fetchTasks({ priority: "urgente" });
            setTaskTypeText("urgentes");
          }}
        >
          Urgentes <span>{priorityCounts.urgente || 0}</span>
        </li>
        <li
          className="button-outline-m button-outline-m-warning"
          onClick={() => {
            fetchTasks({ priority: "importante" });
            setTaskTypeText("importantes");
          }}
        >
          Importantes <span>{priorityCounts.importante || 0}</span>
        </li>
        <li
          className="button-outline-m button-outline-m-success"
          onClick={() => {
            fetchTasks({ priority: "postergable" });
            setTaskTypeText("postergable");
          }}
        >
          Postergables <span>{priorityCounts.postergable || 0}</span>
        </li>
        <li
          className="button-outline-m button-outline-m-accent"
          onClick={() => {
            fetchTasks({ overdue: true });
            setTaskTypeText("vencidas");
          }}
        >
          Vencidas <span>{overdueCount || 0}</span>
        </li>
      </ul>
    </div>
  );
};

export default MainMenu;
