import React, { useState } from "react";

const InputBox = ({
  name,
  type,
  id,
  value,
  placeholder,
  icon,
  onChange,
  disabled = false,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-[100%] mb-4">
      <input
        type={
          type === "password" ? (passwordVisible ? "text" : "password") : type
        }
        name={name}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        disabled={disabled}
        className="input-box"
        onChange={onChange}
      />
      <i className={`fi ${icon} input-icon`}></i>

      {type === "password" && (
        <i
          onClick={() => setPasswordVisible(!passwordVisible)}
          className={`fi fi-rr-eye${
            passwordVisible ? "" : "-crossed"
          } input-icon left-[auto] right-4 cursor-pointer`}
        ></i>
      )}
    </div>
  );
};

export default InputBox;
