import { useContext, useState } from "react";
import { isOverdue } from "../utils/isOverdue";
import TaskFooter from "./TaskFooter";
import TaskHeader from "./TaskHeader";
import TaskMain from "./TaskMain";
import TaskOverlayComplete from "./TaskOverlayComplete";
import TaskOverlayOverdue from "./TaskOverlayOverdue";
import TaskOverlayStatus from "./TaskOverlayStatus";
import { TaskContext } from "../context/TaskContext";
import FormMessages from "./FormMessages";

const TaskCard = ({
  item,
  setData,
  setTaskIdToUpdate,
  fetchTasks,
  setTaskTypeText,
  user,
  setOpenModalDialog,
  setModalContent,
  setConfirmAction,
}) => {
  const { loading, error, dispatch } = useContext(TaskContext);

  const [message, setMessage] = useState(null);

  const token = localStorage.getItem("token");

  const filteredSharedWith = item.sharedWith.filter(
    (sharedUser) => sharedUser._id !== user._id
  );

  let finalSharedWith = [...filteredSharedWith];

  const isCreatorDifferent = item.user._id !== user._id;

  const isTaskSharedWithCurrentUser = item.sharedWith.some(
    (sharedUser) => sharedUser._id === user._id
  );

  if (isCreatorDifferent && isTaskSharedWithCurrentUser) {
    finalSharedWith = [item.user, ...filteredSharedWith];
  }

  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + `/task/delete/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // const data = await res.json(); // REVISAR SI ES NECESARIO LEER DATA OTRA VEZ

        throw {
          status: "error",
          message: "Error al eliminar la tarea.",
          details: data.details || [],
        };
      }

      if (item.images.length > 0) {
        let urlFiles = item.images;

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ files: urlFiles }),
        });
      }

      setMessage({
        status: "success", // string fijo, no el 400
        message: data.message,
        details: data.details || [],
      });

      dispatch({ type: "REQUEST_SUCCESS", payload: data.message });

      setTimeout(() => {
        setData((prevData) => prevData.filter((task) => task._id !== taskId));
      }, 3500);
    } catch (err) {
      setMessage(err);
      dispatch({
        type: "REQUEST_FAILURE",
        payload: {
          err,
        },
      });
    } finally {
      dispatch({ type: "RESET_FORM" });
    }
  };

  return (
    <li className="card-item animate-card">
      {item.completed ? (
        <TaskOverlayComplete
          setModalContent={setModalContent}
          setOpenModalDialog={setOpenModalDialog}
          setTaskIdToUpdate={setTaskIdToUpdate}
          handleDelete={handleDelete}
          setConfirmAction={setConfirmAction}
          item={item}
        />
      ) : (
        ""
      )}

      {item.status === "inactiva" ? (
        <TaskOverlayStatus
          setModalContent={setModalContent}
          setOpenModalDialog={setOpenModalDialog}
          setTaskIdToUpdate={setTaskIdToUpdate}
          handleDelete={handleDelete}
          setConfirmAction={setConfirmAction}
          item={item}
        />
      ) : (
        ""
      )}

      {isOverdue(item.dueDate) && (
        <TaskOverlayOverdue
          setModalContent={setModalContent}
          setOpenModalDialog={setOpenModalDialog}
          setTaskIdToUpdate={setTaskIdToUpdate}
          handleDelete={handleDelete}
          setConfirmAction={setConfirmAction}
          item={item}
        />
      )}
      <article
        className={`
        ${item.status === "inactiva" ? "filter-dark opacity-2" : ""}
        ${item.completed ? "filter-success opacity-2" : ""}        
        ${
          isOverdue(item.dueDate) === true ? "filter-danger opacity-2" : ""
        }        
        `}
      >
        <TaskHeader
          fetchTasks={fetchTasks}
          setTaskTypeText={setTaskTypeText}
          item={item}
        />

        <TaskMain item={item} />

        <TaskFooter
          finalSharedWith={finalSharedWith}
          item={item}
          setModalContent={setModalContent}
          setOpenModalDialog={setOpenModalDialog}
          setTaskIdToUpdate={setTaskIdToUpdate}
          setConfirmAction={setConfirmAction}
          handleDelete={handleDelete}
        />

        <FormMessages message={message} />
      </article>
    </li>
  );
};

export default TaskCard;
