import axios from "axios";
const instance = axios.create({ baseURL: process.env.REACT_APP_BASE_URL });

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
