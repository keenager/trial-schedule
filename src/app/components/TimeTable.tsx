import React from "react";
import { TcUnit } from "@/models/tcModel";
import TwoHourColumn from "./TwoHourColumn";

export default function TimeTable({
  idx,
  date,
  tcList,
}: {
  idx: number;
  date: string;
  tcList: TcUnit[];
}) {
  const weekDay = ["일", "월", "화", "수", "목", "금", "토"][
    new Date(date).getDay()
  ];

  // 세 덩어리로 쪼개기
  const dividedList = [];
  for (let i = 0; i < tcList.length; i += 12) {
    dividedList.push(tcList.slice(i, i + 12));
  }

  return (
    <section className={`timeTable my-10 ${idx % 2 && "break-after-page"}`}>
      <h3 className="text-center text-lg font-bold font-sans mb-1">
        {date} ({weekDay})
      </h3>
      <div
        className="grow grid grid-cols-3 grid-rows-1 grid-flow-col gap-x-1 gap-y-3"
        onClick={() => {
          document.getElementById("context-menu")!.style.display = "none";
        }}
      >
        {dividedList.map((div, i) => (
          <TwoHourColumn key={i} div={div} />
        ))}
      </div>
    </section>
  );
}
