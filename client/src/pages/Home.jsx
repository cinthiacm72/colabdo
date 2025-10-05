import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import ModalDialog from "../components/ModalDialog";
import TaskCard from "../components/TaskCard";
import ModalContentCreate from "../components/ModalContentCreate";
import ModalContentUpdate from "../components/ModalContentUpdate";
import HeaderNav from "../components/HeaderNav";
import Greeting from "../components/Greeting.jsx";
import MainMenu from "../components/MainMenu.jsx";

const Home = () => {
  const INITIAL_TASK_TYPE = "totales";
  const { user } = useContext(AuthContext);

  // ✅ Función helper que siempre obtiene el token actualizado
  const getToken = () => localStorage.getItem("token");

  const [openModalDialog, setOpenModalDialog] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [taskIdToUpdate, setTaskIdToUpdate] = useState(undefined);

  const [data, setData] = useState([]);

  const [priorityCounts, setPriorityCounts] = useState({});
  const [overdueCount, setOverdueCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [taskTypeText, setTaskTypeText] = useState(INITIAL_TASK_TYPE);

  const fetchTasks = async ({ priority, overdue, today }) => {
    try {
      let url = new URL(import.meta.env.VITE_BACKEND_URL + "/tasks");

      if (priority) url.searchParams.append("priority", priority);
      if (overdue) url.searchParams.append("overdue", "true");
      if (today) url.searchParams.append("today", "true");

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      let json = await res.json();

      setData(json);
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchTasks({});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const countsByPriority = async () => {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/tasks/count/priority",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const json = await res.json();

      setPriorityCounts(json);
    };
    countsByPriority();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const countByOverdue = async () => {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/tasks/count/overdue",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const json = await res.json();
      setOverdueCount(json);
    };
    countByOverdue();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const countByDueToday = async () => {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/tasks/count/today",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const json = await res.json();
      setTodayCount(json);
    };
    countByDueToday();
  }, [user]);

  return (
    <>
      <header className="main-header">
        <HeaderNav
          setModalContent={setModalContent}
          setOpenModalDialog={setOpenModalDialog}
          user={user}
        />

        <Greeting user={user} taskTypeText={taskTypeText} data={data} />

        <MainMenu
          fetchTasks={fetchTasks}
          setTaskTypeText={setTaskTypeText}
          todayCount={todayCount}
          priorityCounts={priorityCounts}
          overdueCount={overdueCount}
          INITIAL_TASK_TYPE={INITIAL_TASK_TYPE}
        />
      </header>

      <main>
        {openModalDialog && (
          <ModalDialog
            isOpen={openModalDialog}
            onClose={() => {
              setOpenModalDialog(false);
              setModalContent(null);
            }}
          >
            {modalContent === "create" && (
              <ModalContentCreate
                setModalContent={setModalContent}
                data={data}
                setData={setData}
                taskIdToUpdate={taskIdToUpdate}
              />
            )}

            {modalContent === "update" && (
              <ModalContentUpdate
                setModalContent={setModalContent}
                data={data}
                setData={setData}
                taskIdToUpdate={taskIdToUpdate}
              />
            )}
          </ModalDialog>
        )}
        <ul className="task-list">
          {data.length != 0 ? (
            data.map((item) => (
              <TaskCard
                className="task-item"
                key={item._id}
                item={item}
                data={data}
                setData={setData}
                setOpenModalDialog={setOpenModalDialog}
                setTaskIdToUpdate={setTaskIdToUpdate}
                setModalContent={setModalContent}
                user={user}
                fetchTasks={fetchTasks}
                setTaskTypeText={setTaskTypeText}
              />
            ))
          ) : (
            <li className="task-item task-item-empty">
              <p className="fs-large bold padding-top-4 text-center padding-bottom-4 padding-inline-4">
                No tenes tareas.
              </p>
            </li>
          )}
        </ul>
      </main>
    </>
  );
};

export default Home;
