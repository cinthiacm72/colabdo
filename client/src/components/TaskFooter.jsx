const TaskFooter = ({
  finalSharedWith,
  setModalContent,
  setOpenModalDialog,
  setTaskIdToUpdate,
  item,
  handleDelete,
}) => {
  return (
    <footer className="task-item-footer flex flex-jc-between flex-a-center text-accent">
      <div className="footer-sharedwith">
        {finalSharedWith.length > 0 ? (
          <>
            <p className="margin-bottom-2 fs-x-tiny">Compartido con:</p>
            <ul className="footer-sharedwith-list reset-list">
              {finalSharedWith.map((user, index) => (
                <li
                  style={{
                    left: `${index * 46}px`,
                  }}
                  key={user._id || index}
                >
                  <img
                    className="user-avatar-s"
                    src={
                      user.images.length === 0
                        ? "/assets/imgs/default-avatar.png"
                        : user.images[0]
                    }
                    alt={user.name}
                    title={user.name}
                  />
                  <p className="fs-tiny">{user.name}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-jc-between flex-a-center">
        <div className="flex flex-gap-2 flex-a-center">
          <button
            className="button-solid-l button-solid-l-accent"
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
            className="button-outline-l button-outline-l-accent"
            type="button"
            onClick={() => {
              handleDelete(item._id);
            }}
          >
            Borrar
          </button>
        </div>
      </div>
    </footer>
  );
};
export default TaskFooter;
