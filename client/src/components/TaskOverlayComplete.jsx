const TaskOverlayComplete = ({
  setModalContent,
  setOpenModalDialog,
  setTaskIdToUpdate,
  handleDelete,
  item,
}) => {
  return (
    <div className="task-item-overlay task-item-overlay-success">
      <p style={{ fontSize: "40px" }}>🥳</p>
      <p className="fs-large bold margin-bottom-4">¡Tarea Completa!</p>
      <div className="flex flex-gap-2">
        <button
          className="button-solid-l button-solid-l-white"
          type="button"
          onClick={() => {
            setModalContent("update");
            setOpenModalDialog(true);
            setTaskIdToUpdate(item._id);
          }}
        >
          Editar
        </button>
        <button
          className="button-solid-l button-solid-l-danger"
          type="button"
          onClick={() => {
            handleDelete(item._id);
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default TaskOverlayComplete;
