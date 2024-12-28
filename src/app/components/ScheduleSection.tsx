import { useData } from "@/app/store/DataProvider";
import { useCheckList } from "@/app/store/CheckListProvider";
import TimeTable from "./timetable/TimeTable";
import ContextMenu from "./timetable/ContextMenu";
import CaseDetail from "./timetable/CaseDetail";
import AddInfoModal from "./modals/AddInfoModal";

export default function ScheduleSection() {
  const data = useData();
  const checkList = useCheckList();

  const checkedDateList = data.dateList.filter((_, i) => checkList[i]);

  return (
    <section className="schedule">
      {checkedDateList.map((date, idx) => (
        <TimeTable
          key={idx}
          idx={idx}
          date={date}
          checkedDateList={checkedDateList}
          tcList={data.tcObj[date]}
        />
      ))}
      {/* 유틸 컴포넌트 */}
      <ContextMenu />
      <AddInfoModal />
      <CaseDetail />
    </section>
  );
}
