import React, { useEffect } from "react";
import { BaseDirectory, exists, readTextFile } from "@tauri-apps/plugin-fs";
import { CATEGORY_FILE_NAME } from "@/lib/constants";
import useExcel from "@/lib/hooks/useExcel";
import { hideDetailDiv } from "@/lib/cell";
import { useDataDispatch } from "../store/DataProvider";
import { useSetMsg } from "../store/ToastProvider";
import DateSelectModal from "./DateSelectModal";
import CategoryModal from "./CategoryModal";
import { toastErrorMsg } from "@/lib/errorHandleFunc";
import { open } from "@tauri-apps/plugin-dialog";

export default function Buttons() {
  const excelHandler = useExcel();
  const dataDispatch = useDataDispatch();
  const setMsg = useSetMsg();

  useEffect(() => {
    async function getCategoryListFromFile() {
      const fileExists = await exists(CATEGORY_FILE_NAME, {
        baseDir: BaseDirectory.AppLocalData,
      });

      const contents = fileExists
        ? await readTextFile(CATEGORY_FILE_NAME, {
            baseDir: BaseDirectory.AppLocalData,
          })
        : "[]";
      const categoryList = JSON.parse(contents);

      if (categoryList.length > 0) {
        dataDispatch({ type: "category", categoryList });
      } else {
        const modal: any = document.getElementById("category_modal")!;
        modal.showModal();
      }
    }

    try {
      getCategoryListFromFile();
    } catch (e) {
      toastErrorMsg(e, setMsg);
    }
  }, []);

  const handleLoadExcelFile = async () => {
    dataDispatch({ type: "cancel" });

    const filePath = await open({ multiple: false, directory: false });
    if (!filePath) return;
    excelHandler(filePath);
  };

  return (
    <section
      className="no-print flex justify-between fixed top-0 left-0 right-0 z-50 bg-white py-3 px-8"
      onMouseOver={hideDetailDiv}
    >
      <div className="flex justify-start items-center gap-3">
        <button
          className="btn btn-sm"
          onClick={() => {
            const modal: any = document.getElementById("category_modal")!;
            modal.showModal();
          }}
        >
          사건 부호
        </button>
        <CategoryModal />
      </div>
      <div className="flex justify-end items-center gap-3">
        <button className="btn btn-sm btn-accent" onClick={handleLoadExcelFile}>
          엑셀 파일 불러오기
        </button>

        <button
          className="btn btn-sm btn-accent"
          onClick={() => {
            const modal: any = document.getElementById("date_select_modal")!;
            modal.showModal();
          }}
        >
          날짜 선택
        </button>
        <DateSelectModal />
        <button
          className="btn btn-sm btn-accent"
          onClick={() => window.print()}
        >
          출력
        </button>
      </div>
    </section>
  );
}
