"use client";

import CaseScheduleProvider from "./provider";
import MainTitle from "@/app/ui/main-title";
import ScheduleTable from "./ScheduleTable";
import Buttons from "./Buttons";

export default function Home() {
  return (
    <CaseScheduleProvider>
      <MainTitle>기일부</MainTitle>
      <ScheduleTable />
      <Buttons />
    </CaseScheduleProvider>
  );
}
