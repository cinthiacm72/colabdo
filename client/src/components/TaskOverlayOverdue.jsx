import { formatDate } from "../utils/formatDate";
const TaskOverlayOverdue = ({
  setModalContent,
  setOpenModalDialog,
  setTaskIdToUpdate,
  handleDelete,
  setConfirmAction,
  item,
}) => {
  return (
    <div className="card-item-overlay card-item-overlay-danger">
      <p style={{ fontSize: "40px" }}>😱</p>
      <p className="fs-large bold margin-bottom-4 text-center">
        ¡Tarea Vencida el
        <br />
        {formatDate(item.dueDate)}!
      </p>
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
            setConfirmAction(() => () => {
              handleDelete(item._id);
            });
            setModalContent("confirm-delete");
            setOpenModalDialog(true);
          }}
        >
          <img
            style={{ width: "20px", filter: "invert(1) brightness(100)" }}
            src="/assets/imgs/icon-trash-can.svg"
            alt=""
          />
          Borrar
        </button>
      </div>
    </div>
  );
};

export default TaskOverlayOverdue;
