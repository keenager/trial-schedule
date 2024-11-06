import React from "react";
import { useDataCtx } from "./store/DataProvider";
import useButtons from "@/lib/useButtons";

export default function Buttons() {
  const { dateList } = useDataCtx();
  const { readExcelHandler, dateChangeHandler } = useButtons();

  return (
    <div
      className="flex justify-end items-center mb-3"
      onMouseOver={() => {
        document.getElementById("case-detail")!.style.display = "none";
      }}
    >
      <button className="btn btn-sm btn-accent mr-3" onClick={readExcelHandler}>
        엑셀 파일 불러오기
      </button>

      <select
        className="select select-sm select-bordered select-accent max-w-xs mr-3"
        defaultValue="날짜 선택"
        onChange={dateChangeHandler}
      >
        <option disabled>날짜 선택</option>
        {dateList.map((date) => (
          <option key={date}>{date}</option>
        ))}
      </select>
      <button
        className="btn btn-sm btn-accent"
        onClick={() => {
          window.print();
        }}
      >
        출력
      </button>
    </div>
  );
}
