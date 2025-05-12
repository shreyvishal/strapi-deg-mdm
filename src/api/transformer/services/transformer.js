'use strict';

/**
 * transformer service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::transformer.transformer');
