import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// useState that survives app restarts. `ready` flips true once storage has been read.
export function usePersisted(key, initial) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (alive && raw != null) setValue(JSON.parse(raw));
      })
      .catch((error) => {
        console.error(`Unable to load persisted value for "${key}".`, error);
      })
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [key]);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(key, JSON.stringify(value)).catch((error) => {
        console.error(`Unable to save persisted value for "${key}".`, error);
      });
    }
  }, [key, value, ready]);

  const set = useCallback((next) => {
    setValue((current) => (typeof next === 'function' ? next(current) : next));
  }, []);
  return [value, set, ready];
}
