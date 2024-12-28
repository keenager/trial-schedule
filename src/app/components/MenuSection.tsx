import React from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { useDataDispatch } from "../store/DataProvider";
import useExcel from "@/lib/hooks/useExcel";
import { hideDetailDiv } from "@/lib/cell";
import DateSelectModal from "./modals/DateSelectModal";
import CategoryModal from "./modals/CategoryModal";
import { loadSettings } from "@/lib/settings";

export default function MenuSection() {
  const excelHandler = useExcel();
  const dataDispatch = useDataDispatch();

  const openCategoryModal = () => {
    const modal: any = document.getElementById("category_modal")!;
    modal.showModal();
  };

  const handleLoadExcelFile = async () => {
    dataDispatch({ type: "cancel" });

    const filePath = await open({ multiple: false, directory: false });
    if (!filePath) return;
    await excelHandler(filePath);

    // 사건번호가 지정되어 있지 않으면 모달창 띄우기
    const settings = await loadSettings();
    if (!settings.categoryList?.length) openCategoryModal();
  };

  return (
    <section
      className="no-print flex justify-between fixed top-0 left-0 right-0 z-50 bg-white py-3 px-8"
      onMouseOver={hideDetailDiv}
    >
      <div className="flex justify-start items-center gap-3">
        <button className="btn btn-sm" onClick={openCategoryModal}>
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
