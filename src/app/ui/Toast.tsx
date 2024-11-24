import React from "react";
import { useMsg } from "../store/ToastProvider";

export default function Toast() {
  const msg = useMsg();

  const handleClose = () => {
    document.getElementById("toast")!.style.display = "none";
  };

  return (
    <div
      id="toast"
      className="toast toast-center min-w-60 max-w-full w-fit hidden"
    >
      <div className="alert alert-warning shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <h3 className="font-bold">Error!</h3>
          <div className="text-xs">{msg.substring(0, 70) + " ..."}</div>
        </div>
        <button className="btn btn-square btn-xs ml-auto" onClick={handleClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
