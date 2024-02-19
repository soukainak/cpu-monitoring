import {
  fetchCPULoadData,
  generateTimeIntervals,
  handleCPULevelAlert,
} from "./app.utils";

jest.mock("chart.js", () => ({
  Chart: jest.fn(),
}));
jest.mock("axios", () => ({
  create: jest.fn(),
}));
const localStorageMock = (() => {
  let store: any = {};
  return {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: string) => (store[key] = value.toString()),
    clear: () => (store = {}),
    length: 0,
    removeItem: () => {},
    key: () => "",
  };
})();
global.localStorage = localStorageMock;

jest.mock("../services/app.service.ts", () => ({
  retrieveCPULoadData: () =>
    Promise.resolve({
      data: { cpusLength: 4, loadAverage: 0.75 },
    }),
}));

describe("testing fetchCPULoadData function", () => {
  test("it should retrieve CPU load data and fall functions to compute it", async () => {
    const updateData = jest.fn();
    const setAverageLoad = jest.fn();
    const cpuAverageLoadData: number[] = [0.43, 0.434];

    await fetchCPULoadData(setAverageLoad, cpuAverageLoadData, updateData);

    expect(setAverageLoad).toHaveBeenCalledWith({
      cpusLength: 4,
      loadAverage: 0.75,
    });
    expect(updateData).toHaveBeenCalledWith(0.75);
  });
});

describe("generateTimeIntervals function", () => {
  test("returns array of time intervals for 10 minutes observation window", () => {
    const observationWindow = 10;
    const intervals = generateTimeIntervals(observationWindow);
    expect(intervals).toHaveLength(60); // 60 intervals in 10 minutes
    expect(intervals[0]).toMatch(/^\d{2}:\d{2}:\d{2}$/); // Format: "hh:mm:ss"
  });

  test("returns array of time intervals for 5 minutes observation window", () => {
    const observationWindow = 5;
    const intervals = generateTimeIntervals(observationWindow);
    expect(intervals).toHaveLength(30); // 30 intervals in 5 minutes
    expect(intervals[0]).toMatch(/^\d{2}:\d{2}:\d{2}$/); // Format: "hh:mm:ss"
  });

  test("returns array of time intervals for 1 minute observation window", () => {
    const observationWindow = 1;
    const intervals = generateTimeIntervals(observationWindow);
    expect(intervals).toHaveLength(6); // 6 intervals in 1 minute
    expect(intervals[0]).toMatch(/^\d{2}:\d{2}:\d{2}$/); // Format: "hh:mm:ss"
  });

  test("returns array of time intervals with correct time values", () => {
    // Mock current time
    const mockTime = new Date("2024-02-11T12:00:00"); // 12:00:00
    const spy = jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => mockTime.getTime());

    // Call the function with observation window of 10 minutes
    const observationWindow = 10;
    const intervals = generateTimeIntervals(observationWindow);

    // Calculate expected time intervals
    const expectedIntervals = [
      "11:50:10",
      "11:50:20",
      "11:50:30",
      "11:50:40",
      "11:50:50",
      "11:51:00",
      "11:51:10",
      "11:51:20",
      "11:51:30",
      "11:51:40",
      "11:51:50",
      "11:52:00",
      "11:52:10",
      "11:52:20",
      "11:52:30",
      "11:52:40",
      "11:52:50",
      "11:53:00",
      "11:53:10",
      "11:53:20",
      "11:53:30",
      "11:53:40",
      "11:53:50",
      "11:54:00",
      "11:54:10",
      "11:54:20",
      "11:54:30",
      "11:54:40",
      "11:54:50",
      "11:55:00",
      "11:55:10",
      "11:55:20",
      "11:55:30",
      "11:55:40",
      "11:55:50",
      "11:56:00",
      "11:56:10",
      "11:56:20",
      "11:56:30",
      "11:56:40",
      "11:56:50",
      "11:57:00",
      "11:57:10",
      "11:57:20",
      "11:57:30",
      "11:57:40",
      "11:57:50",
      "11:58:00",
      "11:58:10",
      "11:58:20",
      "11:58:30",
      "11:58:40",
      "11:58:50",
      "11:59:00",
      "11:59:10",
      "11:59:20",
      "11:59:30",
      "11:59:40",
      "11:59:50",
      "12:00:00",
    ];

    // Verify that the function returns the expected time intervals
    expect(intervals).toEqual(expectedIntervals);

    // Restore original implementation of Date.now()
    spy.mockRestore();
  });
});

describe("handleCPULevelAlert function", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test("sets CPU high alert when CPU load is consistently high", () => {
    // Call the function with 12 data points all above or equal to 0.45
    const newAverageOverTime = [
      1.5, 1.6, 1.7, 1.8, 1.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6,
    ];
    handleCPULevelAlert(newAverageOverTime);

    // Verify that localStorage is updated correctly
    expect(localStorage.getItem("cpuHighOccurences")).toBe("1");
    expect(localStorage.getItem("cpuHighMoment")).not.toBe(null);
  });

  test("sets CPU recovery alert when CPU load recovers from high level", () => {
    // Call the function with 12 data points initially high and then low
    const newAverageOverTime = [
      1.5, 1.6, 1.7, 1.8, 1.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6,
    ];
    handleCPULevelAlert(newAverageOverTime);

    // Verify that localStorage is updated correctly
    expect(localStorage.getItem("cpuRecoveredOccurences")).toBe("");
    expect(localStorage.getItem("cpuRecoveredMoment")).toBe("");

    const newAverageOverTimeToRecover = [
      0.3, 0.2, 0.322, 0.12, 0.44, 0.42, 0.32, 0.123, 0.425, 0.334, 0.442, 0.21,
    ];
    handleCPULevelAlert(newAverageOverTimeToRecover);
    expect(localStorage.getItem("cpuRecoveredOccurences")).toBe("1");
    expect(localStorage.getItem("cpuRecoveredMoment")).not.toBe("");
    expect(localStorage.getItem("cpuHighOccurences")).toBe("");
    expect(localStorage.getItem("cpuHighMoment")).toBe("");
  });

  test("does not set any alert when not enough data points", () => {
    // Call the function with less than 12 data points
    const newAverageOverTime = [
      0.4, 0.42, 0.43, 0.44, 0.42, 0.41, 0.43, 0.44, 0.42, 0.43,
    ];
    handleCPULevelAlert(newAverageOverTime);

    // Verify that localStorage remains unchanged
    expect(localStorage.getItem("cpuHighOccurences")).toBe(null);
    expect(localStorage.getItem("cpuRecoveredOccurences")).toBe(null);
  });
});
