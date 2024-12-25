import { useState } from "react";
import {
  BaseDirectory,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { getTimeList } from "@/models/tcModel";
import { useData, useDataDispatch } from "@/app/store/DataProvider";
import { useSetMsg } from "@/app/store/ToastProvider";
import { SETTINGS_FILE_NAME } from "@/lib/constants";
import { toastErrorMsg } from "../errorHandleFunc";
import { SettingsType } from "../saveDataType";
import { InfoObjType } from "../dataType";
import { confirm } from "@tauri-apps/plugin-dialog";

export default function useInfoHandler() {
  const { infoObj, firstTarget } = useData();
  const dataDispatch = useDataDispatch();
  const setMsg = useSetMsg();

  const [inputText, setInputText] = useState("");

  const id = firstTarget.date + "-" + getTimeList()[firstTarget.index!];
  const savedInfoList = infoObj[id] || [];
  const [editMode, setEditMode] = useState<boolean[]>([]);

  const [editText, setEditText] = useState<string[]>(
    new Array(savedInfoList.length).fill("")
  );

  const saveInfo = async (infoList: string[]) => {
    const newInfoObj: InfoObjType = { ...infoObj, [id]: [...infoList] };
    try {
      const settings = JSON.parse(
        await readTextFile(SETTINGS_FILE_NAME, {
          baseDir: BaseDirectory.AppLocalData,
        })
      ) as SettingsType;

      settings.userAddedInfo = newInfoObj;

      await writeTextFile(SETTINGS_FILE_NAME, JSON.stringify(settings), {
        baseDir: BaseDirectory.AppLocalData,
      });
    } catch (error) {
      toastErrorMsg(error, setMsg);
    }
    dataDispatch({ type: "addInfo", infoObj: newInfoObj });
    setEditMode(new Array(newInfoObj[id].length).fill(false));
  };

  const handleSaveNewInfo = async () => {
    if (inputText !== "") {
      savedInfoList.push(inputText);
      saveInfo(savedInfoList);
    }
    setInputText("");
    // handleClose();
  };

  const handleSaveAfterEdit = async (idx: number) => {
    if (editText[idx] === "") {
      handleDelete(idx);
    } else {
      savedInfoList[idx] = editText[idx];
      saveInfo(savedInfoList);
      handleEditMode(idx);
    }
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

  const handleDelete = async (idx: number) => {
    const confirmed = await confirm("삭제할까요?", {
      title: "경고",
      kind: "warning",
    });
    if (confirmed) {
      savedInfoList.splice(idx, 1);
      setEditMode(new Array(savedInfoList.length).fill(false));
      saveInfo(savedInfoList);
    }
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
