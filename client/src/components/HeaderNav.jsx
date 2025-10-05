import { formatDate } from "../utils/formatDate.js";
import ButtonLogout from "./ButtonLogout.jsx";

const HeaderNav = ({ setModalContent, setOpenModalDialog, user }) => {
  return (
    <div className="header-nav flex flex-jc-between flex-a-center">
      <div className="bold">{formatDate(new Date().toISOString())}</div>
      <nav className="flex flex-jc-center flex-a-center flex-gap-2">
        <button
          className="button-solid-l button-solid-l-white"
          type="button"
          onClick={() => {
            setModalContent("create");
            setOpenModalDialog(true);
          }}
        >
          Crear tarea
        </button>
        <ButtonLogout />
      </nav>
    </div>
  );
};
export default HeaderNav;
