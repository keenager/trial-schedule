import { useData, useDataDispatch } from "@/app/store/DataProvider";
import { hideContextMenu } from "@/lib/contextMenu";

export default function ContextMenu() {
  const { secondTarget } = useData();
  const dispatch = useDataDispatch();

  return (
    <ul
      id="context-menu"
      className="menu menu-vertical bg-base-200 rounded-box absolute z-30 hidden"
    >
      {!secondTarget.index && (
        <li
          onClick={() => {
            // 모달 창 띄워서 텍스트 인풋
            hideContextMenu();
            const modal: any = document.getElementById("add_info_modal")!;
            modal.showModal();
          }}
        >
          <a>사용자 정보</a>
        </li>
      )}
      <li onClick={() => dispatch({ type: "merge" })}>
        <a>합치기</a>
      </li>
      <li onClick={() => dispatch({ type: "break" })}>
        <a>나누기</a>
      </li>
      <li onClick={() => dispatch({ type: "cancel" })}>
        <a>취소</a>
      </li>
    </ul>
  );
}
