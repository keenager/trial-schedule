import { useState } from "react";
import { TcUnit } from "../models/tcModel";
import { useDataCtx } from "@/app/store/DataProvider";

export type UseScheduleReturnType = {
  undo: (date: string, list: TcUnit[], start: number, end: number) => void;
  cellClickHandler: (e: React.MouseEvent<HTMLDivElement>) => void;
  contextHandler: (e: React.MouseEvent<HTMLDivElement>) => void;
  caseDetailHandler: (e: React.MouseEvent<HTMLDivElement>) => void;
  mergeHandler: () => void;
  breakHandler: () => void;
  cancelHandler: () => void;
};

type targetType = {
  date: string;
  index: number;
};

function hideContextMenu() {
  document.getElementById("context-menu")!.style.display = "none";
}

function minmax(num1: number, num2: number) {
  const max = Math.max(num1, num2);
  const min = Math.min(num1, num2);
  return [min, max];
}

function merge(list: TcUnit[], start: number, end: number) {
  list[start].span = end - start + 1 + list[end].span - 1; // 이미 병합된 셀과 함께 병합 가능.
  for (let i = start + 1; i <= end; i++) {
    list[i].span = 1;
    list[i].isHidden = true;
  }
}

export default function useSchedule(): UseScheduleReturnType {
  const { tcObj, setTcObj, caseList, setTargetCases } = useDataCtx();

  const [firstTarget, setfirstTarget] = useState<targetType>({
    date: "",
    index: 0,
  });
  const [secondTarget, setsecondTarget] = useState<targetType>({
    date: "",
    index: 0,
  });
  const [cellClickNum, setCellClickNum] = useState(0);

  function undo(date: string, list: TcUnit[], start: number, end: number) {
    const [min, max] = minmax(start, end);
    for (let i = min; i <= max; i++) {
      list[i].isSelected = false;
    }
    setfirstTarget({ date: "", index: 0 });
    setsecondTarget({ date: "", index: 0 });
    setCellClickNum(0);
    setTcObj({ ...tcObj, [date]: list });
  }

  const cellClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const targetDate = e.currentTarget.id.split("-")[0];
    const targetIndex = tcObj[targetDate].findIndex(
      (tc) => tc.time === e.currentTarget.id.split("-")[1]
    );
    const newList = [...tcObj[targetDate]];

    switch (cellClickNum) {
      case 0:
        newList[targetIndex].isSelected = true;
        setfirstTarget({ date: targetDate, index: targetIndex });
        setCellClickNum((prev) => prev + 1);
        break;
      case 1:
        if (
          targetDate != firstTarget.date ||
          targetIndex === firstTarget.index
        ) {
          undo(targetDate, newList, firstTarget.index, targetIndex);
          return;
        }
        const [min, max] = minmax(firstTarget.index, targetIndex);
        for (let i = min; i <= max; i++) {
          newList[i].isSelected = true;
        }
        setsecondTarget({ date: targetDate, index: targetIndex });
        setCellClickNum((prev) => prev + 1);
        break;
      case 2:
        undo(firstTarget.date, newList, firstTarget.index, secondTarget.index);
        return;
    }
    setTcObj({ ...tcObj, [targetDate]: newList });
  };

  const contextHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const date = e.currentTarget.id.split("-")[0];

    if (cellClickNum === 0) {
      const targetIdx = tcObj[date].findIndex(
        (tc) => tc.time === e.currentTarget.id.split("-")[1]
      );
      const newList = [...tcObj[date]];
      newList[targetIdx].isSelected = true;
      setfirstTarget({ date, index: targetIdx });
      setCellClickNum((prev) => prev + 1);
    }

    const contextMenu = document.getElementById("context-menu")!;
    contextMenu.style.left = e.pageX + "px";
    contextMenu.style.top = e.pageY + "px";
    contextMenu.style.display = "block";
  };

  const caseDetailHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const caseDetailDiv = document.getElementById("case-detail")!;
    const date = e.currentTarget.id.split("-")[0];
    const targetTc = tcObj[date].filter(
      (tc) => tc.date + "-" + tc.time === e.currentTarget.id
    );

    if (targetTc[0].count === 0 || targetTc[0].count === "↑") {
      caseDetailDiv.style.display = "none";
      return;
    }

    const targetCases = caseList.filter(
      (c) => c.날짜 === targetTc[0].date && c.시각 === targetTc[0].time
    );
    console.log("e.pageX: ", e.pageX);
    console.log("e.pageY: ", e.pageY);

    caseDetailDiv.style.left =
      (e.pageX > window.innerWidth * 0.66
        ? window.innerWidth * 0.5
        : e.pageX > window.innerWidth * 0.33
        ? window.innerWidth * 0.33
        : e.pageX) + "px";
    caseDetailDiv.style.top = e.pageY + "px";
    caseDetailDiv.style.display = "block";
    setTargetCases(targetCases);
  };

  const mergeHandler = () => {
    const date = firstTarget.date;
    const [min, max] = minmax(firstTarget.index, secondTarget.index);

    // 셀 하나만 선택한 경우 중단
    // 점심시간 전후에 걸쳐 병합할 일은 없으므로 중단
    if (cellClickNum !== 2 || (min <= 11 && 12 <= max)) {
      undo(date, tcObj[date], min, max);
      hideContextMenu();
      return;
    }

    const newList = [...tcObj[date]];
    if (min <= 23 && 24 <= max) {
      // 선택범위가 한 컬럼을 넘어가는 경우에 관한 처리
      merge(newList, min, 23);
      merge(newList, 24, max);
    } else {
      // 일반적인 경우에 관한 처리
      merge(newList, min, max);
    }
    undo(date, newList, min, max);
    hideContextMenu();
  };

  function breakHandler() {
    const date = firstTarget.date;
    const newList = [...tcObj[date]];
    if (cellClickNum !== 1) {
      undo(date, newList, firstTarget.index, secondTarget.index);
    } else if (newList[firstTarget.index].span === 1) {
      undo(date, newList, firstTarget.index, firstTarget.index);
    } else {
      const idx = firstTarget.index;
      for (let i = idx + 1; i < idx + newList[idx].span; i++) {
        newList[i].isHidden = false;
      }
      newList[idx].span = 1;
      undo(date, newList, idx, idx);
    }
    hideContextMenu();
  }

  function cancelHandler() {
    const date = firstTarget.date;
    undo(date, tcObj[date], 0, 35);
    hideContextMenu();
  }

  return {
    undo,
    cellClickHandler,
    contextHandler,
    caseDetailHandler,
    mergeHandler,
    breakHandler,
    cancelHandler,
  };
}
