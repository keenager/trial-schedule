import useSchedule, { UseScheduleReturnType } from "@/lib/useSchedule";
import React, { createContext, useContext } from "react";

const ScheduleContext = createContext<UseScheduleReturnType>({
  tcList: [],
  setTcList: () => {},
  caseList: [],
  setCaseList: () => {},
  targetCases: [],
  setTargetCases: () => {},
  undo: () => {},
  cellClickHandler: () => {},
  contextHandler: () => {},
  caseDetailHandler: () => {},
  mergeHandler: () => {},
  breakHandler: () => {},
  cancelHandler: () => {},
});

export default function CaseScheduleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScheduleContext.Provider value={useSchedule()}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useScheduleCtx() {
  return useContext(ScheduleContext);
}
