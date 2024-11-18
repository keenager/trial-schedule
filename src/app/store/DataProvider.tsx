import React, { createContext, Dispatch, useContext, useReducer } from "react";
import {
  ActionType,
  dataReducer,
  initialValue,
  TableDataType,
} from "@/lib/dataReducer";

const DataContext = createContext<TableDataType>(Object.create({}));
const DataDispatchContext = createContext<Dispatch<ActionType>>(
  Object.create({})
);

export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, dispatch] = useReducer(dataReducer, initialValue);

  return (
    <DataContext.Provider value={data}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

export function useDataDispatch() {
  return useContext(DataDispatchContext);
}
