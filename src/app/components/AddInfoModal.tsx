import { useState } from "react";
import { useData, useDataDispatch } from "../store/DataProvider";
import { getTimeList } from "@/models/tcModel";
import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";
import { closeToastInSec, showToast, useSetMsg } from "../store/ToastProvider";
import { USER_INFO_FILE_NAME } from "@/lib/constants";

export default function AddInfoModal() {
  const { infoObj, firstTarget } = useData();
  const dataDispatch = useDataDispatch();
  const setMsg = useSetMsg();

  const [inputText, setInputText] = useState("");

  const id = firstTarget.date + "-" + getTimeList()[firstTarget.index!];
  const savedInfoList = infoObj[id] || [];

  return (
    <dialog id="add_info_modal" className="modal">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {
            setInputText("");
            dataDispatch({ type: "cancel" });
            const modal: any = document.getElementById("add_info_modal")!;
            modal.close();
          }}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">{id} 사건 관련 정보</h3>
        {savedInfoList.map((info, i) => (
          <p key={i}>{info}</p>
        ))}
        <h3 className="font-bold text-lg">추가 정보를 입력하세요.</h3>
        <div className="py-4">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
            value={inputText}
            onChange={(e) => setInputText(e.currentTarget.value)}
          />
        </div>
        <button
          className="btn btn-primary btn-sm block ml-auto"
          onClick={async () => {
            if (inputText !== "") {
              savedInfoList.push(inputText);
              const newInfoObj = { ...infoObj, [id]: savedInfoList };

              try {
                await writeTextFile(
                  USER_INFO_FILE_NAME,
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
                closeToastInSec();
              }
            }
            setInputText("");
            dataDispatch({ type: "cancel" });
            const modal: any = document.getElementById("add_info_modal")!;
            modal.close();
          }}
        >
          저장
        </button>
      </div>
    </dialog>
  );
}
