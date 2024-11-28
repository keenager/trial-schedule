import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { Case } from "@/models/tcModel";
import { useData, useDataDispatch } from "@/app/store/DataProvider";
import { useCheckListDispatch } from "@/app/store/CheckListProvider";
import { ScheduleDataType, TcObjType } from "./dataReducer";
import getTcListOf from "./tcList";
import {
  closeToastInSec,
  showToast,
  useSetMsg,
} from "@/app/store/ToastProvider";

export default function useExcel() {
  const data = useData();
  const dataDispatch = useDataDispatch();
  const checkListDispatch = useCheckListDispatch();
  const setMsg = useSetMsg();

  const readExcelHandler = async () => {
    const filePath = await open({ multiple: false, directory: false });

    if (!filePath) return;

    const result = await invoke<Case[]>("read_data_from_excel", { filePath });

    // 에러 발생한 경우
    if (Object.keys(result[0]).some((item) => item == "errMsg")) {
      document.getElementById("toast")!.style.display = "flex";
      setMsg(Object.values(result[0])[0]);
      showToast();
      closeToastInSec(5);
      return;
    }

    const caseList = result.filter((item) =>
      data.categoryList.some((cate) => item.사건번호.includes(cate))
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
    };

    dataDispatch({ type: "load", data: newData });

    checkListDispatch({
      type: "init",
      data: new Array(dateList.length).fill(true),
      isChecked: true,
    });
  };

  return readExcelHandler;
}
