import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

const MessageContext = createContext("");
const MessageSetContext = createContext<Dispatch<SetStateAction<string>>>(
  () => {}
);

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [msg, setMsg] = useState("");
  return (
    <MessageContext.Provider value={msg}>
      <MessageSetContext.Provider value={setMsg}>
        {children}
      </MessageSetContext.Provider>
    </MessageContext.Provider>
  );
}

export function useMsg() {
  return useContext(MessageContext);
}

export function useSetMsg() {
  return useContext(MessageSetContext);
}

export function showToast() {
  document.getElementById("toast")!.style.display = "flex";
}

export function closeToast() {
  document.getElementById("toast")!.style.display = "none";
}

export function closeToastInSec(sec: number) {
  setTimeout(() => {
    document.getElementById("toast")!.style.display = "none";
  }, sec * 1000);
}
