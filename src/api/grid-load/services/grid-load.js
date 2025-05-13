'use strict';

/**
 * grid-load service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::grid-load.grid-load');
