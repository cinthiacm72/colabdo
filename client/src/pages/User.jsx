import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import HeaderNav from "../components/HeaderNav";
import ButtonGoBack from "../components/ButtonGoBack";

const User = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="main-header">
      {/*  <ButtonGoBack /> */}
      <header className="margin-top-4 margin-bottom-8">
        <HeaderNav
          // setModalContent={setModalContent}
          //  setOpenModalDialog={setOpenModalDialog}
          user={user}
        />

        {/*       <img
          className="user-avatar-m margin-bottom-2"
          src={
            user.images.length > 0
              ? user.images[0]
              : "/assets/imgs/default-avatar.png"
          }
          alt={user.username}
        /> */}

        <h1 className="fs-x-large bold">{user.username}</h1>
        <p>Estudios</p>
      </header>

      <main>
        <ul className="card-list card-list-m">
          <li className="card-item animate-card">
            <main className="card-item-main ">
              <h2 className="fs-x-large bold">Laboratorio</h2>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel
                voluptatum libero cupiditate.
              </p>
            </main>
            <footer className="card-item-footer flex flex-jc-between flex-a-center text-accent">
              <div className="flex flex-jc-between flex-a-center">
                <div className="flex flex-gap-2 flex-a-center">
                  <button
                    className="button-solid-l button-solid-l-accent"
                    type="button"
                    /*   onClick={() => {
              setModalContent("update");
              setOpenModalDialog(true);
              setTaskIdToUpdate(item._id);
            }}  */
                  >
                    <span className="visually-hidden">Editar</span>
                    <img
                      style={{ width: "24px" }}
                      src="/assets/imgs/icon-edit.svg"
                      alt=""
                    />
                  </button>
                  <button
                    className="button-outline-l button-outline-l-danger"
                    type="button"
                    /*   onClick={() => {
                      handleDelete(item._id);
                    }} */
                  >
                    <span className="visually-hidden">Borrar</span>
                    <img
                      style={{ width: "24px" }}
                      src="/assets/imgs/icon-trash-can.svg"
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </footer>
          </li>
        </ul>
      </main>
    </section>
  );
};

export default User;
