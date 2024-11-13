"use client";

import DataProvider from "./store/DataProvider";
import TimeTableProvider from "./store/TimeTableProvider";
import Buttons from "./Buttons";
import ContextMenu from "./ContextMenu";
import CaseDetail from "./CaseDetail";
import ScheduleSection from "./ScheduleSection";

export default function Home() {
  // TODO:
  // 사건정보 박스 디자인 개선 / 마우스 포인터 오른쪽일 때 왼쪽에 나타나게
  // 아이콘

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
