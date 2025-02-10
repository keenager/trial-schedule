import { useData, useDataDispatch } from "@/app/store/DataProvider";

export default function DateAddModal() {
  const { dateList } = useData();
  const dataDispatch = useDataDispatch();

  const handleOK = () => {
    const $date = document.querySelector(
      "input[type='date']"
    ) as HTMLInputElement;
    const date = $date.value.replaceAll("-", ".");

    if (date && !dateList.includes(date)) {
      dataDispatch({ type: "addDate", date });
    }

    handleClose();
  };

  const handleClose = () => {
    const modal: any = document.getElementById("date_add_modal")!;
    modal.close();
  };

  return (
    <dialog id="date_add_modal" className="modal">
      <div className="modal-box w-fit px-7">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-1 top-1"
          onClick={handleClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg text-center mb-3">
          추가할 날짜를 고르세요!
        </h3>

        <input type="date" className="input input-bordered w-full" />

        <div className="flex justify-end gap-3 mt-3">
          <button className="btn btn-sm btn-accent" onClick={handleOK}>
            확인
          </button>
        </div>
      </div>
    </dialog>
  );
}
