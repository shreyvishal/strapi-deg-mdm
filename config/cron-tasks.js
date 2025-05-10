module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  myJob: {
    task: ({ strapi }) => {
      const createMeterDataset = async (data) => {
        return;
        try {
          const meters = await strapi.entityService.findMany(
            "api::meter.meter",
            {
              filters: {
                energyResource: {
                  $notNull: true,
                },
              },
              populate: ["energyResource"],
            }
          );
          strapi.log.info(
            `Found ${meters.length} meters with energy resources`
          );
          // Calculate power factor (random between 0.8 and 1.0)
          strapi.log.info("Starting meter dataset calculations...");
          const powerFactor = 0.8 + Math.random() * 0.2;
          strapi.log.debug(`Calculated power factor: ${powerFactor}`);
          // Calculate kVAh from kWh and power factor
          const consumptionKVAh = data.consumptionKWh / powerFactor;
          const productionKVAh = data.productionKWh / powerFactor;
          strapi.log.debug(
            `Calculated kVAh - Consumption: ${consumptionKVAh}, Production: ${productionKVAh}`
          );
          // Calculate reactive power (kVAR)
          const consumptionKVAR = Math.sqrt(
            Math.pow(consumptionKVAh, 2) - Math.pow(data.consumptionKWh, 2)
          );
          const productionKVAR = Math.sqrt(
            Math.pow(productionKVAh, 2) - Math.pow(data.productionKWh, 2)
          );
          strapi.log.debug(
            `Calculated kVAR - Consumption: ${consumptionKVAR}, Production: ${productionKVAR}`
          );
          // Calculate voltage (random between 230 and 250)
          const voltage = 230 + Math.random() * 20;
          strapi.log.debug(`Calculated voltage: ${voltage}V`);
          // Calculate current
          const consumptionCurrent =
            (data.consumptionKWh * 1000) / (voltage * 1 * 60);
          const productionCurrent =
            (data.productionKWh * 1000) / (voltage * 1 * 60);
          strapi.log.debug(
            `Calculated current - Consumption: ${consumptionCurrent}A, Production: ${productionCurrent}A`
          );
          strapi.log.info("Creating meter dataset record...");
          const response = await strapi.entityService.create(
            "api::meter-dataset.meter-dataset",
            {
              data: {
                meter: data.meterId,
                consumptionKWh: data.consumptionKWh,
                productionKWh: data.productionKWh,
                consumptionKVAh: consumptionKVAh,
                avgCurrent: (consumptionCurrent + productionCurrent) / 2,
                avgVoltage: voltage,
                reactivePowerKVAR: consumptionKVAR + productionKVAR,
                powerFactor: powerFactor,
                timestamp: data.timestamp,
                publishedAt: new Date(),
              },
            }
          );
          strapi.log.info("Successfully created meter dataset record");
          return response;
        } catch (error) {
          strapi.log.error("Error creating meter dataset:", error);
          throw error;
        }
      };
      const data = {
        meterId: 1,
        consumptionKWh: 0.05,
        productionKWh: 0.02,
        timestamp: new Date(),
      };
      createMeterDataset(data);
    },
    options: {
      rule: "*/15 * * * * *",
    },
  },
};
