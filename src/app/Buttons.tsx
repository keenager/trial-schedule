import React from "react";
import useExcel from "@/lib/useExcel";
import DateSelectModal from "./components/DateSelectModal";
import { hideDetailDiv } from "@/lib/cell";

export default function Buttons() {
  const { readExcelHandler } = useExcel();

  return (
    <section
      className="no-print flex justify-between"
      onMouseOver={hideDetailDiv}
    >
      <div className="flex justify-start items-center gap-3">
        <button className="btn btn-sm">사건번호</button>
        {/* <button className="btn btn-sm">사용자 추가 정보</button> */}
      </div>
      <div className="flex justify-end items-center gap-3">
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
        <button
          className="btn btn-sm btn-accent"
          onClick={() => window.print()}
        >
          출력
        </button>
      </div>
    </section>
  );
}
