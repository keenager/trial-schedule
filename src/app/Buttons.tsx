import React from "react";
import useButtons from "@/lib/useButtons";
import Toast from "./ui/Toast";
import DateSelectModal from "./components/DateSelectModal";

export default function Buttons() {
  // const { dateList } = useDataCtx();
  const { errMsg, readExcelHandler } = useButtons();

  return (
    <section
      className="no-print flex justify-end items-center gap-3"
      onMouseOver={() => {
        document.getElementById("case-detail")!.style.display = "none";
      }}
    >
      <button className="btn btn-sm btn-accent" onClick={readExcelHandler}>
        엑셀 파일 불러오기
      </button>

      <button
        className="btn btn-sm btn-accent"
        onClick={() => {
          const modal: any = document.getElementById("date_select_modal")!;
          modal.showModal();
        }}
      >
        날짜 선택
      </button>
      <DateSelectModal />
      <button className="btn btn-sm btn-accent" onClick={() => window.print()}>
        출력
      </button>
      <Toast>{errMsg}</Toast>
    </section>
  );
}
