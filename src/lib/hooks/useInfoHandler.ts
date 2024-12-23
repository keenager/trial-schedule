import { useState } from "react";
import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";
import { getTimeList } from "@/models/tcModel";
import { useData, useDataDispatch } from "@/app/store/DataProvider";
import { useSetMsg } from "@/app/store/ToastProvider";
import { USER_ADDED_INFO_FILE_NAME } from "@/lib/constants";
import { toastErrorMsg } from "../errorHandleFunc";

export default function useInfoHandler() {
  const { infoObj, firstTarget } = useData();
  const dataDispatch = useDataDispatch();
  const setMsg = useSetMsg();

  const [inputText, setInputText] = useState("");

  const id = firstTarget.date + "-" + getTimeList()[firstTarget.index!];
  const savedInfoList = infoObj[id] || [];
  const [editMode, setEditMode] = useState<boolean[]>(
    new Array(savedInfoList.length).fill(false)
  );
  const [editText, setEditText] = useState<string[]>(
    new Array(savedInfoList.length).fill("")
  );

  const saveInfo = async (infoList: string[]) => {
    const newInfoObj = { ...infoObj, [id]: [...infoList] };
    try {
      await writeTextFile(USER_ADDED_INFO_FILE_NAME, JSON.stringify(infoObj), {
        baseDir: BaseDirectory.AppLocalData,
      });
    } catch (error) {
      toastErrorMsg(error, setMsg);
    }
    dataDispatch({ type: "addInfo", infoObj: newInfoObj });
  };

  const handleSaveNewInfo = async () => {
    if (inputText !== "") {
      saveInfo(savedInfoList);
      savedInfoList.push(inputText);
    }
    setInputText("");
    // handleClose();
  };

  const handleSaveAfterEdit = async (idx: number) => {
    saveInfo(savedInfoList);
    savedInfoList[idx] = editText[idx];
    handleEditMode(idx);
  };

  const handleEditMode = (idx: number) => {
    setEditMode((prev) => {
      const newArray = [...prev];
      newArray[idx] = !prev[idx];
      return newArray;
    });
  };

  const handleEditText = (idx: number, text: string) => {
    setEditText((prev) => {
      const newArray = [...prev];
      newArray[idx] = text;
      return newArray;
    });
  };

  const handleDelete = (idx: number) => {
    saveInfo(savedInfoList);
    savedInfoList.splice(idx, 1);
  };

  const handleClose = () => {
    setInputText("");
    setEditMode((prev) => prev.fill(false));
    dataDispatch({ type: "cancel" });
    const modal: any = document.getElementById("add_info_modal")!;
    modal.close();
  };

  return {
    id,
    savedInfoList,
    inputText,
    setInputText,
    editMode,
    editText,
    handleSaveNewInfo,
    handleSaveAfterEdit,
    handleEditMode,
    handleEditText,
    handleDelete,
    handleClose,
  };
}
