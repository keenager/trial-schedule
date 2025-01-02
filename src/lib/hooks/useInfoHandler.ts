import { useState } from "react";
import { confirm } from "@tauri-apps/plugin-dialog";
import { getTimeList } from "@/models/tcModel";
import { useData, useDataDispatch } from "@/app/store/DataProvider";
import { useSetMsg } from "@/app/store/ToastProvider";
import { toastErrorMsg } from "../errorHandleFunc";
import { InfoObjType } from "../dataType";
import { loadSettings, saveSettings } from "../settings";

export default function useInfoHandler() {
  const { infoObj, firstTarget } = useData();
  const dataDispatch = useDataDispatch();
  const setMsg = useSetMsg();

  const [inputText, setInputText] = useState("");

  const id = firstTarget.date + "-" + getTimeList()[firstTarget.index!];
  const infoListOfTheTime = infoObj[id] || [];
  const [editMode, setEditMode] = useState<boolean[]>([]);

  const [editText, setEditText] = useState<string[]>(
    new Array(infoListOfTheTime.length).fill("")
  );

  const saveInfo = async (infoList: string[]) => {
    const newInfoObj: InfoObjType = { ...infoObj, [id]: [...infoList] };
    const hasInfo: boolean = !!infoList.length;
    if (!hasInfo) delete newInfoObj[id];

    try {
      const settings = await loadSettings();
      settings.userAddedInfo = newInfoObj;
      await saveSettings(settings);
      dataDispatch({ type: "addInfo", infoObj: newInfoObj });
    } catch (error) {
      toastErrorMsg(error, setMsg);
    }
    setEditMode(hasInfo ? new Array(newInfoObj[id].length).fill(false) : []);
  };

  const handleSaveNewInfo = async () => {
    if (inputText !== "") {
      infoListOfTheTime.push(inputText);
      saveInfo(infoListOfTheTime);
    }
    setInputText("");
    // handleClose();
  };

  const handleSaveAfterEdit = async (idx: number) => {
    if (editText[idx] === "") {
      handleDelete(idx);
    } else {
      infoListOfTheTime[idx] = editText[idx];
      saveInfo(infoListOfTheTime);
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
      infoListOfTheTime.splice(idx, 1);
      setEditMode(new Array(infoListOfTheTime.length).fill(false));
      saveInfo(infoListOfTheTime);
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
    infoListOfTheTime,
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
