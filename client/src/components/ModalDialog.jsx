import { useRef, useEffect, useState } from "react";
import React from "react";

const ModalDialog = ({ children, isOpen, onClose }) => {
  const dialogRef = useRef(null);

  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen && dialog) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog && dialog.open) {
      setClosing(true);
      setTimeout(() => {
        dialog.close();
        setClosing(false);
      }, 400); // mismo tiempo que la animación
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <dialog
        ref={dialogRef}
        className={`margin-top-4 modal ${closing ? "fade-out" : "fade-in"}`}
      >
        <form method="dialog" className="text-right">
          <button
            className="button-solid-m button-solid-m-white"
            type="button"
            onClick={handleClose}
          >
            <span className="visually-hidden">Cerrar</span> &#x2715;
          </button>
        </form>

        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                onClose: handleClose,
                setClosing: setClosing,
              })
            : child
        )}
      </dialog>
    </>
  );
};

export default ModalDialog;
