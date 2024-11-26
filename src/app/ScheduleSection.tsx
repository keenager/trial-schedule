import { useEffect } from "react";
import { exists, readTextFile } from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/api/path";
import { useData, useDataDispatch } from "./store/DataProvider";
import { useCheckList } from "./store/CheckListProvider";
import TimeTable from "./components/TimeTable";
import ContextMenu from "./components/ContextMenu";
import CaseDetail from "./components/CaseDetail";
import AddInfoModal from "./components/AddInfoModal";
import { USER_INFO_FILE_NAME } from "@/lib/constants";

export default function ScheduleSection() {
  const data = useData();
  const dataDispatch = useDataDispatch();
  const checkList = useCheckList();

  useEffect(() => {
    async function getUserAddedInfoFromFile() {
      const fileExists = await exists(USER_INFO_FILE_NAME, {
        baseDir: BaseDirectory.AppLocalData,
      });
      const contents = fileExists
        ? await readTextFile(USER_INFO_FILE_NAME, {
            baseDir: BaseDirectory.AppLocalData,
          })
        : "{}";
      const infoObj = JSON.parse(contents);
      dataDispatch({ type: "addInfo", infoObj });
    }
    getUserAddedInfoFromFile();
  }, []);

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
