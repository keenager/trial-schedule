import React from "react";
import { useCheckList, useCheckListDispatch } from "../store/CheckListProvider";
import { useData } from "../store/DataProvider";

export default function DateSelectModal() {
  const data = useData();
  const checkList = useCheckList();
  const dispatch = useCheckListDispatch();

  const handleClose = () => {
    const modal: any = document.getElementById("date_select_modal")!;
    modal.close();
  };

  return (
    <dialog id="date_select_modal" className="modal">
      <div className="modal-box w-fit">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg text-center mb-3">날짜를 고르세요!</h3>
        <div className="flex flex-col items-center">
          {data.dateList.map((date, idx) => (
            <div key={date} className="form-control w-64">
              <label className="cursor-pointer label">
                <span className="label-text">{date}</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-accent"
                  checked={checkList[idx] || false}
                  onChange={(e) => {
                    dispatch({
                      type: "change",
                      idx,
                      isChecked: e.currentTarget.checked,
                    });
                  }}
                />
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-3">
          <label className="label cursor-pointer">
            <span className="label-text mr-1">전체</span>
            <input
              type="checkbox"
              className="toggle"
              defaultChecked
              onChange={(e) => {
                dispatch({
                  type: "toggle",
                  isChecked: e.currentTarget.checked,
                });
              }}
            />
          </label>
          <button className="btn btn-sm btn-accent" onClick={handleClose}>
            확인
          </button>
        </div>
      </div>
    </dialog>
  );
}
