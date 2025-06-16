import { useCallback, useEffect, useRef, useState } from "react";

export function useStateController<T>(initValue: T, controlState?: T, onChange?: (value: T) => void): [T, (value: T) => void] {
  const [state, setState] = useState(controlState || initValue);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange])
  const setStateController = useCallback((value: T) => {
    onChangeRef.current?.(value);
    setState(value);
  }, []);
  const resultState = typeof controlState === 'undefined' ? state : controlState;
  return [resultState, setStateController] as const;
}
