import { Link } from "react-router-dom";

const ButtonGoBack = () => {
  return (
    <div className="flex flex-jc-end">
      <Link
        className=" button-outline-s button-outline-s-white margin-bottom-2"
        to="/"
      >
        ❮ Volver
      </Link>
    </div>
  );
};

export default ButtonGoBack;
