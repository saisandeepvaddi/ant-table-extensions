import { useRef, useEffect } from "react";

export default function useDidUpdateEffect(fn, deps) {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      fn();
    } else {
      didMount.current = true;
    }
  }, deps);
}
