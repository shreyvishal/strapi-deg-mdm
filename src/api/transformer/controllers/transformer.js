'use strict';

/**
 * transformer controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::transformer.transformer');
