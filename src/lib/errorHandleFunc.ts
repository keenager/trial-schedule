import { closeToastInSec, showToast } from "@/app/store/ToastProvider";
import { Dispatch, SetStateAction } from "react";

export function toastErrorMsg(
  e: unknown,
  msgSetter: Dispatch<SetStateAction<string>>
) {
  let msg;
  if (e instanceof Error) msg = e.message;
  else msg = String(e);
  msgSetter(msg);
  showToast();
  closeToastInSec(7);
}
