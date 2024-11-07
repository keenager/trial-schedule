"use client";

import { useEffect } from "react";
import DataProvider from "./store/DataProvider";
import TimeTableProvider from "./store/TimeTableProvider";
import Buttons from "./Buttons";
import ScheduleTable from "./ScheduleTable";
import ContextMenu from "./ContextMenu";
import CaseDetail from "./CaseDetail";

export default function Home() {
  // TODO:
  // 하루, 이틀, 전체 보기 옵션
  // 사건정보 박스 디자인 개선 / 마우스 포인터 오른쪽일 때 왼쪽에 나타나게
  // 아이콘
  useEffect(() => {
    // document.querySelector("div:has(h2)")!.addEventListener("mouseover", () => {
    //   document.getElementById("case-detail")!.style.display = "none";
    // });
  }, []);

  return (
    <DataProvider>
      <TimeTableProvider>
        {/* 기본 컴포넌트 */}
        {/* <MainTitle>기일부</MainTitle> */}
        <Buttons />
        <ScheduleTable />
        {/* 유틸 컴포넌트 */}
        <ContextMenu />
        <CaseDetail />
      </TimeTableProvider>
    </DataProvider>
  );
}
