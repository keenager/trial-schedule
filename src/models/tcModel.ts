export interface Case {
  날짜: string;
  시각: string;
  기일종류: string;
  사건번호: string;
  피고인: string;
  사건명: string;
  소요예정시간: string;
}

export class TcUnit {
  constructor(
    public idx: number,
    public date: string,
    public time: string,
    public count: number | "↑" = 0,
    public span: number = 1,
    public isSelected: boolean = false,
    public isHidden: boolean = false
  ) {
    this.idx = idx;
    this.date = date;
    this.time = time;
    this.count = count;
    this.span = span;
    this.isSelected = isSelected;
    this.isHidden = isHidden;
  }
}

export function getTimeList() {
  const result: string[] = [];
  for (let h = 10; h <= 17; h++) {
    if (h === 12 || h === 13) continue;
    for (let m = 0; m < 60; m += 10) {
      result.push(h + ":" + (m === 0 ? "00" : m));
    }
  }
  return result;
}
