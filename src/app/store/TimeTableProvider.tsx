import useSchedule, { UseScheduleReturnType } from "@/lib/useSchedule";
import React, { createContext, useContext } from "react";

const TimeTableContext = createContext<UseScheduleReturnType>({
  undo: () => {},
  cellClickHandler: () => {},
  contextHandler: () => {},
  caseDetailHandler: () => {},
  mergeHandler: () => {},
  breakHandler: () => {},
  cancelHandler: () => {},
});

export default function TimeTableProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimeTableContext.Provider value={useSchedule()}>
      {children}
    </TimeTableContext.Provider>
  );
}

export function useTimeTableCtx() {
  return useContext(TimeTableContext);
}
