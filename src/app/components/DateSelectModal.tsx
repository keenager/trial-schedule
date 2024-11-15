import React, { useEffect, useState } from "react";
import { useDataCtx } from "@/app/store/DataProvider";

export default function DateSelectModal() {
  const { dateList, setDateList } = useDataCtx();
  const [checkList, setCheckList] = useState<boolean[]>([]);
  useEffect(() => {
    setCheckList(dateList.map((item) => item.isSelected));
  }, [dateList]);

  const toggleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckList([...checkList].fill(e.currentTarget.checked));
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const newCheckList = [...checkList];
    newCheckList[i] = e.currentTarget.checked;
    setCheckList(newCheckList);
  };

  const refreshHandler = () => {
    const newDateList = checkList.map((val, i) => {
      const temp = { ...dateList[i] };
      temp.isSelected = val;
      return temp;
    });
    setDateList(newDateList);
    const modal: any = document.getElementById("date_select_modal")!;
    modal.close();
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
                  checked={checkList[i] || false}
                  onChange={(e) => changeHandler(e, i)}
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
              onChange={toggleHandler}
            />
          </label>
          {/* <button className="btn btn-sm btn-accent">전체</button> */}
          <button className="btn btn-sm btn-accent" onClick={refreshHandler}>
            새로고침
          </button>
        </div>
      </div>
    </dialog>
  );
}
