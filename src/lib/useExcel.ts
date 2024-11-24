import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { Case } from "@/models/tcModel";
import { useData, useDataDispatch } from "@/app/store/DataProvider";
import { useCheckListDispatch } from "@/app/store/CheckListProvider";
import { ScheduleDataType, TcObjType } from "./dataReducer";
import getTcListOf from "./tcList";

export default function useExcel() {
  const data = useData();
  const dataDispatch = useDataDispatch();
  const checkListDispatch = useCheckListDispatch();
  const [errMsg, setErrMsg] = useState("");

  const readExcelHandler = async () => {
    const filePath = await open({ multiple: false, directory: false });

    if (!filePath) return;

    const result = await invoke<Case[]>("read_data_from_excel", { filePath });

    // 에러 발생한 경우
    if (Object.keys(result[0]).some((item) => item == "errMsg")) {
      document.getElementById("toast")!.style.display = "flex";
      setErrMsg(Object.values(result[0])[0]);
      return;
    }

    const caseList = result.filter(
      (item) => item.사건번호.includes("고단") || item.사건번호.includes("고정")
    );
    const dateList = [...new Set(caseList.map((item) => item.날짜))];
    const tcObj: TcObjType = {};
    for (const date of dateList) {
      tcObj[date] = getTcListOf(caseList, date);
    }

    const newData: ScheduleDataType = {
      ...data,
      caseList,
      dateList,
      tcObj,
      // infoObj,
    };

    dataDispatch({ type: "load", data: newData });

    checkListDispatch({
      type: "init",
      data: new Array(dateList.length).fill(true),
      isChecked: true,
    });
  };

  return { errMsg, readExcelHandler };
}
