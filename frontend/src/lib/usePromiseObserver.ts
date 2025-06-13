import { useState, useEffect, useCallback } from 'react';

interface PromiseState<T> {
  loading: boolean;
  data: T | null;
  error: Error | null;
}

interface UsePromiseObserverResult<T, R> {
  states: { [key: string]: PromiseState<R> };
  execute: (key: string, data: T) => void;
  listener: (key: string) => 'idle' | 'loading' | 'resolved' | 'rejected';
}

interface PromiseMap<T, R> {
  [key: string]: (data: T) => Promise<R>;
}

export function usePromiseObserver<T, R>(
  promiseMap: PromiseMap<T, R>,
): UsePromiseObserverResult<T, R> {
  const [states, setStates] = useState<{ [key: string]: PromiseState<R> }>(() =>
    Object.keys(promiseMap).reduce(
      (acc, key) => {
        acc[key] = { loading: false, data: null, error: null };
        return acc;
      },
      {} as { [key: string]: PromiseState<R> },
    ),
  );

  const execute = useCallback(
    (key: string, data: T) => {
      setStates((prevStates) => ({
        ...prevStates,
        [key]: { loading: true, data: null, error: null },
      }));

      promiseMap[key](data)
        .then((result) => {
          setStates((prevStates) => ({
            ...prevStates,
            [key]: { loading: false, data: result, error: null },
          }));
        })
        .catch((err) => {
          setStates((prevStates) => ({
            ...prevStates,
            [key]: { loading: false, data: null, error: err },
          }));
        });
    },
    [promiseMap],
  );

  const listener = useCallback(
    (key: string) => {
      if (!states[key]) {
        return 'idle';
      }
      const state = states[key];
      if (
        state.loading === false &&
        state.error !== null &&
        state.data !== null
      ) {
        return 'idle';
      }
      if (state.loading === true) {
        return 'loading';
      }
      if (state.data !== null) {
        return 'resolved';
      }
      if (state.error !== null) {
        return 'rejected';
      }
      return 'idle'; // Default case
    },
    [states],
  );

  return { states, execute, listener };
}
