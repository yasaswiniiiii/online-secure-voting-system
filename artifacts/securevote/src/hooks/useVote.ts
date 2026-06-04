import { useState } from "react";

interface SelectedCandidate {
  id: number;
  name: string;
  party: string;
  symbol: string;
  imageUrl: string;
  electionId: number;
}

let _selected: SelectedCandidate | null = null;
const _listeners: Array<() => void> = [];

function notifyListeners() {
  _listeners.forEach((l) => l());
}

export function setSelectedCandidate(candidate: SelectedCandidate | null) {
  _selected = candidate;
  notifyListeners();
}

export function useVote() {
  const [, forceUpdate] = useState(0);

  const subscribe = () => {
    const listener = () => forceUpdate((n) => n + 1);
    _listeners.push(listener);
    return () => {
      const idx = _listeners.indexOf(listener);
      if (idx !== -1) _listeners.splice(idx, 1);
    };
  };

  useState(subscribe);

  return {
    selectedCandidate: _selected,
    setSelectedCandidate,
    clearSelection: () => setSelectedCandidate(null),
  };
}
