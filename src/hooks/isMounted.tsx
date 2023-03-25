import { useEffect, useRef, useCallback } from "react";

export function useMountedState(): () => boolean {
  const ref = useRef(false);
  const state = useCallback(() => ref.current, []);
  useEffect(() => {
    ref.current = true;
    return (): void => {
      ref.current = false;
    };
  });

  return state;
}
