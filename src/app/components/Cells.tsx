import React from "react";
import { TcUnit } from "@/models/tcModel";
import { useData, useDataDispatch } from "@/app/store/DataProvider";
import { hideDetailDiv } from "@/lib/cell";
import InfoIcon from "./icons/InfoIcon";

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
    "flex bg-base-100 border border-slate-300 text-center items-center" +
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
      <div
        className="basis-1/3 w-full h-full"
        onMouseOver={hideDetailDiv}
      ></div>
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
        className="basis-1/3 w-full h-full flex justify-center items-center"
        onMouseOver={hideDetailDiv}
      >
        {hasInfo && (
          <div className="tooltip z-20" data-tip={infoObj[id]}>
            <InfoIcon />
          </div>
        )}
      </div>
    </div>
  );
}
