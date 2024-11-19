export type CheckListActionType = {
  type: "init" | "toggle" | "change";
  data?: boolean[];
  idx?: number;
  isChecked: boolean;
};

export default function checkListReducer(
  checkList: boolean[],
  action: CheckListActionType
) {
  switch (action.type) {
    case "init": {
      return action.data!;
    }
    case "toggle": {
      return [...checkList].fill(action.isChecked);
    }
    case "change": {
      if (action.idx == undefined) throw Error("idx is required to change");
      const newCheckList = [...checkList];
      newCheckList[action.idx] = action.isChecked;
      return newCheckList;
    }
    default: {
      throw Error(`Wrong action type: ${action.type}`);
    }
  }
}
