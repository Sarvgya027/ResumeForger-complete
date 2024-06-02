import React from "react";
import { CircleLoader, PuffLoader } from "react-spinners";

function MainSpinner() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <CircleLoader size={80} />
    </div>
  );
}

export default MainSpinner;
