import { Case, TcUnit } from "@/models/tcModel";

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
  categoryList: string[];
  caseList: Case[];
  filteredCaseList: Case[];
  dateList: string[];
  tcObj: TcObjType;
  infoObj: InfoObjType;
  mouseOverCases: Case[];
  firstTarget: TargetType;
  secondTarget: TargetType;
  cellClickCount: number;
};

type CategoryAction = {
  type: "category";
  categoryList: string[];
};

type LoadAction = {
  type: "load";
  caseList: Case[];
};

type AddDateAction = {
  type: "addDate";
  date: string;
};

type OnDetailAction = {
  type: "onDetail";
  id: string;
  pos: { x: number; y: number };
};

type ClickAction = {
  type: "click";
  id: string;
};

type ContextAction = {
  type: "context";
  id: string;
  pos: { x: number; y: number };
};

type AddInfoAction = {
  type: "addInfo";
  infoObj: InfoObjType;
};

type MergeAction = {
  type: "merge";
};

type BreakAction = {
  type: "break";
};

type CancelAction = {
  type: "cancel";
};

export type DataActionType =
  | CategoryAction
  | LoadAction
  | AddDateAction
  | OnDetailAction
  | ClickAction
  | ContextAction
  | AddInfoAction
  | MergeAction
  | BreakAction
  | CancelAction;
