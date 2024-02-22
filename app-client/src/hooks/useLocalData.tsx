import { useState, useEffect } from "react";

const useLocalData = () => {
  //   const [value, setValue] = useState();

  const getData = (key: string) => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? storedValue : "";
  };
  const setData = (key: string, newValue: string) => {
    localStorage.setItem(key, newValue);
  };

  //   useEffect(() => {
  //     const storedValue = localStorage.getItem(key);
  //     if (storedValue) {
  //       setValue(storedValue);
  //     }
  //   }, [key]);

  return { getData, setData };
};

export default useLocalData;
