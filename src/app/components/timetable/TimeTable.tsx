import React from "react";
import { TcUnit } from "@/models/tcModel";
import { useData } from "@/app/store/DataProvider";
import TwoHourColumn from "./TwoHourColumn";

export default function TimeTable({
  idx,
  date,
  checkedDateList,
  tcList,
}: {
  idx: number;
  date: string;
  checkedDateList: string[];
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

  const isOdd = idx % 2 === 1;
  const isLast = idx === checkedDateList.length - 1;
  const isBottom = isOdd || isLast;

  const { infoObj } = useData();
  let targetDateTimes: string[] = [];

  if (isBottom) {
    targetDateTimes = Object.keys(infoObj).filter((key) => key.includes(date));
    if (isOdd) {
      targetDateTimes.push(
        ...Object.keys(infoObj).filter((key) =>
          key.includes(checkedDateList[idx - 1])
        )
      );
    }
  }

  targetDateTimes = targetDateTimes.sort();

  return (
    <>
      <section className="timeTable my-10">
        {/* 날짜 표시 */}
        <h3 className="text-center text-lg font-bold font-sans mb-1">
          {date} ({weekDay})
        </h3>
        {/* 시간표 */}
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
      {/* 사용자 추가 정보 표시 */}
      {isBottom && (
        <table
          className={`table table-sm hidden only-print ${
            !isLast && "break-after-page"
          }`}
        >
          <tbody>
            {targetDateTimes.map((dt, i) => (
              <tr key={dt}>
                <th>{i + 1}</th>
                <td>{dt}</td>
                <td>{infoObj[dt].join(" // ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
