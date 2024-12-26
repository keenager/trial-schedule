import { useEffect, useRef } from "react";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/api/path";
import { confirm } from "@tauri-apps/plugin-dialog";
import { useData, useDataDispatch } from "@/app/store/DataProvider";
import { useCheckList } from "@/app/store/CheckListProvider";
import { useSetMsg } from "@/app/store/ToastProvider";
import { SETTINGS_FILE_NAME } from "@/lib/constants";
import { SettingsType } from "@/lib/saveDataType";
import { toastErrorMsg } from "@/lib/errorHandleFunc";
import useExcel from "@/lib/hooks/useExcel";
import TimeTable from "./timetable/TimeTable";
import ContextMenu from "./timetable/ContextMenu";
import CaseDetail from "./timetable/CaseDetail";
import AddInfoModal from "./modals/AddInfoModal";

export default function ScheduleSection() {
  const data = useData();
  const dataDispatch = useDataDispatch();
  const checkList = useCheckList();
  const excelHandler = useExcel();
  const setMsg = useSetMsg();
  const isInitialRender = useRef(true);

  useEffect(() => {
    async function getSettings() {
      if (!isInitialRender.current) return;

      isInitialRender.current = false;

      try {
        const settingsExists = await exists(SETTINGS_FILE_NAME, {
          baseDir: BaseDirectory.AppLocalData,
        });

        if (settingsExists) {
          const settings: SettingsType = JSON.parse(
            await readTextFile(SETTINGS_FILE_NAME, {
              baseDir: BaseDirectory.AppLocalData,
            })
          );

          dataDispatch({ type: "addInfo", infoObj: settings.userAddedInfo });

          const lastLoadedFileExists = await exists(settings.lastLoadedFile);

          // 이전에 읽었던 파일이 존재하는 경우
          if (lastLoadedFileExists) {
            const confirmed = await confirm(
              `이전에 보았던 일정을 불러올까요?\n${settings.lastLoadedFile}`,
              { title: "알림", kind: "info" }
            );
            if (confirmed) {
              excelHandler(settings.lastLoadedFile);
            }
          }
        } else {
          // settings 파일이 없는 경우
          const settings: SettingsType = {
            lastLoadedFile: "",
            userAddedInfo: {},
          };

          await writeTextFile(SETTINGS_FILE_NAME, JSON.stringify(settings), {
            baseDir: BaseDirectory.AppLocalData,
          });
        }
      } catch (e) {
        toastErrorMsg(e, setMsg);
      }
    }

    getSettings();
  }, [dataDispatch, excelHandler, setMsg]);

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
