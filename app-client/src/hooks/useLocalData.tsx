import { useState, useEffect } from "react";

const useLocalData = (key: string, initialValue: string) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  });

  const getData = () => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  };
  const setData = (newValue: string) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    }
  }, [key]);

  return { value, getData, setData };
};

export default useLocalData;
