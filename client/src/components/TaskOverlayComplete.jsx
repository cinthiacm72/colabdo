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
      <p className="text-center margin-bottom-4">{item.title}</p>
      <div className="flex flex-gap-2">
        <button
          className="button-solid-l button-solid-l-white flex flex-a-center flex-gap-1"
          type="button"
          onClick={() => {
            setModalContent("update");
            setOpenModalDialog(true);
            setTaskIdToUpdate(item._id);
          }}
        >
          <img
            style={{ width: "20px" }}
            src="/assets/imgs/icon-edit.svg"
            alt=""
          />
          Editar
        </button>
        <button
          className="button-solid-l button-solid-l-danger flex flex-a-center flex-gap-1"
          type="button"
          onClick={() => {
            handleDelete(item._id);
          }}
        >
          <img
            style={{ width: "20px", filter: "invert(1) brightness(100)" }}
            src="/assets/imgs/icon-trash-can.svg"
            alt=""
          />
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default TaskOverlayComplete;
