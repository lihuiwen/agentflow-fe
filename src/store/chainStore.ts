import { create } from 'zustand';

type State = {
  isLinking: boolean;
};

type Action = {
  updateIsLinking: (isLinking: State['isLinking']) => void;
};

const useChainStore = create<State & Action>((set) => ({
  isLinking: false,
  updateIsLinking: (isLinking) => set(() => ({ isLinking: isLinking })),
}));

export { useChainStore };