import React from "react";
import { useDataCtx } from "./store/DataProvider";

export default function DateSelectModal() {
  const { dateList, setDateList } = useDataCtx();
  const newList = [...dateList];

  const changeHandler = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    newList[i].isSelected = e.currentTarget.checked;
  };

  return (
    <dialog id="date_select_modal" className="modal">
      <div className="modal-box w-fit">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {
            const modal: any = document.getElementById("date_select_modal")!;
            modal.close();
          }}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg text-center mb-3">날짜를 고르세요!</h3>
        <div className="flex flex-col items-center">
          {dateList.map((val, i) => (
            <div key={val.date} className="form-control w-64">
              <label className="cursor-pointer label">
                <span className="label-text">{val.date}</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-accent"
                  defaultChecked={val.isSelected}
                  onChange={changeHandler.bind(null, i)}
                />
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-3">
          <button
            className="btn btn-sm btn-accent"
            onClick={() => {
              setDateList(newList);
              const modal: any = document.getElementById("date_select_modal")!;
              modal.close();
            }}
          >
            새로고침
          </button>
        </div>
      </div>
    </dialog>
  );
}
