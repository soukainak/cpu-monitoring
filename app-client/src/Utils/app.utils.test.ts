import { handleCPULoadChart } from "./app.utils";
jest.mock("chart.js", () => ({
  Chart: jest.fn(),
}));
jest.mock("axios", () => ({
  create: jest.fn(),
}));
describe("testing handleCPULoadChart function", () => {
  const mockDocument: any = {
    getElementById: jest.fn(() => ({
      getContext: jest.fn(() => ({
        update: jest.fn(),
      })),
    })),
  };
  global.document = mockDocument;

  test("it should handle create a new chart when it doesn't exist", () => {
    const newAverageOverTime: number[] = [];
    const createNewChart = jest.fn();
    const cpuLoadAverageChart = undefined;
    handleCPULoadChart(newAverageOverTime, cpuLoadAverageChart, createNewChart);
    expect(createNewChart).toHaveBeenCalled();
  });

  test("it should modify dataset of the chart when it exists", () => {
    const newAverageOverTime = [0.2, 0.3, 0.4];
    const cpuLoadAverageChart = {
      data: {
        datasets: [
          {
            data: [],
          },
        ],
      },
      update: jest.fn(),
    };
    const createNewChart = jest.fn();

    handleCPULoadChart(newAverageOverTime, cpuLoadAverageChart, createNewChart);

    expect(cpuLoadAverageChart.data.datasets[0].data).toEqual(
      newAverageOverTime
    );
    expect(createNewChart).not.toHaveBeenCalled();
  });

  test("it should remove the first eleemnt of the data after then minutes", () => {
    const newAverageOverTime = new Array(61);
    newAverageOverTime.fill(0.45, 0, 61);
    const cpuLoadAverageChart = {
      data: {
        datasets: [
          {
            data: [],
          },
        ],
      },
      update: jest.fn(),
    };
    const createNewChart = jest.fn();

    handleCPULoadChart(newAverageOverTime, cpuLoadAverageChart, createNewChart);

    expect(cpuLoadAverageChart.data.datasets[0].data).toHaveLength(60);
  });
});

describe("testing createNewChart function", () => {});
