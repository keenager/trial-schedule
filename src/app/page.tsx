"use client";
import { useEffect, useRef } from "react";
import { useSetMsg } from "@/app/store/ToastProvider";
import useExcel from "@/lib/hooks/useExcel";
import { useDataDispatch } from "@/app/store/DataProvider";
import { exists } from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/api/path";
import { SETTINGS_FILE_NAME } from "@/lib/constants";
import { SettingsType } from "@/lib/saveDataType";
import { toastErrorMsg } from "@/lib/errorHandleFunc";
import DataProvider from "./store/DataProvider";
import CheckListProvider from "./store/CheckListProvider";
import ToastProvider from "./store/ToastProvider";
import MenuSection from "./components/MenuSection";
import ScheduleSection from "./components/ScheduleSection";
import Toast from "./components/Toast";
import { confirm } from "@tauri-apps/plugin-dialog";
import { loadSettings, saveSettings } from "@/lib/settings";

export default function Home() {
  // TODO:

  return (
    <DataProvider>
      <CheckListProvider>
        <ToastProvider>
          <MainSection />
          <Toast />
        </ToastProvider>
      </CheckListProvider>
    </DataProvider>
  );
}

const MainSection = () => {
  const dataDispatch = useDataDispatch();
  const excelHandler = useExcel();
  const setMsg = useSetMsg();
  const isInitialRender = useRef(true);

  useEffect(() => {
    async function getSettings() {
      if (!isInitialRender.current) return;

      isInitialRender.current = false;

      try {
        const settingsExists = await exists(SETTINGS_FILE_NAME, {
          baseDir: BaseDirectory.AppLocalData,
        });

        if (settingsExists) {
          const settings = await loadSettings();

          if (settings.categoryList?.length > 0) {
            dataDispatch({
              type: "category",
              categoryList: settings.categoryList,
            });
          } else {
            const modal: any = document.getElementById("category_modal")!;
            modal.showModal();
          }

          dataDispatch({ type: "addInfo", infoObj: settings.userAddedInfo });

          const lastLoadedFileExists =
            settings.lastLoadedFile === ""
              ? false
              : await exists(settings.lastLoadedFile);

          // 이전에 읽었던 파일이 존재하는 경우
          if (lastLoadedFileExists) {
            const confirmed = await confirm(
              `이전에 보았던 일정을 불러올까요?\n${settings.lastLoadedFile}`,
              { title: "알림", kind: "info" }
            );
            if (confirmed) {
              excelHandler(settings.lastLoadedFile);
            }
          }
        } else {
          // settings 파일이 없는 경우
          const settings: SettingsType = {
            lastLoadedFile: "",
            userAddedInfo: {},
            categoryList: [],
          };

          await saveSettings(settings);
        }
      } catch (e) {
        toastErrorMsg(e, setMsg);
      }
    }

    getSettings();
  }, [dataDispatch, excelHandler, setMsg]);

  return (
    <>
      <MenuSection />
      <ScheduleSection />
    </>
  );
};
