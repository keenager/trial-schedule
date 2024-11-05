import { Case } from "@/models/tcModel";

export default function CaseDetail({ targetCases }: { targetCases: Case[] }) {
  return (
    <div
      id="case-detail"
      className="bg-base-100 w-auto shadow-xl p-3 absolute hidden"
    >
      {targetCases.map((c) => (
        <p key={c.사건번호}>
          {c.사건번호} {c.사건명} {c.피고인}
        </p>
      ))}
    </div>
  );
}
