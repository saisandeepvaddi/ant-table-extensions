import { useEffect, useRef, useCallback } from "react";

export function useMountedState() {
  const ref = useRef(false);
  const state = useCallback(() => ref.current, []);
  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  });

  return state;
}
