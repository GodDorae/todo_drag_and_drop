import { atom } from "recoil";

export interface IToDo {
  id: number;
  text: string;
}

export interface IToDoState {
  [key: string]: IToDo[];
}

const localToDos = JSON.parse(localStorage.getItem("toDo") || "{}");

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: Object.keys(localToDos).length
    ? localToDos
    : {
        TO_DO: [],
        DOING: [],
        DONE: [],
      },
});

const localColumnOrders = JSON.parse(localStorage.getItem("columns") || "[]");

export const columnOrder = atom<string[]>({
  key: "columnOrder",
  default: localColumnOrders.length ? localColumnOrders : ["TO_DO", "DOING", "DONE"],
});
