import { create } from 'zustand'

const useUserStore = create<{
  name: string
  avatar: string
  setUser: (name: string, avatar: string) => void
}>((set) => ({
  name: '',
  avatar: '',
  setUser: (name, avatar) => set({ name, avatar }),
}))


export default useUserStore
