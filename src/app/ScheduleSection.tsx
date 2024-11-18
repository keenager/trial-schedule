import { useCheckList } from "./store/CheckListProvider";
import TimeTable from "./components/TimeTable";
import ContextMenu from "./components/ContextMenu";
import CaseDetail from "./components/CaseDetail";
import { useData } from "./store/DataProvider";

export default function ScheduleSection() {
  const data = useData();
  const checkList = useCheckList();

  return (
    <section className="schedule">
      {data.dateList.map(
        (date, idx) =>
          checkList[idx] && (
            <TimeTable
              key={idx}
              idx={idx}
              date={date}
              tcList={data.tcObj[date]}
            />
          )
      )}
      {/* 유틸 컴포넌트 */}
      <ContextMenu />
      <CaseDetail />
    </section>
  );
}
