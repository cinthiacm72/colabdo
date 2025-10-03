import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ButtonGoBack from "../components/ButtonGoBack";

const User = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="container-fluid-s">
      <ButtonGoBack />
      <header className="margin-top-4 margin-bottom-8">
        <img
          className="user-avatar-m margin-bottom-2"
          src={
            user.images.length > 0
              ? user.images[0]
              : "/assets/imgs/default-avatar.png"
          }
          alt={user.username}
        />

        <h1 className="fs-x-large bold">{user.username}</h1>
        <p>
          {user.name} {user.lastname}
        </p>
      </header>
    </section>
  );
};

export default User;
