import { useScheduleCtx } from "./provider";
import { TcUnit } from "@/models/tcModel";
import React from "react";

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
    useScheduleCtx();

  const startLine = (tc.idx % 12) + 1;
  const endLine = startLine + tc.span;

  const className =
    "bg-base-100 border border-slate-300 text-center content-center" +
    (tc.isSelected ? " bg-red-500" : "") +
    // (tc.span > 1 ? ` row-start-${startLine} row-end-${endLine}` : "") +
    (tc.isHidden ? " hidden" : "");

  const style =
    tc.span > 1
      ? {
          gridRowStart: startLine,
          gridRowEnd: endLine,
        }
      : undefined;

  const id = [tc.date, tc.time].join("-");

  return (
    <div
      id={id}
      className={className}
      style={style}
      onClick={cellClickHandler}
      onContextMenu={contextHandler}
      onMouseOver={caseDetailHandler}
    >
      {tc.count}
    </div>
  );
}
