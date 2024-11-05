import { useScheduleCtx } from "./provider";

export default function ContextMenu() {
  const { mergeHandler, breakHandler, cancelHandler } = useScheduleCtx();
  return (
    <ul
      id="context-menu"
      className="menu menu-vertical bg-base-200 rounded-box absolute hidden"
    >
      <li onClick={mergeHandler}>
        <a>합치기</a>
      </li>
      <li onClick={breakHandler}>
        <a>나누기</a>
      </li>
      <li onClick={cancelHandler}>
        <a>취소</a>
      </li>
    </ul>
  );
}
