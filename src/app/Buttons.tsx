import React from "react";
import useExcel from "@/lib/useExcel";
import DateSelectModal from "./components/DateSelectModal";
import Toast from "./ui/Toast";

export default function Buttons() {
  const { errMsg, readExcelHandler } = useExcel();

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
