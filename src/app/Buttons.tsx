import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import { useScheduleCtx } from "./provider";
import { Case, getTimeList, TcUnit } from "@/models/tcModel";

const getTcMap = (result: Case[]): Map<string, TcUnit[]> => {
  const dates = new Set(result.map((item) => item.날짜));
  const tcMap = new Map<string, TcUnit[]>();

  for (let date of dates) {
    // 해당 날짜의 사건 리스트
    const casesOfTheDate = result.filter((item) => item.날짜 == date);
    // tcUnit으로 변환
    const tcUnitsOfTheDate = getTimeList().map((time, i) => {
      // 시각이 같은 사건들
      const itemsOfTheTime = casesOfTheDate.filter((item) => item.시각 == time);
      const gt10m = itemsOfTheTime.find((item) => item.소요예정시간);
      const span = gt10m ? Number.parseInt(gt10m.소요예정시간) / 10 : 1;
      return new TcUnit(i, date, time, itemsOfTheTime.length, span);
    });

    const bigSpanCases = tcUnitsOfTheDate.filter((unit) => unit.span > 1);
    for (let item of bigSpanCases) {
      for (let i = item.idx + 1; i < item.idx + item.span; i++) {
        tcUnitsOfTheDate[i].isHidden = true;
      }
    }

    tcMap.set(date, tcUnitsOfTheDate);
  }
  return tcMap;
};

export default function Buttons() {
  const [msg, setMsg] = useState("default text");
  const [excel, setExcel] = useState("excel file contents");
  const { tcList, setTcList } = useScheduleCtx();

  const readSavedHandler = async () => {
    const filePath = await open({ multiple: false, directory: false });
    if (!filePath) return;
    const result = await invoke<string>("read_file_command", { filePath });
    setMsg(result);
  };

  const readExcelHandler = async () => {
    const filePath = await open({ multiple: false, directory: false });
    if (!filePath) return;
    const result = await invoke<Case[]>("read_data_from_excel", { filePath });
    const filteredResult = result.filter(
      (item) => item.사건번호.includes("고단") || item.사건번호.includes("고정")
    );
    const tcMap = getTcMap(filteredResult);
    // console.log(tcMap);
    setTcList(tcMap.get([...tcMap.keys()][1])!);
  };

  const saveHandler = async () => {
    // try {
    //   await writeTextFile("testFile.txt", "Hello World!!!", {
    //     baseDir: BaseDirectory.Document,
    //   });
    //   setMsg("성공!");
    // } catch (e) {
    //   setMsg(e as string);
    // }
    const dirPath = await open({ multiple: false, directory: true });
    if (!dirPath) return;

    const contents = JSON.stringify(tcList);
    const result = await invoke<string>("save_file_command", {
      filePath: dirPath + "\\testFile.txt",
      contents,
    });
    setMsg(result);
  };
  return (
    <>
      <button className="btn btn-primary" onClick={readSavedHandler}>
        Read Saved Data
      </button>
      <div className="text-center">{msg}</div>
      <button className="btn btn-primary" onClick={readExcelHandler}>
        Read Excel File
      </button>
      <div className="text-center">{excel}</div>
      <button className="btn btn-primary" onClick={saveHandler}>
        Save
      </button>
    </>
  );
}
