import EditIcon from "./icons/EditIcon";
import DeleteIcon from "./icons/DeleteIcon";
import ArrowEnterIcon from "./icons/ArrowEnterIcon";
import useInfoHandler from "@/lib/hooks/useInfoHandler";

export default function AddInfoModal() {
  const {
    id,
    savedInfoList,
    inputText,
    setInputText,
    editMode,
    editText,
    handleEditMode,
    handleEditText,
    handleSaveNewInfo,
    handleSaveAfterEdit,
    handleDelete,
    handleClose,
  } = useInfoHandler();

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
            <li key={i}>
              <span>
                {editMode[i] ? (
                  <>
                    <input
                      className="input input-bordered input-sm"
                      value={editText[i]}
                      onChange={(e) => handleEditText(i, e.currentTarget.value)}
                    ></input>{" "}
                    <button
                      className="ml-5"
                      onClick={() => handleSaveAfterEdit(i)}
                    >
                      <ArrowEnterIcon width="20" height="20" />
                    </button>
                  </>
                ) : (
                  info
                )}
              </span>
              {!editMode[i] && (
                <button
                  className="ml-5"
                  onClick={() => {
                    handleEditMode(i);
                    handleEditText(i, info);
                  }}
                >
                  <EditIcon width="20" height="20" />
                </button>
              )}
              <button className="ml-2" onClick={handleDelete.bind(null, i)}>
                <DeleteIcon width="20" height="20" />
              </button>
            </li>
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
          onClick={handleSaveNewInfo}
        >
          저장
        </button>
      </div>
    </dialog>
  );
}
