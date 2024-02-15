import axios from "axios";

const retrieveCPULoadData = async () => {
  const instance = axios.create({ baseURL: "http://localhost:8080" });
  try {
    console.log("on rhe try");
    const cpuLoadData = await instance.get("/api/data", {
      headers: {
        credentials: "include",
        mode: "same-origin",
        "content-type": "application/json",
        dataType: "json",
      },
    });

    return cpuLoadData;
  } catch (error) {
    console.error(error);
  }
};

export { retrieveCPULoadData };
