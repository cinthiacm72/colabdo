import { Link } from "react-router-dom";

const Greeting = ({ user, taskTypeText, data }) => {
  return (
    <div className="margin-bottom-3">
      <h1 className="margin-bottom-1 text-white fs-x-huge bold">
        ¡Hola, {user.username}! 👋
      </h1>
      <Link to="/user">
        <div className="flex flex-a-center flex-gap-2 margin-bottom-6">
          <img
            className="user-avatar-s"
            src={
              user.images.length > 0
                ? user.images[0]
                : "/assets/imgs/default-avatar.png"
            }
            alt={user.username}
          />
          <p className="fs-tiny">
            {user.name} {user.lastname}
          </p>
        </div>
      </Link>
      <p className="fs-normal">
        Tenes <span className="bold">{data.length}</span> tareas {taskTypeText}.
      </p>
    </div>
  );
};

export default Greeting;
