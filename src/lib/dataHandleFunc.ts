import { Case, TcUnit } from "@/models/tcModel";
import { TcObjType } from "./dataType";
import getTcListOf from "./tcList";

export function copy(target: any) {
  return JSON.parse(JSON.stringify(target));
}

export function minmax(num1: number, num2: number) {
  const max = Math.max(num1, num2);
  const min = Math.min(num1, num2);
  return [min, max];
}

export function merge(list: TcUnit[], start: number, end: number) {
  list[start].span = end - start + 1 + list[end].span - 1; // 이미 병합된 셀과 함께 병합 가능.
  for (let i = start + 1; i <= end; i++) {
    list[i].span = 1;
    list[i].isHidden = true;
  }
}

export function getUnselectedTcObj(
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

export const getDateTcFromCaseList = (caseList: Case[]) => {
  const dateList = [...new Set(caseList.map((item) => item.날짜))];
  const tcObj: TcObjType = {};
  for (const date of dateList) {
    tcObj[date] = getTcListOf(caseList, date);
  }
  return { dateList, tcObj };
};
