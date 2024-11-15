"use client";

import DataProvider from "./store/DataProvider";
import TimeTableProvider from "./store/TimeTableProvider";
import Buttons from "./Buttons";
import ContextMenu from "./components/ContextMenu";
import CaseDetail from "./components/CaseDetail";
import ScheduleSection from "./ScheduleSection";

export default function Home() {
  // TODO:

  // useEffect(() => {
  // document.querySelector("div:has(h2)")!.addEventListener("mouseover", () => {
  //   document.getElementById("case-detail")!.style.display = "none";
  // });
  // }, []);

  return (
    <DataProvider>
      <TimeTableProvider>
        {/* 기본 컴포넌트 */}
        {/* <MainTitle>기일부</MainTitle> */}
        <Buttons />
        <ScheduleSection />
        {/* 유틸 컴포넌트 */}
        <ContextMenu />
        <CaseDetail />
      </TimeTableProvider>
    </DataProvider>
  );
}
