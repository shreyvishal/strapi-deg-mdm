'use strict';

/**
 * energy-resource service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::energy-resource.energy-resource');
