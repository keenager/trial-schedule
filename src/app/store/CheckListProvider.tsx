import React, { createContext, useContext, useReducer } from "react";
import checkListReducer, {
  CheckListActionType,
} from "@/lib/reducers/checkListReducer";

const CheckListContext = createContext<boolean[]>([]);
const CheckListDispatchContext = createContext<
  React.Dispatch<CheckListActionType>
>(() => {});

export default function CheckListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checkList, dispatch] = useReducer(checkListReducer, []);
  return (
    <CheckListContext.Provider value={checkList}>
      <CheckListDispatchContext.Provider value={dispatch}>
        {children}
      </CheckListDispatchContext.Provider>
    </CheckListContext.Provider>
  );
}

export function useCheckList() {
  return useContext(CheckListContext);
}

export function useCheckListDispatch() {
  return useContext(CheckListDispatchContext);
}
