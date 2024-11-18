import { useDataDispatch } from "../store/DataProvider";

export default function ContextMenu() {
  const dispatch = useDataDispatch();

  return (
    <ul
      id="context-menu"
      className="menu menu-vertical bg-base-200 rounded-box absolute hidden"
    >
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
