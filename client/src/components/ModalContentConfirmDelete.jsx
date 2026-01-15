const ModalContentConfirmDelete = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-confirm">
      <h2 className="fs-x-large bold text-white">¿Borrar tarea?</h2>
      <p className="text-white margin-bottom-8">
        Esta acción no se puede deshacer.
      </p>

      <div className="flex flex-gap-2">
        <button className="button-outline-l" type="button" onClick={onCancel}>
          Cancelar
        </button>

        <button
          className="button-solid-l button-solid-l-danger"
          type="button"
          onClick={onConfirm}
        >
          Borrar
        </button>
      </div>
    </div>
  );
};

export default ModalContentConfirmDelete;
