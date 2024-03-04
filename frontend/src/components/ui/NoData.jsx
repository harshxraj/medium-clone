import React from "react";

const NoDataMessage = ({ message }) => {
  return (
    <div className="text-center w-full p-4 rounded-full bg-grey/50 mt-4">
      {message}
    </div>
  );
};

export default NoDataMessage;
