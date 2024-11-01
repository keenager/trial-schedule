import React from "react";
import TwoHourColumn from "./TwoHourColumn";
import { useScheduleCtx } from "./provider";

export default function ScheduleTable() {
  const { tcList, mergeHandler, breakHandler, cancelHandler } =
    useScheduleCtx();

  const clickHandler = () => {
    document.getElementById("context-menu")!.style.display = "none";
  };

  // 세 덩어리로 쪼개기
  const dividedList = [];
  for (let i = 0; i < tcList.length; i += 12) {
    dividedList.push(tcList.slice(i, i + 12));
  }

  return (
    <>
      <div
        className="grid grid-cols-3 grid-rows-1 grid-flow-col gap-x-1 gap-y-3"
        onClick={clickHandler}
      >
        {dividedList.map((div, i) => (
          <TwoHourColumn key={i} div={div} />
        ))}
      </div>
      <ul
        id="context-menu"
        className="menu menu-vertical bg-base-200 rounded-box absolute hidden"
      >
        <li onClick={mergeHandler}>
          <a>합치기</a>
        </li>
        <li onClick={breakHandler}>
          <a>나누기</a>
        </li>
        <li onClick={cancelHandler}>
          <a>취소</a>
        </li>
      </ul>
    </>
  );
}