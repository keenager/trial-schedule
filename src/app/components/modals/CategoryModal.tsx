import { useState } from "react";
import { useData, useDataDispatch } from "@/app/store/DataProvider";
import { useSetMsg } from "@/app/store/ToastProvider";
import { toastErrorMsg } from "@/lib/errorHandleFunc";
import DeleteIcon from "../icons/DeleteIcon";
import { loadSettings, saveSettings } from "@/lib/settings";

export default function CategoryModal() {
  const [inputText, setInputText] = useState("");
  const { categoryList } = useData();
  const dataDispatch = useDataDispatch();
  const setMsg = useSetMsg();

  const handleSave = async () => {
    if (inputText === "") return;
    if (categoryList.includes(inputText)) {
      setInputText("");
      return;
    }

    const newCategoryList = [...categoryList];
    newCategoryList.push(inputText);

    try {
      const settings = await loadSettings();
      settings.categoryList = newCategoryList;
      await saveSettings(settings);
      dataDispatch({ type: "category", categoryList: newCategoryList });
      setInputText("");
    } catch (e) {
      toastErrorMsg(e, setMsg);
    }
  };

  const handleClose = () => {
    setInputText("");
    const modal: any = document.getElementById("category_modal")!;
    modal.close();
  };

  const handleDelete = async (target: string) => {
    try {
      const newCategoryList = categoryList.filter((cate) => cate !== target);
      const settings = await loadSettings();
      await saveSettings({ ...settings, categoryList: newCategoryList });
      dataDispatch({ type: "category", categoryList: newCategoryList });
    } catch (e) {
      toastErrorMsg(e, setMsg);
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
                {cate}
                <button
                  className="ml-3 items-center"
                  onClick={() => handleDelete(cate)}
                >
                  <DeleteIcon width="20" height="20" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <label className="form-control py-4">
          <div className="label">
            <span className="label-text">
              추가할 &apos;사건 부호&apos;(ex. 가단, 고단)를 입력하세요.
            </span>
          </div>
          <input
            type="text"
            autoFocus
            placeholder="Type here"
            className="input input-bordered w-full"
            value={inputText}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
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
