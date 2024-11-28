import { useState } from "react";
import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";
import { getTimeList } from "@/models/tcModel";
import { useData, useDataDispatch } from "../store/DataProvider";
import { closeToastInSec, showToast, useSetMsg } from "../store/ToastProvider";
import { USER_ADDED_INFO_FILE_NAME } from "@/lib/constants";

export default function AddInfoModal() {
  const { infoObj, firstTarget } = useData();
  const dataDispatch = useDataDispatch();
  const setMsg = useSetMsg();

  const [inputText, setInputText] = useState("");

  const id = firstTarget.date + "-" + getTimeList()[firstTarget.index!];
  const savedInfoList = infoObj[id] || [];

  const handleSave = async () => {
    if (inputText !== "") {
      savedInfoList.push(inputText);
      const newInfoObj = { ...infoObj, [id]: savedInfoList };

      try {
        await writeTextFile(
          USER_ADDED_INFO_FILE_NAME,
          JSON.stringify(newInfoObj),
          {
            baseDir: BaseDirectory.AppLocalData,
          }
        );
        dataDispatch({ type: "addInfo", infoObj: newInfoObj });
      } catch (e) {
        let msg;
        if (e instanceof Error) msg = e.message;
        else msg = String(e);
        setMsg(msg);
        showToast();
        closeToastInSec(5);
      }
    }

    handleClose();
  };

  const handleClose = () => {
    setInputText("");
    dataDispatch({ type: "cancel" });
    const modal: any = document.getElementById("add_info_modal")!;
    modal.close();
  };

  return (
    <dialog id="add_info_modal" className="modal">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg text-center mb-3">
          {id} 사건 관련 정보
        </h3>
        <ul className="list-disc list-inside">
          {savedInfoList.map((info, i) => (
            <li key={i}>{info}</li>
          ))}
        </ul>
        {/* <h3 className="font-bold text-lg">추가 정보를 입력하세요.</h3> */}
        <label className="form-control py-4">
          <div className="label">
            <span className="label-text">추가 정보를 입력하세요.</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
            value={inputText}
            onChange={(e) => setInputText(e.currentTarget.value)}
          />
        </label>
        <button
          className="btn btn-primary btn-sm block ml-auto"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </dialog>
  );
}
