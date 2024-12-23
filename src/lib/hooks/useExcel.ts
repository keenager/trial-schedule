import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { Case } from "@/models/tcModel";
import { useDataDispatch } from "@/app/store/DataProvider";
import { useCheckListDispatch } from "@/app/store/CheckListProvider";
import {
  closeToastInSec,
  showToast,
  useSetMsg,
} from "@/app/store/ToastProvider";

export default function useExcel() {
  const dataDispatch = useDataDispatch();
  const checkListDispatch = useCheckListDispatch();
  const setMsg = useSetMsg();

  const readExcelHandler = async () => {
    const filePath = await open({ multiple: false, directory: false });

    if (!filePath) return;

    const caseList = await invoke<Case[]>("read_data_from_excel", { filePath });

    // 에러 발생한 경우
    if (Object.keys(caseList[0]).some((item) => item == "errMsg")) {
      document.getElementById("toast")!.style.display = "flex";
      setMsg(Object.values(caseList[0])[0]);
      showToast();
      closeToastInSec(7);
      return;
    }

    dataDispatch({ type: "load", caseList });

    checkListDispatch({
      type: "init",
      data: new Array(
        [...new Set(caseList.map((item) => item.날짜))].length
      ).fill(true),
      isChecked: true,
    });
  };

  return readExcelHandler;
}
