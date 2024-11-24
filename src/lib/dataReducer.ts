import { Case, TcUnit } from "../models/tcModel";
import { hideContextMenu } from "./contextMenu";

export type TcObjType = {
  [key: string]: TcUnit[];
};

export type InfoObjType = {
  [key: string]: string[];
};

export type TargetType = {
  date: string;
  index: number | undefined;
};

export type ScheduleDataType = {
  caseList: Case[];
  dateList: string[];
  tcObj: TcObjType;
  infoObj: InfoObjType;
  mouseOverCases: Case[];
  firstTarget: TargetType;
  secondTarget: TargetType;
  cellClickCount: number;
};
export const initialValue: ScheduleDataType = {
  caseList: [],
  dateList: [],
  tcObj: { date: [] },
  infoObj: { date: [""] },
  mouseOverCases: [],
  firstTarget: { date: "", index: undefined },
  secondTarget: { date: "", index: undefined },
  cellClickCount: 0,
};

export type DataActionType = {
  type:
    | "load"
    | "onDetail"
    | "click"
    | "context"
    | "addInfo"
    | "merge"
    | "break"
    | "cancel";
  data?: ScheduleDataType;
  id?: string;
  pos?: { x: number; y: number };
  infoObj?: InfoObjType;
};

function copy(target: any) {
  return JSON.parse(JSON.stringify(target));
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

function getUnselectedTcObj(
  date: string,
  tcObj: TcObjType,
  start: number,
  end: number
) {
  const [min, max] = minmax(start, end);
  const list: TcUnit[] = copy(tcObj[date]);

  for (let i = min; i <= max; i++) {
    list[i].isSelected = false;
  }

  return { ...tcObj, [date]: list };
}

export function dataReducer(
  state: ScheduleDataType,
  action: DataActionType
): ScheduleDataType {
  const refresh = (tcObj: TcObjType): ScheduleDataType => {
    return {
      ...initialValue,
      caseList: state.caseList,
      dateList: state.dateList,
      tcObj: tcObj,
      infoObj: state.infoObj,
    };
  };

  switch (action.type) {
    case "load": {
      return action.data || initialValue;
    }

    case "onDetail": {
      const caseDetailDiv = document.getElementById("case-detail")!;
      const date = action.id!.split("-")[0];
      const targetTc = state.tcObj[date].filter(
        (tc) => tc.date + "-" + tc.time === action.id
      );

      if (targetTc[0].count === 0 || targetTc[0].count === "↑") {
        caseDetailDiv.style.display = "none";
        return state;
      }

      const mouseOverCases = state.caseList.filter(
        (c) => c.날짜 === targetTc[0].date && c.시각 === targetTc[0].time
      );

      caseDetailDiv.style.left =
        (action.pos!.x > window.innerWidth * 0.66
          ? window.innerWidth * 0.5
          : action.pos!.x > window.innerWidth * 0.33
          ? window.innerWidth * 0.33
          : action.pos!.x) + "px";
      caseDetailDiv.style.top = action.pos!.y + "px";
      caseDetailDiv.style.display = "block";

      return { ...state, mouseOverCases };
    }

    case "click": {
      const targetDate = action.id!.split("-")[0];
      const targetIndex = state.tcObj[targetDate].findIndex(
        (tc) => tc.time === action.id!.split("-")[1]
      );
      const newList: TcUnit[] = copy(state.tcObj[targetDate]);

      switch (state.cellClickCount) {
        case 0: {
          newList[targetIndex].isSelected = true;
          return {
            ...state,
            tcObj: { ...state.tcObj, [targetDate]: newList },
            firstTarget: { date: targetDate, index: targetIndex },
            cellClickCount: state.cellClickCount + 1,
          };
        }

        case 1: {
          if (
            targetDate != state.firstTarget.date ||
            targetIndex === state.firstTarget.index
          ) {
            const newTcObj = getUnselectedTcObj(
              state.firstTarget.date,
              state.tcObj,
              state.firstTarget.index!,
              state.firstTarget.index!
            );
            const newTcObj2 = getUnselectedTcObj(
              targetDate,
              newTcObj,
              targetIndex,
              targetIndex
            );
            return refresh(newTcObj2);
          }

          const [min, max] = minmax(state.firstTarget.index!, targetIndex);
          for (let i = min; i <= max; i++) {
            newList[i].isSelected = true;
          }

          return {
            ...state,
            tcObj: { ...state.tcObj, [targetDate]: newList },
            secondTarget: { date: targetDate, index: targetIndex },
            cellClickCount: state.cellClickCount + 1,
          };
        }

        case 2: {
          const newTcObj = getUnselectedTcObj(
            state.firstTarget.date,
            state.tcObj,
            state.firstTarget.index!,
            state.secondTarget.index!
          );
          return refresh(newTcObj);
        }

        default: {
          return refresh(state.tcObj);
        }
      }
    }

    case "context": {
      const contextMenu = document.getElementById("context-menu")!;
      contextMenu.style.left = action.pos!.x + "px";
      contextMenu.style.top = action.pos!.y + "px";
      contextMenu.style.display = "block";

      const date = action.id!.split("-")[0];

      if (state.cellClickCount === 0) {
        const targetIdx = state.tcObj[date].findIndex(
          (tc) => tc.time === action.id!.split("-")[1]
        );
        const newList: TcUnit[] = copy(state.tcObj[date]);
        newList[targetIdx].isSelected = true;
        return {
          ...state,
          tcObj: { ...state.tcObj, [date]: newList },
          firstTarget: { date, index: targetIdx },
          cellClickCount: state.cellClickCount + 1,
        };
      } else {
        return state;
      }
    }

    case "addInfo": {
      return {
        ...state,
        infoObj: action.infoObj!,
      };
    }

    case "merge": {
      const date = state.firstTarget.date;

      // 셀 하나만 선택한 경우 중단
      if (
        state.cellClickCount !== 2 ||
        state.secondTarget.index === undefined
      ) {
        const newTcObj = getUnselectedTcObj(
          date,
          state.tcObj,
          state.firstTarget.index!,
          state.firstTarget.index!
        );
        hideContextMenu();
        return refresh(newTcObj);
      }

      const [min, max] = minmax(
        state.firstTarget.index!,
        state.secondTarget.index
      );

      // 점심시간 전후에 걸쳐 병합할 일은 없으므로 중단
      if (min <= 11 && 12 <= max) {
        const newTcObj = getUnselectedTcObj(date, state.tcObj, min, max);
        hideContextMenu();
        return refresh(newTcObj);
      }

      const tempTcObj = JSON.parse(JSON.stringify(state.tcObj));

      if (min <= 23 && 24 <= max) {
        // 선택범위가 한 컬럼을 넘어가는 경우에 관한 처리
        merge(tempTcObj[date], min, 23);
        merge(tempTcObj[date], 24, max);
      } else {
        // 일반적인 경우에 관한 처리
        merge(tempTcObj[date], min, max);
      }

      const newTcObj = getUnselectedTcObj(date, tempTcObj, min, max);
      hideContextMenu();
      return refresh(newTcObj);
    }

    case "break": {
      const date = state.firstTarget.date;
      let newTcObj: TcObjType = copy(state.tcObj);

      if (state.cellClickCount !== 1) {
        newTcObj = getUnselectedTcObj(
          date,
          newTcObj,
          state.firstTarget.index || 0,
          state.secondTarget.index || 0
        );
      } else if (newTcObj[date][state.firstTarget.index!].span === 1) {
        newTcObj = getUnselectedTcObj(
          date,
          newTcObj,
          state.firstTarget.index!,
          state.firstTarget.index!
        );
      } else {
        const idx = state.firstTarget.index!;
        for (let i = idx + 1; i < idx + newTcObj[date][idx].span; i++) {
          newTcObj[date][i].isHidden = false;
        }
        newTcObj[date][idx].span = 1;
        newTcObj = getUnselectedTcObj(date, newTcObj, idx, idx);
      }
      hideContextMenu();
      return refresh(newTcObj);
    }

    case "cancel": {
      if (state.cellClickCount <= 0) {
        hideContextMenu();
        return state;
      }

      const newTcObj = getUnselectedTcObj(
        state.firstTarget.date,
        state.tcObj,
        0,
        35
      );
      hideContextMenu();
      return refresh(newTcObj);
    }

    default: {
      throw Error(`Invalid action type: ${action.type}`);
    }
  }
}
