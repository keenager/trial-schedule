import { useEffect } from "react";
import { useDataCtx } from "./store/DataProvider";
import TimeTable from "./TimeTable";
import { TcUnit } from "@/models/tcModel";

export default function ScheduleSection() {
  const { caseList, dateList, setDateList, setTcObj, getTcListOf } =
    useDataCtx();

  useEffect(() => {
    if (caseList.length > 0) {
      const dateList = [...new Set(caseList.map((item) => item.날짜))];
      setDateList(
        dateList.map((date) => {
          return { date, isSelected: true };
        })
      );

      const tcObj: { [key: string]: TcUnit[] } = {};
      for (const date of dateList) {
        tcObj[date] = getTcListOf(date);
      }
      setTcObj(tcObj);
    }
  }, [caseList]);

  return (
    <section className="schedule">
      {dateList.map(
        (item) =>
          item.isSelected && <TimeTable key={item.date} date={item.date} />
      )}
    </section>
  );
}
