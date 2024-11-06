import { useState } from "react";
import { TcUnit } from "../models/tcModel";
import { useDataCtx } from "@/app/store/DataProvider";

export type UseScheduleReturnType = {
  undo: (start: number, end: number, list: TcUnit[]) => void;
  cellClickHandler: (e: React.MouseEvent<HTMLDivElement>) => void;
  contextHandler: (e: React.MouseEvent<HTMLDivElement>) => void;
  caseDetailHandler: (e: React.MouseEvent<HTMLDivElement>) => void;
  mergeHandler: () => void;
  breakHandler: () => void;
  cancelHandler: () => void;
};

function hideContextMenu() {
  document.getElementById("context-menu")!.style.display = "none";
}

function minmax(num1: number, num2: number) {
  const max = Math.max(num1, num2);
  const min = Math.min(num1, num2);
  return [min, max];
}

function merge(start: number, end: number, list: TcUnit[]) {
  list[start].span = end - start + 1 + list[end].span - 1; // 이미 병합된 셀과 함께 병합 가능.
  for (let i = start + 1; i <= end; i++) {
    list[i].span = 1;
    list[i].isHidden = true;
  }
}

export default function useSchedule(): UseScheduleReturnType {
  const { tcList, setTcList, caseList, setTargetCases } = useDataCtx();

  const [firstIdx, setfirstIdx] = useState(0);
  const [secondIdx, setsecondIdx] = useState(0);
  const [cellClickNum, setCellClickNum] = useState(0);

  function undo(start: number, end: number, list: TcUnit[]) {
    const [min, max] = minmax(start, end);
    for (let i = min; i <= max; i++) {
      list[i].isSelected = false;
    }
    setfirstIdx(0);
    setsecondIdx(0);
    setCellClickNum(0);
    setTcList(list);
  }

  const cellClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const targetIdx = tcList.findIndex(
      (tc) => tc.time === e.currentTarget.id.split("-")[1]
    );
    const newList = [...tcList];

    switch (cellClickNum) {
      case 0:
        newList[targetIdx].isSelected = true;
        setfirstIdx(targetIdx);
        setCellClickNum((prev) => prev + 1);
        break;
      case 1:
        if (targetIdx === firstIdx) {
          undo(firstIdx, targetIdx, newList);
          return;
        }
        const [min, max] = minmax(firstIdx, targetIdx);
        for (let i = min; i <= max; i++) {
          newList[i].isSelected = true;
        }
        setsecondIdx(targetIdx);
        setCellClickNum((prev) => prev + 1);
        break;
      case 2:
        const [min2, max2] = minmax(firstIdx, secondIdx);
        undo(min2, max2, newList);
        return;
    }
    setTcList(newList);
  };

  const contextHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (cellClickNum === 0) {
      const targetIdx = tcList.findIndex(
        (tc) => tc.time === e.currentTarget.id.split("-")[1]
      );
      const newList = [...tcList];
      newList[targetIdx].isSelected = true;
      setfirstIdx(targetIdx);
      setCellClickNum((prev) => prev + 1);
    }

    const contextMenu = document.getElementById("context-menu")!;
    contextMenu.style.left = e.clientX + "px";
    contextMenu.style.top = e.clientY + "px";
    contextMenu.style.display = "block";
  };

  const caseDetailHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const caseDetailDiv = document.getElementById("case-detail")!;
    const targetTc = tcList.filter(
      (tc) => tc.date + "-" + tc.time === e.currentTarget.id
    );
    if (targetTc[0].count === 0 || targetTc[0].count === "↑") {
      caseDetailDiv.style.display = "none";
      return;
    }
    const targetCases = caseList.filter(
      (c) => c.날짜 === targetTc[0].date && c.시각 === targetTc[0].time
    );
    caseDetailDiv.style.left = e.clientX + "px";
    caseDetailDiv.style.top = e.clientY + "px";
    caseDetailDiv.style.display = "block";
    setTargetCases(targetCases);
  };

  const mergeHandler = () => {
    const [min, max] = minmax(firstIdx, secondIdx);

    // 셀 하나만 선택한 경우 중단
    // 점심시간 전후에 걸쳐 병합할 일은 없으므로 중단
    if (cellClickNum !== 2 || (min <= 11 && 12 <= max)) {
      undo(min, max, tcList);
      hideContextMenu();
      return;
    }

    const newList = [...tcList];
    if (min <= 23 && 24 <= max) {
      // 선택범위가 한 컬럼을 넘어가는 경우에 관한 처리
      merge(min, 23, newList);
      merge(24, max, newList);
    } else {
      // 일반적인 경우에 관한 처리
      merge(min, max, newList);
    }
    undo(min, max, newList);
    hideContextMenu();
  };

  function breakHandler() {
    const newList = [...tcList];
    if (cellClickNum !== 1) {
      undo(firstIdx, secondIdx, newList);
    } else if (newList[firstIdx].span === 1) {
      undo(firstIdx, firstIdx, newList);
    } else {
      for (let i = firstIdx + 1; i < firstIdx + newList[firstIdx].span; i++) {
        newList[i].isHidden = false;
      }
      newList[firstIdx].span = 1;
      undo(firstIdx, firstIdx, newList);
    }
    hideContextMenu();
  }

  function cancelHandler() {
    undo(0, 35, tcList);
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
