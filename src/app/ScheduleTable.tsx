import React from "react";
import { useDataCtx } from "./store/DataProvider";
import TwoHourColumn from "./TwoHourColumn";

export default function ScheduleTable() {
  const { tcList } = useDataCtx();

  const clickHandler = () => {
    document.getElementById("context-menu")!.style.display = "none";
  };

  // 세 덩어리로 쪼개기
  const dividedList = [];
  for (let i = 0; i < tcList.length; i += 12) {
    dividedList.push(tcList.slice(i, i + 12));
  }

  return (
    <div
      className="grow grid grid-cols-3 grid-rows-1 grid-flow-col gap-x-1 gap-y-3"
      onClick={clickHandler}
    >
      {dividedList.map((div, i) => (
        <TwoHourColumn key={i} div={div} />
      ))}
    </div>
  );
}
