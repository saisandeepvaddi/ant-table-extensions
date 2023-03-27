import { useCallback, useEffect, useRef } from "react";

export const useIsMounted = () => {
  const state = useRef(false);
  const getState = useCallback(() => state.current, []);
  useEffect(() => {
    state.current = true;
    return () => {
      state.current = false;
    };
  }, []);
  return getState;
};
