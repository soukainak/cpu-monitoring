import {
  handleCPULoadData,
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

describe("testing handleCPULoadData function", () => {
  test("it should retrieve CPU load data and fall functions to compute it", async () => {
    const updateData = jest.fn();
    const setAverageLoad = jest.fn();
    const cpuAverageLoadData: number[] = [0.43, 0.434];
    const setData = jest.fn();
    const getData = jest.fn();

    await handleCPULoadData(
      setAverageLoad,
      cpuAverageLoadData,
      updateData,
      setData,
      getData
    );

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

describe("handleCPULevelAlert", () => {
  const mockSetData = jest.fn();
  const mockGetData = jest.fn((key) => "");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should do nothing when newAverageOverTime has length less than 12", () => {
    const newAverageOverTime = [70, 60, 75, 85, 90, 70, 60, 65, 80, 75, 70];
    handleCPULevelAlert(newAverageOverTime, mockSetData, mockGetData);

    expect(mockSetData).not.toHaveBeenCalled();
  });

  it("should set CPU high moment when CPU is high and no previous high moment stored", () => {
    const newAverageOverTime = [85, 90, 95, 85, 80, 85, 90, 85, 88, 90, 85, 88];
    mockGetData.mockImplementation((key) =>
      key === "cpuHighMoment" ? "" : "0"
    );
    handleCPULevelAlert(newAverageOverTime, mockSetData, mockGetData);

    expect(mockSetData).toHaveBeenCalledWith(
      "cpuHighMoment",
      expect.any(String)
    );
  });

  it("should set CPU high moment and increase occurrence count when CPU is high", () => {
    const newAverageOverTime = Array(12).fill(90);
    mockGetData.mockImplementation((key) =>
      key === "cpuHighOccurences" ? "3" : ""
    );
    handleCPULevelAlert(newAverageOverTime, mockSetData, mockGetData);

    expect(mockSetData).toHaveBeenCalledWith(
      "cpuHighMoment",
      expect.any(String)
    );
    expect(mockSetData).toHaveBeenCalledWith("cpuHighOccurences", "4");
  });

  it("should set CPU recovered moment and increase recovery occurrence count when CPU has recovered", () => {
    const newAverageOverTime = Array(12).fill(70);
    mockGetData.mockImplementation((key) => {
      switch (key) {
        case "cpuHighMoment":
          return "1234567890";
        case "cpuRecoveredOccurences":
          return "2";
        default:
          return "";
      }
    });
    handleCPULevelAlert(newAverageOverTime, mockSetData, mockGetData);

    const averageOverTimeAfterRecover = Array(12).fill(0);
    handleCPULevelAlert(averageOverTimeAfterRecover, mockSetData, mockGetData);

    expect(mockSetData).toHaveBeenCalledWith("cpuHighMoment", "");
    expect(mockSetData).toHaveBeenCalledWith(
      "cpuRecoveredMoment",
      expect.any(String)
    );
    expect(mockSetData).toHaveBeenCalledWith("cpuRecoveredOccurences", "3");
  });
});
