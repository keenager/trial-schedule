"use client";

import DataProvider from "./store/DataProvider";
import CheckListProvider from "./store/CheckListProvider";
import ToastProvider from "./store/ToastProvider";
import Buttons from "./components/Buttons";
import ScheduleSection from "./ScheduleSection";
import Toast from "./components/Toast";

export default function Home() {
  // TODO:

  return (
    <DataProvider>
      <CheckListProvider>
        <ToastProvider>
          <Buttons />
          <ScheduleSection />
          <Toast />
        </ToastProvider>
      </CheckListProvider>
    </DataProvider>
  );
}
