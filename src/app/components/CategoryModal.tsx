import { useState } from "react";
import { useData, useDataDispatch } from "../store/DataProvider";
import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";
import { CATEGORY_FILE_NAME } from "@/lib/constants";
import { closeToastInSec, showToast, useSetMsg } from "../store/ToastProvider";

export default function CategoryModal() {
  const [inputText, setInputText] = useState("");
  const { categoryList } = useData();
  const dataDispatch = useDataDispatch();
  const setMsg = useSetMsg();

  const savedCategoryList = [...categoryList];

  const handleSave = async () => {
    if (inputText !== "") {
      savedCategoryList.push(inputText);

      try {
        await writeTextFile(
          CATEGORY_FILE_NAME,
          JSON.stringify(savedCategoryList),
          {
            baseDir: BaseDirectory.AppLocalData,
          }
        );
        dataDispatch({ type: "category", categoryList: savedCategoryList });
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
    const modal: any = document.getElementById("category_modal")!;
    modal.close();
  };

  const handleDelete = async (target: string) => {
    const newCategoryList = categoryList.filter((cate) => cate !== target);
    try {
      await writeTextFile(CATEGORY_FILE_NAME, JSON.stringify(newCategoryList), {
        baseDir: BaseDirectory.AppLocalData,
      });
      dataDispatch({ type: "category", categoryList: newCategoryList });
    } catch (e) {
      let msg;
      if (e instanceof Error) msg = e.message;
      else msg = String(e);
      setMsg(msg);
      showToast();
      closeToastInSec(5);
    }
  };

  return (
    <dialog id="category_modal" className="modal">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg text-center mb-3">사건 부호</h3>
        <ul className="list-disc list-inside">
          {categoryList.map((cate, i) => (
            <li key={i} className="">
              <div className="inline">
                {cate} <DelBtn onClick={() => handleDelete(cate)} />
              </div>
            </li>
          ))}
        </ul>
        <label className="form-control py-4">
          <div className="label">
            <span className="label-text">
              추가할 '사건 부호'(ex. 가단, 고단)를 입력하세요.
            </span>
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

const DelBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="btn btn-square btn-outline btn-xs ml-3"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};
