const useLocalData = () => {
  const getData = (key: string) => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? storedValue : "";
  };
  const setData = (key: string, newValue: string) => {
    localStorage.setItem(key, newValue);
  };

  return { getData, setData };
};

export default useLocalData;
