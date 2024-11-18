import { Case, getTimeList, TcUnit } from "@/models/tcModel";

export default function getTcListOf(caseList: Case[], date: string): TcUnit[] {
  // 해당 날짜의 사건 리스트
  const casesOfTheDate = caseList.filter((item) => item.날짜 == date);
  // tcUnit으로 변환
  const tcList = getTimeList().map((time, i) => {
    // 시각이 같은 사건들
    const casesOfTheTime = casesOfTheDate.filter((item) => item.시각 == time);
    // 그중에서 10분 이상 걸리는 사건 관련 처리
    const gt10m = casesOfTheTime.find((item) => item.소요예정시간);
    const span = gt10m ? Number.parseInt(gt10m.소요예정시간) / 10 : 1;

    return new TcUnit(i, date, time, casesOfTheTime.length, span);
  });

  // 10분 이상 걸리는 경우 병합 처리
  const bigSpanTcList = tcList.filter((tc) => tc.span > 1);
  // 한 컬럼을 넘어가는 경우에 관한 처리
  const overSpanTc = bigSpanTcList.find(
    (tc) => tc.idx < 24 && tc.idx + tc.span > 24
  );
  if (overSpanTc) {
    const tempSpan = overSpanTc.span;
    overSpanTc.span = 24 - overSpanTc.idx;
    tcList[24].span = tempSpan - overSpanTc.span;
    tcList[24].count = "↑";
    bigSpanTcList.push(tcList[24]);
  }
  for (const bigTc of bigSpanTcList) {
    for (let i = bigTc.idx + 1; i < bigTc.idx + bigTc.span; i++) {
      tcList[i].isHidden = true;
    }
  }

  // tcMap.set(date, tcUnitsOfTheDate);
  // }
  return tcList;
}
