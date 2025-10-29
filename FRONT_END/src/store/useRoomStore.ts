import { create } from "zustand";

const useRoomStore = create<{
  room: string;
  members: number;
  setRoom: (room: string, members:number) => void;
}>((set) => ({
  room: "",
  members:0,
  setRoom: (room, members) => set({ room, members }),
}));

export default useRoomStore;
