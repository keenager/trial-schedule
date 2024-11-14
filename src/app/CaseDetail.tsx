import { useDataCtx } from "./store/DataProvider";

export default function CaseDetail() {
  const { targetCases } = useDataCtx();
  return (
    <div
      id="case-detail"
      className="overflow-y-auto max-h-96 min-w-60 bg-green-200 rounded-lg shadow-xl p-2 absolute hidden"
    >
      <table className="table table-sm">
        <tbody>
          {targetCases.map((c) => (
            <tr key={c.사건번호}>
              <td>{c.사건번호}</td>
              <td>
                {c.사건명.length > 10
                  ? c.사건명.substring(0, 10) + "..."
                  : c.사건명}
              </td>
              <td> {c.피고인}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
