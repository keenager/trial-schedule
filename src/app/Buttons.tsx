import React from "react";
import useButtons from "@/lib/useButtons";
import Toast from "./Toast";
import DateSelectModal from "./DateSelectModal";

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

      {/* <select
        className="select select-sm select-bordered select-accent max-w-xs"
        defaultValue="날짜 선택"
        onChange={dateChangeHandler}
      >
        <option disabled>날짜 선택</option>
        {dateList.map((date) => (
          <option key={date}>{date}</option>
        ))}
      </select> */}

      {/* <select
        className="select select-sm select-bordered select-accent max-w-xs"
        defaultValue="날짜 갯수"
        onChange={() => {}}
      >
        <option disabled>날짜 갯수</option>
        {[1, 2, 4, 6, 8].map((n) => (
          <option key={n}>{n}</option>
        ))}
      </select> */}

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
