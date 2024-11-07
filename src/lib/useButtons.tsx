import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { Case } from "@/models/tcModel";
import { useDataCtx } from "@/app/store/DataProvider";
import { useState } from "react";

export default function useButtons() {
  const { setCaseList, setDateList, setTcList, getTcListOf } = useDataCtx();
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
    document.querySelector("select")!.focus();
    setCaseList(filteredCaseList);
    setDateList([...new Set(filteredCaseList.map((item) => item.날짜))]);
  };

  const dateChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDate = e.currentTarget.value;
    const tcList = getTcListOf(selectedDate);
    setTcList(tcList);
  };

  return { errMsg, readExcelHandler, dateChangeHandler };
}
