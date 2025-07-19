import { create } from "zustand";

type State = {
  address: `0x${string}` | undefined;
}

type Action = {
  updateAddress: (address: State['address']) => void;
}

const useUserStore = create<State & Action>((set) => ({
  address: undefined,
  updateAddress: (address) => set(() => ({address: address}))
}))

export { useUserStore };