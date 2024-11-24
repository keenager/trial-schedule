"use client";

import DataProvider from "./store/DataProvider";
import CheckListProvider from "./store/CheckListProvider";
import Buttons from "./Buttons";
import ScheduleSection from "./ScheduleSection";
import Toast from "./ui/Toast";
import ToastProvider from "./store/ToastProvider";

export default function Home() {
  // TODO: 사용자 추가 정보 기능 -> 프린트할 때 화면 하단에 나오게...
  // 사건번호 선택 기능

  // useEffect(() => {
  // document.querySelector("div:has(h2)")!.addEventListener("mouseover", () => {
  //   document.getElementById("case-detail")!.style.display = "none";
  // });
  // }, []);

  return (
    <DataProvider>
      <CheckListProvider>
        <ToastProvider>
          {/* 기본 컴포넌트 */}
          {/* <MainTitle>기일부</MainTitle> */}
          <Buttons />
          <ScheduleSection />
          <Toast />
        </ToastProvider>
      </CheckListProvider>
    </DataProvider>
  );
}
