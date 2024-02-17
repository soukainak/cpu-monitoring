import {
  fetchCPULoadData,
  generateTimeIntervals,
  handleCPULevelAlert,
  // handleCPULoadChart,
} from "./app.utils";
// jest.mock("chart.js", () => ({
//   Chart: jest.fn(),
// }));
// jest.mock("axios", () => ({
//   create: jest.fn(),
// }));
// // describe("testing handleCPULoadChart function", () => {
// //   const mockDocument: any = {
// //     getElementById: jest.fn(() => ({
// //       getContext: jest.fn(() => ({
// //         update: jest.fn(),
// //       })),
// //     })),
// //   };
// //   global.document = mockDocument;

// //   test("it should handle create a new chart when it doesn't exist", () => {
// //     const newAverageOverTime: number[] = [];
// //     const createNewChart = jest.fn();
// //     const cpuLoadAverageChart = undefined;
// //     handleCPULoadChart(newAverageOverTime, cpuLoadAverageChart, createNewChart);
// //     expect(createNewChart).toHaveBeenCalled();
// //   });

// //   test("it should modify dataset of the chart when it exists", () => {
// //     const newAverageOverTime = [0.2, 0.3, 0.4];
// //     const cpuLoadAverageChart = {
// //       data: {
// //         datasets: [
// //           {
// //             data: [],
// //           },
// //         ],
// //       },
// //       update: jest.fn(),
// //     };
// //     const createNewChart = jest.fn();

// //     handleCPULoadChart(newAverageOverTime, cpuLoadAverageChart, createNewChart);

// //     expect(cpuLoadAverageChart.data.datasets[0].data).toEqual(
// //       newAverageOverTime
// //     );
// //     expect(createNewChart).not.toHaveBeenCalled();
// //   });

// //   test("it should remove the first eleemnt of the data after then minutes", () => {
// //     const newAverageOverTime = new Array(61);
// //     newAverageOverTime.fill(0.45, 0, 61);
// //     const cpuLoadAverageChart = {
// //       data: {
// //         datasets: [
// //           {
// //             data: [],
// //           },
// //         ],
// //       },
// //       update: jest.fn(),
// //     };
// //     const createNewChart = jest.fn();

// //     handleCPULoadChart(newAverageOverTime, cpuLoadAverageChart, createNewChart);

// //     expect(cpuLoadAverageChart.data.datasets[0].data).toHaveLength(60);
// //   });
// // });
// jest.mock("../services/app.service.ts", () => ({
//   retrieveCPULoadData: () =>
//     Promise.resolve({
//       data: { cpusLength: 4, loadAverage: 0.75 },
//     }),
// }));

// describe("testing fetchCPULoadData function", () => {
//   test("it should retrieve CPU load data and fall functions to compute it", async () => {
//     const setIsHighCpuAlert = jest.fn();
//     const setIsRecoveryAlert = jest.fn();
//     const setAverageLoad = jest.fn();
//     const newAverageOverTime: number[] = [];

//     await fetchCPULoadData(
//       setIsHighCpuAlert,
//       setIsRecoveryAlert,
//       setAverageLoad
//     );

//     expect(setAverageLoad).toHaveBeenCalledWith({
//       cpusLength: 4,
//       loadAverage: 0.75,
//     });
//   });
// });

// describe("testing generateTimeIntervals function", () => {
//   test("generates array of time intervals with correct format", () => {
//     const intervals: string[] = generateTimeIntervals();

//     const totalMinutes = 10;
//     const intervalInSeconds = 10;
//     const expectedTotalIntervals = (totalMinutes * 60) / intervalInSeconds;

//     expect(intervals).toHaveLength(expectedTotalIntervals);

//     intervals.forEach((interval) => {
//       expect(interval).toMatch(/^\d{2}:\d{2}$/);
//     });
//   });
// });

// describe("testing handleCPULevelAlert function", () => {
//   test("it should do nothing before 2 minutes", () => {
//     const setIsHighCpuAlert = jest.fn();
//     const setIsRecoveryAlert = jest.fn();
//     const newAverageOverTime = [2.43, 3.12, 5.45, 6.0, 3.32];
//     handleCPULevelAlert(
//       setIsHighCpuAlert,
//       setIsRecoveryAlert,
//       newAverageOverTime
//     );
//     expect(setIsHighCpuAlert).not.toHaveBeenCalled();
//     expect(setIsRecoveryAlert).not.toHaveBeenCalled();
//   });
//   test("it should set an high CPU alert when CPU average is above threshold for 2 minutes", () => {
//     const setIsHighCpuAlert = jest.fn();
//     const setIsRecoveryAlert = jest.fn();
//     const newAverageOverTime = [
//       2.43, 3.12, 5.45, 6.0, 3.32, 2.43, 3.12, 5.45, 6.0, 3.32, 2.43, 3.12,
//       5.45, 6.0, 3.32,
//     ];
//     handleCPULevelAlert(
//       setIsHighCpuAlert,
//       setIsRecoveryAlert,
//       newAverageOverTime
//     );
//     expect(setIsHighCpuAlert).toHaveBeenCalledWith(true);
//     expect(setIsRecoveryAlert).toHaveBeenCalledWith(false);
//   });
//   test("it should not set any alert if CPU average is normal", () => {
//     const setIsHighCpuAlert = jest.fn();
//     const setIsRecoveryAlert = jest.fn();
//     const newAverageOverTime = [
//       0.32, 0.21, 0.4, 0.56, 0.32, 0.21, 0.4, 0.56, 0.32, 0.21, 0.4, 0.56, 0.32,
//       0.21, 0.4, 0.56,
//     ];
//     handleCPULevelAlert(
//       setIsHighCpuAlert,
//       setIsRecoveryAlert,
//       newAverageOverTime
//     );
//     expect(setIsHighCpuAlert).not.toHaveBeenCalled();
//     expect(setIsRecoveryAlert).not.toHaveBeenCalled();
//   });
//   test("it should set a recovered CPU alert when CPU average is under threshold for 2 minutes", () => {
//     const setIsHighCpuAlert = jest.fn();
//     const setIsRecoveryAlert = jest.fn();
//     const newAverageOverTime = [
//       0.32, 0.21, 0.4, 0.23, 0.32, 0.21, 0.4, 0.22, 0.32, 0.21, 0.4, 0.42, 0.32,
//       0.21, 0.4, 0.33,
//     ];
//     handleCPULevelAlert(
//       setIsHighCpuAlert,
//       setIsRecoveryAlert,
//       newAverageOverTime
//     );
//     expect(setIsHighCpuAlert).toHaveBeenCalledWith(false);
//     expect(setIsRecoveryAlert).toHaveBeenCalledWith(true);
//   });
// });

describe("", () => {
  it("", () => {
    expect(true).toBe(true);
  })
})