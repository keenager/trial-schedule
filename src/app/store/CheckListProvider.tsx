import React, { createContext, useContext, useReducer } from "react";

const CheckListContext = createContext<boolean[]>([]);
const CheckListDispatchContext = createContext<React.Dispatch<ActionType>>(
  () => {}
);

export function CheckListProvider({ children }: { children: React.ReactNode }) {
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

type ActionType = {
  type: "init" | "toggle" | "change";
  data?: boolean[];
  idx?: number;
  isChecked: boolean;
};

function checkListReducer(checkList: boolean[], action: ActionType) {
  switch (action.type) {
    case "init": {
      return action.data!;
    }
    case "toggle": {
      return [...checkList].fill(action.isChecked);
    }
    case "change": {
      if (action.idx == undefined) throw Error("idx is required to change");
      const newCheckList = [...checkList];
      newCheckList[action.idx] = action.isChecked;
      return newCheckList;
    }
    default: {
      throw Error(`Wrong action type: ${action.type}`);
    }
  }
}
