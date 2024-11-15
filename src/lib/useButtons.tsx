import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { Case } from "@/models/tcModel";
import { useDataCtx } from "@/app/store/DataProvider";
import { useState } from "react";

export default function useButtons() {
  const { setCaseList } = useDataCtx();
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

    const filteredCaseList = result.filter(
      (item) => item.사건번호.includes("고단") || item.사건번호.includes("고정")
    );
    setCaseList(filteredCaseList);
  };

  return { errMsg, readExcelHandler };
}
