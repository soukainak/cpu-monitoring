import axios from "axios";
const instance = axios.create({ baseURL: "http://localhost:8080" });

const retrieveCPULoadData = async () => {
  try {
    const cpuLoadData = await instance.get("/api/data", {
      headers: {
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
