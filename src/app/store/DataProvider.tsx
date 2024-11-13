import { Case, getTimeList, TcUnit } from "@/models/tcModel";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type dateListType = {
  date: string;
  isSelected: boolean;
}[];

type DataCtxType = {
  caseList: Case[];
  setCaseList: Dispatch<SetStateAction<Case[]>>;
  dateList: dateListType;
  setDateList: Dispatch<SetStateAction<dateListType>>;
  selectedDate: string;
  setSelectedDate: Dispatch<SetStateAction<string>>;
  tcObj: { [key: string]: TcUnit[] };
  setTcObj: Dispatch<SetStateAction<{ [key: string]: TcUnit[] }>>;
  getTcListOf: (date: string) => TcUnit[];
  targetCases: Case[];
  setTargetCases: Dispatch<SetStateAction<Case[]>>;
};

const DataContext = createContext<DataCtxType>({
  caseList: [],
  setCaseList: () => {},
  dateList: [],
  setDateList: () => {},
  selectedDate: "",
  setSelectedDate: () => {},
  tcObj: { "": [] },
  setTcObj: () => {},
  getTcListOf: () => [],
  targetCases: [],
  setTargetCases: () => {},
});

export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [caseList, setCaseList] = useState<Case[]>([]);
  const [dateList, setDateList] = useState<dateListType>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const today = new Date().toLocaleDateString();
  const [tcObj, setTcObj] = useState({
    [today]: getTimeList().map((time, i) => new TcUnit(i, today, time, 0)),
  });

  const getTcListOf = (date: string): TcUnit[] => {
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
  };

  const [targetCases, setTargetCases] = useState<Case[]>([]);

  return (
    <DataContext.Provider
      value={{
        caseList,
        setCaseList,
        dateList,
        setDateList,
        selectedDate,
        setSelectedDate,
        tcObj,
        setTcObj,
        getTcListOf,
        targetCases,
        setTargetCases,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useDataCtx() {
  return useContext(DataContext);
}
