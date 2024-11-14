import React from "react";
import { useTimeTableCtx } from "./store/TimeTableProvider";
import { TcUnit } from "@/models/tcModel";

export function TimeCell({ time }: { time: string }) {
  return (
    <div
      className="bg-slate-200 border border-slate-300 text-center content-center"
      onMouseOver={() => {
        document.getElementById("case-detail")!.style.display = "none";
      }}
    >
      {time}
    </div>
  );
}

export function CaseNumCell({ tc }: { tc: TcUnit }) {
  const { cellClickHandler, contextHandler, caseDetailHandler } =
    useTimeTableCtx();

  const id = [tc.date, tc.time].join("-");

  const className =
    "bg-base-100 border border-slate-300 text-center content-center" +
    (tc.isSelected ? " bg-rose-100" : "") +
    // (tc.span > 1 ? ` row-start-${startLine} row-end-${endLine}` : "") +
    (tc.isHidden ? " hidden" : "");

  const startLine = (tc.idx % 12) + 1;
  const endLine = startLine + tc.span;

  const style =
    tc.span > 1
      ? {
          gridRowStart: startLine,
          gridRowEnd: endLine,
        }
      : undefined;

  return (
    <div
      id={id}
      className={className}
      style={style}
      onClick={cellClickHandler}
      onContextMenu={contextHandler}
      onMouseOver={caseDetailHandler}
    >
      {tc.count === 0 ? "" : tc.count}
    </div>
  );
}
