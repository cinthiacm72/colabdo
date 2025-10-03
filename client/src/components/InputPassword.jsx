import { useState } from "react";

const InputPassword = ({ handleChange, credentials }) => {
  const [icon, setIcon] = useState("🔐");
  const [type, setType] = useState("password");

  const handleVisibility = () => {
    if (type === "password") {
      setIcon("🔓");
      setType("text");
    } else {
      setIcon("🔐");
      setType("password");
    }
  };
  return (
    <label htmlFor="password" className="flex flex-column">
      {/* Label a input no estan en la misma jerarquia - usar htmlFor */}
      Contraseña:
      <div className="flex flex-a-center flex-gap-2">
        <input
          type={type}
          id="password"
          required
          value={credentials.password}
          onChange={handleChange}
        />
        <span className="fs-x-large" onClick={handleVisibility}>
          {icon}
        </span>
      </div>
    </label>
  );
};

export default InputPassword;
