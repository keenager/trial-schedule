"use client";

import DataProvider from "./store/DataProvider";
import CheckListProvider from "./store/CheckListProvider";
import Buttons from "./Buttons";
import ScheduleSection from "./ScheduleSection";

export default function Home() {
  // TODO: 병합 기능 일부 오류 개선하기

  // useEffect(() => {
  // document.querySelector("div:has(h2)")!.addEventListener("mouseover", () => {
  //   document.getElementById("case-detail")!.style.display = "none";
  // });
  // }, []);

  return (
    <DataProvider>
      <CheckListProvider>
        {/* 기본 컴포넌트 */}
        {/* <MainTitle>기일부</MainTitle> */}
        <Buttons />
        <ScheduleSection />
      </CheckListProvider>
    </DataProvider>
  );
}
