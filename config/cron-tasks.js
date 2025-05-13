const { getSimulatedTimestamp } = require("./utils");

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  myJob: {
    task: ({ strapi }) => {
      const createMeterDataset = async (data) => {
        try {
          const meterReadingTimestamp = getSimulatedTimestamp(new Date());
          console.log("meterReadingTimestamp===>", meterReadingTimestamp);
          const meters = await strapi.entityService.findMany(
            "api::meter.meter",
            {
              filters: {},
              populate: {
                energyResource: {
                  populate: {
                    ders: {
                      populate: {
                        appliance: {},
                      },
                      filters: {
                        switched_on: true,
                      },
                    },
                  },
                },
              },
            }
          );
          strapi.log.info(`Found ${meters.length} `);

          // Calculate power factor (random between 0.8 and 1.0)
          strapi.log.info("Starting meter dataset calculations...");

          const addMeterLogs = meters.map(async (meter) => {
            const powerFactor = Number((0.8 + Math.random() * 0.2).toFixed(2));
            strapi.log.debug(
              `Calculated power factor for meter Code${meter.code}, with Id ${meter.id} is ${powerFactor}`
            );

            const totalConsumptionKWh =
              meter.energyResource.ders
                .filter(
                  (der) => der.appliance.name !== "Solar Panel (production)"
                )
                .reduce((acc, der) => acc + der.appliance.baseKWh, 0) *
              meter?.consumptionLoadFactor;
            const totalProductionKWh = meter.energyResource.ders
              .filter(
                (der) => der.appliance.name === "Solar Panel (production)"
              )
              .reduce((acc, der) => {
                return acc + der.appliance.baseKWh;
              }, 0);
            console.log("totalConsumption===>", totalConsumptionKWh);
            console.log("totalProduction===>", totalProductionKWh);

            // Calculate kVAh from kWh and power factor
            const consumptionKVAh = totalConsumptionKWh / powerFactor;
            const productionKVAh = totalProductionKWh / powerFactor;
            strapi.log.debug(
              `Calculated kVAh - Consumption: ${consumptionKVAh}, Production: ${productionKVAh}`
            );

            // Calculate reactive power (kVAR)
            const consumptionKVAR = Math.sqrt(
              Math.pow(consumptionKVAh, 2) - Math.pow(totalConsumptionKWh, 2)
            );
            const productionKVAR = Math.sqrt(
              Math.pow(productionKVAh, 2) - Math.pow(totalProductionKWh, 2)
            );
            strapi.log.debug(
              `Calculated kVAR - Consumption: ${consumptionKVAR}, Production: ${productionKVAR}`
            );

            // Calculate Voltage (random between 230 and 250)
            const voltage = Number((230 + Math.random() * 20).toFixed(0));
            strapi.log.debug(`Calculated voltage: ${voltage}V`);

            // Calculate current
            const consumptionCurrent =
              (totalConsumptionKWh * 1000) / (voltage * 1 * 60);
            const productionCurrent =
              (totalProductionKWh * 1000) / (voltage * 1 * 60);
            strapi.log.debug(
              `Calculated current - Consumption: ${consumptionCurrent}A, Production: ${productionCurrent}A`
            );

            strapi.log.info("Creating meter dataset record...");

            return await strapi.entityService.create(
              "api::meter-dataset.meter-dataset",
              {
                data: {
                  meter: meter.id,
                  consumptionKWh: totalConsumptionKWh,
                  productionKWh: totalProductionKWh,
                  consumptionKVAh: consumptionKVAh,
                  avgCurrent: (consumptionCurrent + productionCurrent) / 2,
                  avgVoltage: voltage,
                  reactivePowerKVAR: consumptionKVAR + productionKVAR,
                  powerFactor: powerFactor,
                  timestamp: meterReadingTimestamp,
                  publishedAt: new Date(),
                },
              }
            );
          });
          const response = await Promise.all(addMeterLogs);

          strapi.log.info("Successfully created meter dataset record");
          return response;
        } catch (error) {
          strapi.log.error("Error creating meter dataset:", error);
          throw error;
        }
      };

      createMeterDataset();
    },
    options: {
      rule: process.env.LOG_CONSUMPTION_INTERVAL,
    },
  },
  dailyMeterDataAggregation: {
    task: ({ strapi }) => {
      const aggregateDailyData = async () => {
        try {
          // Get all meters
          const meters = await strapi.db.query("api::meter.meter").findMany({
            populate: ["energyResource"],
          });

          strapi.log.info(
            `Starting daily aggregation for ${meters.length} meters`
          );
        } catch (error) {
          strapi.log.error(`Error in daily aggregation: ${error.message}`);
        }
      };

      aggregateDailyData();
    },
    options: {
      rule: process.env.AGGREGATE_CONSUMPTION_INTERVAL, // Runs at midnight every day
    },
  },
};
