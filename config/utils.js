"use strict";

const timeScalingRatio = () => {
  return (
    Number(process.env.SCALED_CLOCK_SEC) /
    Number(process.env.REAL_CLOCK_INTERVAL_SEC)
  );
};

// const getSimulatedTimestamp = (timestamp) => {
//   console.log("timestamp===>", timestamp);
//   const ms_time_epoch = new Date(timestamp).getTime();
//   const SIMULATION_EPOCH = new Date("2025-01-01T00:00:00Z").getTime();
//   const scaledTime =
//     SIMULATION_EPOCH + (ms_time_epoch / 1000) * timeScalingRatio() * 1000; // ms

//   return new Date(scaledTime).toISOString();
// };

function getSimulatedTimestamp(timestamp) {
  const realStartTime = "2025-05-13T10:52:10.008Z";
  const simStartTime = "2025-05-13T10:52:10.008Z";
  const deltaRealMs =
    new Date(timestamp).getTime() - new Date(realStartTime).getTime(); // real elapsed time
  const deltaSimMs = deltaRealMs * timeScalingRatio();

  console.log(
    `current timestamp: ${timestamp} is converted to: ${new Date(
      new Date(simStartTime).getTime() + deltaSimMs
    ).toISOString()}, as per time scaling ratio: ${timeScalingRatio()}`
  );
  return new Date(new Date(simStartTime).getTime() + deltaSimMs).toISOString();
}

module.exports = {
  timeScalingRatio,
  getSimulatedTimestamp,
};
