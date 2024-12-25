import { invoke } from "@tauri-apps/api/core";
import { Case } from "@/models/tcModel";
import { useDataDispatch } from "@/app/store/DataProvider";
import { useCheckListDispatch } from "@/app/store/CheckListProvider";
import {
  closeToastInSec,
  showToast,
  useSetMsg,
} from "@/app/store/ToastProvider";
import {
  BaseDirectory,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { SETTINGS_FILE_NAME } from "../constants";
import { SettingsType } from "../saveDataType";
import { toastErrorMsg } from "../errorHandleFunc";

export default function useExcel() {
  const dataDispatch = useDataDispatch();
  const checkListDispatch = useCheckListDispatch();
  const setMsg = useSetMsg();

  const readExcelHandler = async (filePath: string) => {
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

    // 읽었던 파일 경로를 settings 파일에 저장하기
    try {
      const settings = JSON.parse(
        await readTextFile(SETTINGS_FILE_NAME, {
          baseDir: BaseDirectory.AppLocalData,
        })
      ) as SettingsType;
      settings.lastLoadedFile = filePath;

      await writeTextFile(SETTINGS_FILE_NAME, JSON.stringify(settings), {
        baseDir: BaseDirectory.AppLocalData,
      });
    } catch (error) {
      toastErrorMsg(error, setMsg);
    }
  };

  return readExcelHandler;
}
