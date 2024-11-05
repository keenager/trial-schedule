"use client";

import CaseScheduleProvider from "./provider";
import MainTitle from "@/app/ui/main-title";
import ScheduleTable from "./ScheduleTable";
import Buttons from "./Buttons";
import { useEffect } from "react";

export default function Home() {
  //TODO:
  // 날짜 선택 기능, 모든 날짜 보여주는 기능
  // 엑셀 파일 불러올때 두개 컬럼 걸쳐 있는 경우도 제대로 처리되는지 확인.
  // 디자인 개선
  useEffect(() => {
    document.querySelector("div:has(h2)")!.addEventListener("mouseover", () => {
      document.getElementById("case-detail")!.style.display = "none";
    });
  }, []);

  return (
    <CaseScheduleProvider>
      <MainTitle>기일부</MainTitle>
      <Buttons />
      <ScheduleTable />
    </CaseScheduleProvider>
  );
}
