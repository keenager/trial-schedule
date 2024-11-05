import { CaseNumCell, TimeCell } from "./Cells";
import { TcUnit } from "@/models/tcModel";

export default function TwoHourColumn({ div }: { div: TcUnit[] }) {
  return (
    <div className="grid grid-cols-2 grid-rows-12 grid-flow-col">
      {div.map((tc, i) => (
        <TimeCell key={i} time={tc.time} />
      ))}
      {div.map((tc, i) => (
        <CaseNumCell key={i} tc={tc} />
      ))}
    </div>
  );
}
