import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import { useScheduleCtx } from "./provider";
import { Case } from "@/models/tcModel";

export default function Buttons() {
  const [msg, setMsg] = useState("default text");
  const [excel, setExcel] = useState("excel file contents");
  const tcList = useScheduleCtx().tcList;

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
    setExcel(result[10].사건명);
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
