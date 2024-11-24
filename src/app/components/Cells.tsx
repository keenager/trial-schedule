import React from "react";
import { TcUnit } from "@/models/tcModel";
import { useData, useDataDispatch } from "@/app/store/DataProvider";
import { hideDetailDiv } from "@/lib/cell";

export function TimeCell({ time }: { time: string }) {
  return (
    <div
      className="bg-slate-200 border border-slate-300 text-center content-center"
      onMouseOver={hideDetailDiv}
    >
      {time}
    </div>
  );
}

export function CaseNumCell({ tc }: { tc: TcUnit }) {
  const { infoObj } = useData();
  const dataDispatch = useDataDispatch();
  const id = [tc.date, tc.time].join("-");

  const className =
    "flex bg-base-100 border border-slate-300 text-center content-center" +
    (tc.isSelected ? " bg-rose-200" : "") +
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

  const hasInfo: boolean = Object.keys(infoObj).includes(id);

  return (
    <div
      id={id}
      className={className}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        dataDispatch({ type: "click", id: e.currentTarget.id });
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        dataDispatch({
          type: "context",
          id: e.currentTarget.id,
          pos: { x: e.pageX, y: e.pageY },
        });
      }}
    >
      <div className="basis-1/3" onMouseOver={hideDetailDiv}></div>
      <div
        className="basis-1/3 cursor-default"
        onMouseOver={(e) => {
          e.stopPropagation();
          dataDispatch({
            type: "onDetail",
            id: e.currentTarget.parentElement!.id,
            pos: { x: e.pageX, y: e.pageY },
          });
        }}
      >
        {tc.count === 0 ? "" : tc.count}
      </div>
      <div
        className="basis-1/3 flex justify-center"
        onMouseOver={hideDetailDiv}
      >
        {hasInfo && (
          <div className="tooltip" data-tip={infoObj[id]}>
            {InfoIcon}
          </div>
        )}
      </div>
    </div>
  );
}

const InfoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className="stroke-info h-6 w-6 shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);
